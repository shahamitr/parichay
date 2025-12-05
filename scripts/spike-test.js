// Spike Testing Script using k6
// This script simulates sudden traffic spikes

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 50 },     // Normal load
    { duration: '30s', target: 1000 },  // Sudden spike
    { duration: '3m', target: 1000 },   // Sustained spike
    { duration: '1m', target: 50 },     // Return to normal
    { duration: '1m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'], // Allow higher response times during spike
    http_req_failed: ['rate<0.15'],     // Allow higher error rate during spike
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
  });

  errorRate.add(res.status !== 200);

  sleep(0.3);
}

export function handleSummary(data) {
  console.log('\n=== Spike Test Summary ===\n');
  console.log(`Total Requests: ${data.metrics.http_reqs.values.count}`);
  console.log(`Failed Requests: ${data.metrics.http_req_failed.values.passes}`);
  console.log(`Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%`);
  console.log(`Average Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`);
  console.log(`P95 Response Time: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`);

  return {
    'spike-test-results.json': JSON.stringify(data, null, 2),
  };
}
