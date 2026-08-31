"""Repository-wide pytest configuration.

Backend integration fixtures live in tests/conftest.py so there is one canonical
isolated database/session stack. Keeping this file intentionally minimal avoids
pytest selecting competing engines or dependency overrides by test location.
"""
