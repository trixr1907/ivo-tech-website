import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 }, // Aufwärmphase
    { duration: '3m', target: 100 }, // Lastphase
    { duration: '1m', target: 0 }, // Abkühlphase
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% der Anfragen sollten unter 500ms sein
    http_req_failed: ['rate<0.01'], // Weniger als 1% Fehlerrate
  },
};

export default function () {
  const res = http.get('http://localhost:3000');

  check(res, {
    'status is 200': r => r.status === 200,
    'response time < 500ms': r => r.timings.duration < 500,
  });

  sleep(1);
}
