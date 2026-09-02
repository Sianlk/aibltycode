// k6 load test script — validates API SLAs under load.
// Run: k6 run tests/load_test.js --vus 50 --duration 60s -e BASE_URL=https://api.example.com
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const latency = new Trend('latency_ms', true);

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.01'],
  },
};

const BASE = (__ENV.BASE_URL || '').replace(/\/$/, '');

export default function () {
  if (!BASE) {
    throw new Error('BASE_URL is required for load testing');
  }

  const response = http.get(`${BASE}/api/v1/health`);
  const ok = check(response, {
    'status 200': (res) => res.status === 200,
    'latency < 200ms': (res) => res.timings.duration < 200,
  });

  errorRate.add(!ok);
  latency.add(response.timings.duration);
  sleep(1);
}
