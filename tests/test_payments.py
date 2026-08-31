"""Tests for payment endpoint access control and Stripe signature validation."""
import json

import pytest


@pytest.mark.asyncio
async def test_webhook_invalid_signature_rejected(client):
    payload = json.dumps({"type": "payment_intent.succeeded", "data": {}})
    response = await client.post(
        "/api/v1/payments/webhook",
        content=payload,
        headers={
            "Content-Type": "application/json",
            "stripe-signature": "t=999,v1=invalidsig",
        },
    )
    assert response.status_code == 400, response.text


@pytest.mark.asyncio
async def test_checkout_requires_auth(client):
    response = await client.post(
        "/api/v1/payments/create-checkout-session?price_id=price_test"
    )
    assert response.status_code == 401, response.text
