import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Test Configuration (Stages & Thresholds)
export const options = {
  stages: [
    { duration: '5s', target: 20 }, // Ramp-up: 0 to 20 Virtual Users (VUs)
    { duration: '15s', target: 50 }, // Sustained load: 50 concurrent VUs
    { duration: '5s', target: 0 }, // Ramp-down: cool-off to 0 VUs
  ],
  thresholds: {
    // 95% of requests should complete under 150ms
    http_req_duration: ['p(95)<150'],
    // Error rate must be under 1%
    http_req_failed: ['rate<0.01'],
  },
};

// Target URL: Change this to your desired endpoint (e.g. /home, /movies, /api/stream)
const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000/home';

export default function () {
  const res = http.get(BASE_URL, {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  // Verify response
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  // Small think-time pause between user actions (0.1s)
  sleep(0.1);
}
