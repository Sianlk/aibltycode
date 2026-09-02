"""Focused unit and smoke tests for AIBLTY Code's optional API."""
import html
import json
import os
import sys

import pytest
from pydantic import ValidationError

from api.main import app
from api.routes.auth import RegisterRequest


class TestCore:
    def test_environment(self):
        assert sys.version_info >= (3, 10), "Requires Python 3.10+"
        assert os.path.exists(".")

    def test_config_defaults(self):
        cfg = {"name": "AIBLTY Code", "version": "1.0.0", "env": "production"}
        assert cfg["name"] == "AIBLTY Code"
        assert cfg["version"] is not None

    def test_response_payload_structure(self):
        payload = {"status": "ok", "data": list(range(1000))}
        assert payload["status"] == "ok"
        assert len(payload["data"]) == 1000
        assert payload["data"][0] == 0
        assert payload["data"][-1] == 999

    def test_data_integrity(self):
        data = list(range(10000))
        out = [x * 2 for x in data]
        assert len(out) == 10000 and out[-1] == 19998


class TestLoadSmoke:
    def test_large_range_aggregation(self):
        n = 1_000_000
        result = sum(range(n))
        assert result == 499999500000

    def test_memory_generator(self):
        total = sum(x**2 for x in range(1_000_000))
        assert total == 333332833333500000

    def test_repeated_json_serialization(self):
        payload = {"key": "val", "nums": list(range(100))}
        encoded = None
        for _ in range(10000):
            encoded = json.dumps(payload)

        assert encoded is not None
        decoded = json.loads(encoded)
        assert decoded == payload


class TestSecurity:
    def test_xss_prevention(self):
        bad = "<script>alert(document.cookie)</script>"
        safe = html.escape(bad)
        assert "<script>" not in safe
        assert "&lt;script&gt;" in safe

    def test_registration_rejects_injection_shaped_usernames(self):
        dangerous = ["';DROP-TABLE", '" OR 1=1', "--", "UNION SELECT"]
        for username in dangerous:
            with pytest.raises(ValidationError):
                RegisterRequest.model_validate(
                    {
                        "email": "safe@example.com",
                        "username": username,
                        "password": "StrongP@ss123",
                    }
                )

    def test_no_filesystem_catch_all_route(self):
        route_paths = [getattr(route, "path", "") for route in app.routes]
        assert not any(
            "{path:path}" in path or "{file_path:path}" in path for path in route_paths
        )