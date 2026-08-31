"""Shared pytest fixtures for the optional FastAPI backend."""
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from api.core.db import init_db
from api.main import app


@pytest_asyncio.fixture(scope="session", autouse=True)
async def prepare_database():
    """Create the test schema before requests reach database-backed routes."""
    await init_db()
    yield


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
