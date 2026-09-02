"""Tests for authentication endpoints."""
import uuid

import pytest

UNIQUE = uuid.uuid4().hex[:8]
TEST_EMAIL = f"test_{UNIQUE}@example.com"
TEST_USERNAME = f"test_{UNIQUE}"
TEST_PASSWORD = "TestPass123!"


@pytest.mark.asyncio
async def test_register_creates_user(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": TEST_EMAIL,
            "username": TEST_USERNAME,
            "password": TEST_PASSWORD,
            "full_name": "Test User",
        },
    )
    assert response.status_code in (200, 201), response.text


@pytest.mark.asyncio
async def test_register_duplicate_fails(client):
    email = f"dup_{UNIQUE}@example.com"
    username = f"dup_{UNIQUE}"
    payload = {
        "email": email,
        "username": username,
        "password": TEST_PASSWORD,
        "full_name": "Dup User",
    }
    first = await client.post("/api/v1/auth/register", json=payload)
    assert first.status_code in (200, 201), first.text
    second = await client.post("/api/v1/auth/register", json=payload)
    assert second.status_code == 409, second.text


@pytest.mark.asyncio
async def test_login_returns_tokens(client):
    email = f"login_{UNIQUE}@example.com"
    username = f"login_{UNIQUE}"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "username": username,
            "password": TEST_PASSWORD,
            "full_name": "Login User",
        },
    )
    response = await client.post(
        "/api/v1/auth/login",
        content=f"username={email}&password={TEST_PASSWORD}",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_get_me_requires_auth(client):
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me_with_token(client):
    email = f"me_{UNIQUE}@example.com"
    username = f"me_{UNIQUE}"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "username": username,
            "password": TEST_PASSWORD,
            "full_name": "Me User",
        },
    )
    login = await client.post(
        "/api/v1/auth/login",
        content=f"username={email}&password={TEST_PASSWORD}",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login.status_code == 200, login.text
    token = login.json()["access_token"]
    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200, response.text
    assert response.json()["email"] == email


@pytest.mark.asyncio
async def test_password_too_short_rejected(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": f"short_{UNIQUE}@example.com",
            "username": f"short_{UNIQUE}",
            "password": "short",
            "full_name": "Short Pw",
        },
    )
    assert response.status_code == 422, response.text
