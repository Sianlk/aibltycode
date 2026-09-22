"""Stripe payments, subscriptions, and webhook handling."""
import hashlib
import hmac
import json
import time

import httpx
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.config import settings
from api.core.db import get_db
from api.models.subscription import Subscription
from api.models.user import SubscriptionTier, User
from api.routes.users import current_user

router = APIRouter()
STRIPE_API_BASE = "https://api.stripe.com/v1"


def stripe_request(method: str, path: str, data: dict | None = None) -> dict:
    """Call Stripe over a fixed HTTPS origin without accepting arbitrary URLs."""
    method = method.upper()
    if method not in {"GET", "POST", "DELETE"}:
        raise ValueError("Unsupported Stripe HTTP method")
    if not path.startswith("/") or "://" in path:
        raise ValueError("Stripe path must be relative")

    with httpx.Client(timeout=30.0, follow_redirects=False) as client:
        response = client.request(
            method,
            f"{STRIPE_API_BASE}{path}",
            data=data,
            headers={
                "Authorization": f"Bearer {settings.STRIPE_SECRET_KEY}",
                "Content-Type": "application/x-www-form-urlencoded",
                "Stripe-Version": "2023-10-16",
            },
        )
        response.raise_for_status()
        return response.json()


@router.post("/create-checkout-session")
async def create_checkout_session(price_id: str, user: User = Depends(current_user)):
    """Create Stripe Checkout session for subscription purchase."""
    session = stripe_request(
        "POST",
        "/checkout/sessions",
        {
            "mode": "subscription",
            "payment_method_types[]": "card",
            "line_items[0][price]": price_id,
            "line_items[0][quantity]": "1",
            "customer_email": user.email,
            "success_url": f"{settings.ALLOWED_ORIGINS[0]}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            "cancel_url": f"{settings.ALLOWED_ORIGINS[0]}/payment/cancel",
            "metadata[user_id]": str(user.id),
            "allow_promotion_codes": "true",
            "billing_address_collection": "auto",
        },
    )
    return {"checkout_url": session["url"], "session_id": session["id"]}


@router.post("/create-portal-session")
async def customer_portal(user: User = Depends(current_user)):
    """Stripe customer portal for managing subscriptions."""
    if not user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No billing account found")
    session = stripe_request(
        "POST",
        "/billing_portal/sessions",
        {
            "customer": user.stripe_customer_id,
            "return_url": f"{settings.ALLOWED_ORIGINS[0]}/account",
        },
    )
    return {"portal_url": session["url"]}


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str | None = Header(None),
    db: AsyncSession = Depends(get_db),
):
    """Stripe webhook handler — validates signature before processing."""
    body = await request.body()
    if not _verify_stripe_sig(body, stripe_signature, settings.STRIPE_WEBHOOK_SECRET):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event = json.loads(body)
    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        user_id = data.get("metadata", {}).get("user_id")
        customer_id = data.get("customer")
        if user_id:
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            if user:
                user.stripe_customer_id = customer_id
                user.subscription_tier = SubscriptionTier.BASIC
    elif event_type == "customer.subscription.updated":
        status = data.get("status")
        subscription_id = data.get("id")
        result = await db.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()
        if subscription:
            subscription.status = status
    elif event_type == "customer.subscription.deleted":
        subscription_id = data.get("id")
        result = await db.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()
        if subscription:
            subscription.status = "cancelled"
            user_result = await db.execute(select(User).where(User.id == subscription.user_id))
            user = user_result.scalar_one_or_none()
            if user:
                user.subscription_tier = SubscriptionTier.FREE

    return {"received": True}


def _verify_stripe_sig(payload: bytes, sig_header: str | None, secret: str) -> bool:
    if not sig_header or not secret:
        return False
    try:
        parts = {key: value for key, value in (part.split("=", 1) for part in sig_header.split(","))}
        timestamp = int(parts.get("t", 0))
        if abs(time.time() - timestamp) > 300:
            return False
        signed = f"{timestamp}.".encode() + payload
        expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, parts.get("v1", ""))
    except (ValueError, TypeError):
        return False
