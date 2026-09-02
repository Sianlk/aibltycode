"""Deterministic shared fixtures for the optional FastAPI backend."""
import os

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from api.core.db import Base, get_db
from api.main import app


# Integration tests exercise PostgreSQL-specific schema features (including JSONB).
# Require a dedicated test database explicitly so the fixture can never drop a
# production database by accidentally inheriting DATABASE_URL.
TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")
if not TEST_DATABASE_URL:
    raise RuntimeError(
        "TEST_DATABASE_URL must point to a dedicated disposable PostgreSQL test database"
    )

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False, pool_pre_ping=True)
TestSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)


async def override_get_db():
    async with TestSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


@pytest_asyncio.fixture(autouse=True)
async def prepare_database():
    """Give every test a clean PostgreSQL schema and route all DB work to it."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    app.dependency_overrides[get_db] = override_get_db
    try:
        yield
    finally:
        app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
