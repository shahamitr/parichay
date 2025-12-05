// Stress Testing Script using k6
// This script pushes the system beyond normal load to find breaking points

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const micrositeLoadTime = new Trend('microsite_load_time');

export const options = {
  stages: [
    { duration: '2m', target: 200 },    // Ramp up to 200 users
    { duration: '5m', target: 200 },    // Stay at 200 users
    { duration: '2m', target: 500 },    // Ramp up to 500 users
    { duration: '5m', target: 500 },    // Stay at 500 users
    { duration: '2m', target: 1000 },   // Ramp up to 1000 users
    { duration: '5m', target: 1000 },   // Stay at 1000 users
    { duration: '5m', target: 0 },      // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],  // 95% of requests should be below 5s
    http_req_failed: ['rate<0.10'],     // Error rate should be below 10%
  },
};

const BASE_URL = __ENV.APP_URL || 'http://localhost:3000';

const testMicrosites = [
  { brand: 'neelkanthevmotors', branch: 'ahmedabad' },
  { brand: 'neelkanthevmotors', branch: 'surat' },
  { brand: 'testbrand', branch: 'testbranch' },
];

export default function () {
  const microsite = testMicrosites[Math.floor(Math.random() * testMicrosites.length)];
  const micrositeUrl = `${BASE_URL}/${microsite.brand}/${microsite.branch}`;

  const res = http.get(micrositeUrl);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });

  errorRate.add(res.status !== 200);
  micrositeLoadTime.add(res.timings.duration);

  sleep(0.5); // Shorter sleep for higher load
}

export function handleSummary(data) {
  console.log('\n=== Stress Test Summary ===\n');
  console.log(`Total Requests: ${data.metrics.http_reqs.values.count}`);
  console.log(`Failed Requests: ${data.metrics.http_req_failed.values.passes}`);
  console.log(`Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%`);
  console.log(`Average Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`);
  console.log(`P95 Response Time: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`);
  console.log(`P99 Response Time: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms`);
  console.log(`Max Response Time: ${data.metrics.http_req_duration.values.max.toFixed(2)}ms`);

  return {
    'stress-test-results.json': JSON.stringify(data, null, 2),
  };
}
