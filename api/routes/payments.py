"""Stripe payments, subscriptions, and webhook handling."""
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from api.core.db import get_db
from api.core.config import settings
from api.models.user import User, SubscriptionTier
from api.models.subscription import Subscription, Plan
from api.routes.users import current_user
import json, hmac, hashlib, time, uuid
import urllib.request, urllib.parse

router = APIRouter()

def stripe_request(method: str, path: str, data: dict = None):
    url = f"https://api.stripe.com/v1{path}"
    encoded = urllib.parse.urlencode(data).encode() if data else None
    req = urllib.request.Request(url, data=encoded, method=method, headers={
        "Authorization": f"Bearer {settings.STRIPE_SECRET_KEY}",
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": "2023-10-16",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def _tier_for_plan(plan: Plan) -> SubscriptionTier:
    """Backward-compatible coarse tier for legacy feature checks.

    Fine-grained entitlements must use the Plan/features record, not this enum.
    """
    name = plan.name.lower()
    if "enterprise" in name or "school" in name:
        return SubscriptionTier.ENTERPRISE
    if any(token in name for token in ("pro", "family", "educator")):
        return SubscriptionTier.PRO
    return SubscriptionTier.BASIC


@router.get("/plans")
async def list_active_plans(db: AsyncSession = Depends(get_db)):
    """Return the server-authoritative active plan catalogue for pricing UIs."""
    result = await db.execute(select(Plan).where(Plan.is_active.is_(True)))
    plans = result.scalars().all()
    return {
        "plans": [
            {
                "id": str(plan.id),
                "name": plan.name,
                "amount_cents": plan.amount_cents,
                "currency": plan.currency,
                "interval": plan.interval.value if hasattr(plan.interval, "value") else str(plan.interval),
                "features": plan.features or {},
            }
            for plan in plans
        ]
    }


@router.post("/create-checkout-session")
async def create_checkout_session(
    plan_id: str,
    user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create Stripe Checkout using an internal, active Plan record.

    The client never selects an arbitrary Stripe price ID.
    """
    try:
        internal_plan_id = uuid.UUID(plan_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid plan") from exc

    result = await db.execute(
        select(Plan).where(Plan.id == internal_plan_id, Plan.is_active.is_(True))
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found or inactive")
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=503, detail="Billing is not configured")

    session = stripe_request("POST", "/checkout/sessions", {
        "mode": "subscription",
        "payment_method_types[]": "card",
        "line_items[0][price]": plan.stripe_price_id,
        "line_items[0][quantity]": "1",
        "customer_email": user.email,
        "success_url": f"{settings.ALLOWED_ORIGINS[0]}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        "cancel_url": f"{settings.ALLOWED_ORIGINS[0]}/payment/cancel",
        "metadata[user_id]": str(user.id),
        "metadata[plan_id]": str(plan.id),
        "allow_promotion_codes": "true",
        "billing_address_collection": "auto",
    })
    return {"checkout_url": session["url"], "session_id": session["id"]}


@router.post("/create-portal-session")
async def customer_portal(user: User = Depends(current_user)):
    """Stripe customer portal for managing subscriptions."""
    if not user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No billing account found")
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=503, detail="Billing is not configured")
    session = stripe_request("POST", "/billing_portal/sessions", {
        "customer": user.stripe_customer_id,
        "return_url": f"{settings.ALLOWED_ORIGINS[0]}/account",
    })
    return {"portal_url": session["url"]}


@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None),
                          db: AsyncSession = Depends(get_db)):
    """Stripe webhook handler — validates signature before processing."""
    body = await request.body()
    if not _verify_stripe_sig(body, stripe_signature, settings.STRIPE_WEBHOOK_SECRET):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
    event = json.loads(body)
    etype = event["type"]
    data = event["data"]["object"]
    if etype == "checkout.session.completed":
        metadata = data.get("metadata", {})
        user_id = metadata.get("user_id")
        plan_id = metadata.get("plan_id")
        customer_id = data.get("customer")
        if user_id:
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            if user:
                user.stripe_customer_id = customer_id
                if plan_id:
                    try:
                        parsed_plan_id = uuid.UUID(plan_id)
                    except ValueError:
                        parsed_plan_id = None
                    if parsed_plan_id:
                        plan_result = await db.execute(select(Plan).where(Plan.id == parsed_plan_id))
                        plan = plan_result.scalar_one_or_none()
                        if plan:
                            user.subscription_tier = _tier_for_plan(plan)
    elif etype == "customer.subscription.updated":
        status = data.get("status")
        sub_id = data.get("id")
        result = await db.execute(select(Subscription).where(
            Subscription.stripe_subscription_id == sub_id))
        sub = result.scalar_one_or_none()
        if sub:
            sub.status = status
    elif etype == "customer.subscription.deleted":
        sub_id = data.get("id")
        result = await db.execute(select(Subscription).where(
            Subscription.stripe_subscription_id == sub_id))
        sub = result.scalar_one_or_none()
        if sub:
            sub.status = "cancelled"
            user_result = await db.execute(select(User).where(User.id == sub.user_id))
            user = user_result.scalar_one_or_none()
            if user:
                user.subscription_tier = SubscriptionTier.FREE
    await db.commit()
    return {"received": True}


def _verify_stripe_sig(payload: bytes, sig_header: str, secret: str) -> bool:
    if not sig_header or not secret:
        return False
    try:
        parts = {k: v for k, v in (p.split("=", 1) for p in sig_header.split(","))}
        ts = int(parts.get("t", 0))
        if abs(time.time() - ts) > 300:
            return False
        signed = f"{ts}.".encode() + payload
        expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, parts.get("v1", ""))
    except Exception:
        return False
