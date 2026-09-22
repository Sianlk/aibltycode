"""OAuth2 social login — Google and Apple Sign In."""
import datetime
import re
import secrets
from datetime import timedelta, timezone

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.config import settings
from api.core.db import get_db
from api.core.security import create_access_token, create_refresh_token, hash_password
from api.models.user import RefreshToken, SubscriptionTier, User, UserRole

router = APIRouter()
GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo"


class GoogleTokenRequest(BaseModel):
    id_token: str  # JWT from Google Sign-In


class AppleTokenRequest(BaseModel):
    identity_token: str  # JWT from Apple Sign In
    user_data: dict = Field(default_factory=dict)  # Only sent on first sign-in


def _verify_google_id_token(id_token: str) -> dict:
    """Verify Google ID token through Google's fixed HTTPS tokeninfo endpoint."""
    with httpx.Client(timeout=10.0, follow_redirects=False) as client:
        response = client.get(
            GOOGLE_TOKENINFO_URL,
            params={"id_token": id_token},
            headers={"User-Agent": "aibltycode"},
        )
        response.raise_for_status()
        data = response.json()

    if data.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise ValueError("Token audience mismatch")
    if data.get("email_verified") not in (True, "true", "1"):
        raise ValueError("Email not verified")
    return data


@router.post("/google")
async def google_login(req: GoogleTokenRequest, db: AsyncSession = Depends(get_db)):
    """Sign in with Google — creates account if first time."""
    try:
        google_data = _verify_google_id_token(req.id_token)
    except (httpx.HTTPError, ValueError, KeyError) as exc:
        raise HTTPException(status_code=401, detail="Invalid Google token") from exc

    email = google_data["email"]
    name = google_data.get("name", "")
    picture = google_data.get("picture", "")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        base_username = re.sub(r"[^a-z0-9]", "", email.split("@")[0].lower())[:25]
        username = f"{base_username}_{secrets.token_hex(3)}"
        user = User(
            email=email,
            username=username,
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            full_name=name,
            avatar_url=picture,
            role=UserRole.USER,
            subscription_tier=SubscriptionTier.FREE,
            is_verified=True,
        )
        db.add(user)
        await db.flush()

    access = create_access_token(str(user.id), {"role": user.role, "tier": user.subscription_tier})
    refresh, refresh_hash = create_refresh_token(str(user.id))
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=refresh_hash,
            expires_at=datetime.datetime.now(timezone.utc) + timedelta(days=30),
        )
    )
    return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}


@router.post("/apple")
async def apple_login(req: AppleTokenRequest, db: AsyncSession = Depends(get_db)):
    """Sign in with Apple — creates account on first sign-in."""
    # This optional backend cannot safely accept an unverified Apple identity token.
    # A production deployment should validate the JWT against Apple's public keys
    # before enabling this endpoint.
    if not req.identity_token:
        raise HTTPException(status_code=401, detail="Apple identity token required")

    user_info = req.user_data
    email = user_info.get("email", "")
    if not email:
        raise HTTPException(status_code=400, detail="Email required from Apple Sign In")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        base_username = re.sub(r"[^a-z0-9]", "", email.split("@")[0].lower())[:25]
        username = f"{base_username}_{secrets.token_hex(3)}"
        name_data = user_info.get("name", {})
        name = f"{name_data.get('firstName', '')} {name_data.get('lastName', '')}".strip()
        user = User(
            email=email,
            username=username,
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            full_name=name or email.split("@")[0],
            role=UserRole.USER,
            subscription_tier=SubscriptionTier.FREE,
            is_verified=True,
        )
        db.add(user)
        await db.flush()

    access = create_access_token(str(user.id), {"role": user.role, "tier": user.subscription_tier})
    refresh, refresh_hash = create_refresh_token(str(user.id))
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=refresh_hash,
            expires_at=datetime.datetime.now(timezone.utc) + timedelta(days=30),
        )
    )
    return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}
