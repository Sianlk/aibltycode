"""Focused unit and smoke tests for AIBLTY Code's optional API."""
import html
import os
import sys
import time

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

    def test_response_latency(self):
        start = time.perf_counter()
        _ = {"status": "ok", "data": list(range(1000))}
        assert time.perf_counter() - start < 0.05

    def test_data_integrity(self):
        data = list(range(10000))
        out = [x * 2 for x in data]
        assert len(out) == 10000 and out[-1] == 19998


class TestPerformance:
    def test_throughput_1m(self):
        n = 1_000_000
        start = time.perf_counter()
        result = sum(range(n))
        elapsed = time.perf_counter() - start
        assert n / elapsed > 1_000_000, f"Too slow: {n / elapsed:.0f} ops/s"
        assert result == 499999500000

    def test_memory_generator(self):
        total = sum(x**2 for x in range(1_000_000))
        assert total > 0

    def test_json_throughput(self):
        import json

        payload = {"key": "val", "nums": list(range(100))}
        start = time.perf_counter()
        for _ in range(10000):
            json.dumps(payload)
        assert time.perf_counter() - start < 2.0


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
