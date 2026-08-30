"""Application configuration via environment variables."""
import os
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AIBLTYCODE"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "CHANGE_ME_IN_PRODUCTION")
    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL", "postgresql+asyncpg://user:pass@localhost/db"
    )
    REDIS_URL: str = os.environ.get("REDIS_URL", "redis://localhost:6379")
    ALLOWED_ORIGINS: List[str] = ["https://localhost:3000"]
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    STRIPE_SECRET_KEY: str = os.environ.get("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

    GOOGLE_CLIENT_ID: str = os.environ.get("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.environ.get("GOOGLE_CLIENT_SECRET", "")
    APPLE_CLIENT_ID: str = os.environ.get("APPLE_CLIENT_ID", "")
    APPLE_TEAM_ID: str = os.environ.get("APPLE_TEAM_ID", "")
    APPLE_KEY_ID: str = os.environ.get("APPLE_KEY_ID", "")
    APPLE_PRIVATE_KEY: str = os.environ.get("APPLE_PRIVATE_KEY", "")

    SENTRY_DSN: str = os.environ.get("SENTRY_DSN", "")
    ENVIRONMENT: str = os.environ.get("ENVIRONMENT", "production")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
