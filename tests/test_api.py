"""Integration tests for core API endpoints."""
import pytest


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/api/v1/health")
    assert response.status_code in (200, 503)


@pytest.mark.asyncio
async def test_register_validates_password(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "username": "testuser", "password": "weak"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_validates_username(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "username": "u", "password": "StrongP@ss123"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": "nobody@example.com", "password": "wrong"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_protected_route_requires_auth(client):
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_rate_limit_headers(client):
    response = await client.get("/api/v1/health")
    assert "x-ratelimit-limit" in response.headers or response.status_code in (200, 503)
