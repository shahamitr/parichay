// Load Testing Script using k6
// This script simulates normal load conditions

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const micrositeLoadTime = new Trend('microsite_load_time');
const apiResponseTime = new Trend('api_response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 200 },   // Ramp up to 200 users
    { duration: '5m', target: 200 },   // Stay at 200 users
    { duration: '2m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% of requests should be below 2s
    http_req_failed: ['rate<0.05'],     // Error rate should be below 5%
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.APP_URL || 'http://localhost:3000';

// Sample brand and branch slugs for testing
const testMicrosites = [
  { brand: 'neelkanthevmotors', branch: 'ahmedabad' },
  { brand: 'neelkanthevmotors', branch: 'surat' },
  { brand: 'testbrand', branch: 'testbranch' },
];

export default function () {
  // Test 1: Homepage
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in <1s': (r) => r.timings.duration < 1000,
  });
  errorRate.add(homeRes.status !== 200);

  sleep(1);

  // Test 2: Random microsite
  const microsite = testMicrosites[Math.floor(Math.random() * testMicrosites.length)];
  const micrositeUrl = `${BASE_URL}/${microsite.brand}/${microsite.branch}`;

  const micrositeRes = http.get(micrositeUrl);
  check(micrositeRes, {
    'microsite status is 200': (r) => r.status === 200,
    'microsite loads in <2s': (r) => r.timings.duration < 2000,
    'microsite has content': (r) => r.body.length > 1000,
  });
  errorRate.add(micrositeRes.status !== 200);
  micrositeLoadTime.add(micrositeRes.timings.duration);

  sleep(2);

  // Test 3: API Health Check
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health check responds in <500ms': (r) => r.timings.duration < 500,
  });
  apiResponseTime.add(healthRes.timings.duration);

  sleep(1);

  // Test 4: Static assets (simulate loading images)
  const staticRes = http.get(`${BASE_URL}/_next/static/css/app.css`);
  check(staticRes, {
    'static asset loads': (r) => r.status === 200 || r.status === 304,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'load-test-results.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '';
  const enableColors = options.enableColors || false;

  let summary = '\n' + indent + '=== Load Test Summary ===\n\n';

  // HTTP metrics
  summary += indent + 'HTTP Metrics:\n';
  summary += indent + `  Total Requests: ${data.metrics.http_reqs.values.count}\n`;
  summary += indent + `  Failed Requests: ${data.metrics.http_req_failed.values.passes}\n`;
  summary += indent + `  Request Rate: ${data.metrics.http_reqs.values.rate.toFixed(2)}/s\n`;
  summary += indent + `  Average Duration: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
  summary += indent + `  P95 Duration: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
  summary += indent + `  P99 Duration: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms\n\n`;

  // Custom metrics
  if (data.metrics.microsite_load_time) {
    summary += indent + 'Microsite Performance:\n';
    summary += indent + `  Average Load Time: ${data.metrics.microsite_load_time.values.avg.toFixed(2)}ms\n`;
    summary += indent + `  P95 Load Time: ${data.metrics.microsite_load_time.values['p(95)'].toFixed(2)}ms\n\n`;
  }

  // Thresholds
  summary += indent + 'Threshold Results:\n';
  for (const [name, threshold] of Object.entries(data.thresholds)) {
    const passed = threshold.ok ? '✓ PASS' : '✗ FAIL';
    summary += indent + `  ${name}: ${passed}\n`;
  }

  return summary;
}
