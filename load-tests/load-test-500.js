import http from 'k6/http';
import { check, sleep } from 'k6';

// 500 Concurrent Virtual Users Stress Test
export const options = {
  stages: [
    { duration: '5s', target: 100 }, // Stage 1: Warm up to 100 VUs
    { duration: '15s', target: 500 }, // Stage 2: Ramp up to 500 concurrent VUs
    { duration: '15s', target: 500 }, // Stage 3: Sustain 500 concurrent VUs
    { duration: '5s', target: 0 }, // Stage 4: Cool down to 0
  ],
  thresholds: {
    // Under 500 concurrent users, allow p95 up to 350ms
    http_req_duration: ['p(95)<350'],
    // Keep error rate under 2%
    http_req_failed: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000/api/party/list';

export default function () {
  const res = http.get(BASE_URL, {
    headers: {
      Accept: 'application/json',
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 350ms': (r) => r.timings.duration < 350,
  });

  // Short pause between iterations
  sleep(0.05);
}
