# Load Testing Guide

## Overview

This guide covers load testing procedures for the OneTouch BizCard platform to ensure it can handle production traffic levels.

## Prerequisites

### Install k6

**macOS:**
```bash
brew install k6
```

**Windows:**
```bash
choco install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Test Types

### 1. Load Test (Normal Traffic)

Simulates normal production traffic patterns.

**Target:** 100-200 concurrent users
**Duration:** 16 minutes
**Purpose:** Verify system handles normal load

```bash
# Set the application URL
export APP_URL="https://onetouchbizcard.in"

# Run load test
npm run load:test
```

**Expected Results:**
- P95 response time < 2 seconds
- Error rate < 5%
- No memory leaks
- Stable performance throughout test

### 2. Stress Test (High Traffic)

Pushes the system beyond normal capacity to find breaking points.

**Target:** 200-1000 concurrent users
**Duration:** 26 minutes
**Purpose:** Identify system limits and failure modes

```bash
export APP_URL="https://onetouchbizcard.in"
npm run load:stress
```

**Expected Results:**
- P95 response time < 5 seconds
- Error rate < 10%
- Graceful degradation under load
- System recovers after load decreases

### 3. Spike Test (Traffic Surge)

Simulates sudden traffic spikes (e.g., viral content, marketing campaign).

**Target:** 50 → 1000 users in 30 seconds
**Duration:** 7.5 minutes
**Purpose:** Test auto-scaling and burst capacity

```bash
export APP_URL="https://onetouchbizcard.in"
npm run load:spike
```

**Expected Results:**
- System handles sudden spike without crashing
- Auto-scaling triggers appropriately
- Error rate < 15% during spike
- Quick recovery after spike

## Test Scenarios

### Scenario 1: Microsite Access

Tests the most common user flow - accessing a microsite.

**Endpoints Tested:**
- `GET /{brand}/{branch}` - Microsite page
- `GET /api/health` - Health check
- `GET /_next/static/*` - Static assets

**Metrics:**
- Page load time
- Time to first byte (TTFB)
- Total page size
- Number of requests

### Scenario 2: API Performance

Tests API endpoint performance under load.

**Endpoints Tested:**
- `GET /api/health`
- `GET /api/health/database`
- `GET /api/health/redis`
- `POST /api/analytics/track`

**Metrics:**
- API response time
- Throughput (requests/second)
- Error rate
- Database query time

### Scenario 3: Payment Processing

Tests payment gateway integration under concurrent load.

**Endpoints Tested:**
- `POST /api/payments/stripe/create-intent`
- `POST /api/payments/razorpay/create-order`
- `POST /api/webhooks/stripe`
- `POST /api/webhooks/razorpay`

**Metrics:**
- Payment processing time
- Success rate
- Webhook processing time
- Database transaction time

## Performance Benchmarks

### Target Metrics

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| Homepage Load Time | < 1s | < 2s | > 3s |
| Microsite Load Time | < 1.5s | < 3s | > 5s |
| API Response Time (P95) | < 500ms | < 1s | > 2s |
| Database Query Time | < 100ms | < 500ms | > 1s |
| Error Rate | < 1% | < 5% | > 10% |
| Concurrent Users | 1000+ | 500+ | < 200 |

### Resource Utilization Targets

| Resource | Normal | High | Critical |
|----------|--------|------|----------|
| CPU Usage | < 50% | < 70% | > 85% |
| Memory Usage | < 60% | < 80% | > 90% |
| Database Connections | < 30 | < 45 | > 50 |
| Redis Memory | < 1GB | < 2GB | > 3GB |

## Running Tests

### Pre-Test Checklist

- [ ] Verify test environment is ready
- [ ] Ensure monitoring is active
- [ ] Clear caches if needed
- [ ] Notify team of test schedule
- [ ] Set up result collection

### During Test

Monitor these metrics in real-time:

1. **Application Metrics:**
   - Response times
   - Error rates
   - Throughput

2. **System Metrics:**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network I/O

3. **Database Metrics:**
   - Active connections
   - Query performance
   - Lock waits
   - Cache hit ratio

4. **Cache Metrics:**
   - Redis memory usage
   - Cache hit/miss ratio
   - Eviction rate

### Post-Test Analysis

1. **Review Results:**
   ```bash
   # View test results
   cat load-test-results.json
   cat stress-test-results.json
   cat spike-test-results.json
   ```

2. **Analyze Metrics:**
   - Compare against benchmarks
   - Identify bottlenecks
   - Check for errors
   - Review resource usage

3. **Generate Report:**
   - Document findings
   - Create graphs/charts
   - List recommendations
   - Track improvements

## Optimization Strategies

### If Response Times Are High

1. **Enable/Optimize Caching:**
   - Increase Redis cache TTL
   - Add CDN caching headers
   - Implement query result caching

2. **Database Optimization:**
   - Add missing indexes
   - Optimize slow queries
   - Increase connection pool size
   - Enable query caching

3. **Code Optimization:**
   - Reduce database queries (N+1 problem)
   - Optimize image sizes
   - Minimize JavaScript bundle size
   - Enable compression

### If Error Rates Are High

1. **Increase Resources:**
   - Scale horizontally (more instances)
   - Scale vertically (larger instances)
   - Increase database connections
   - Add more Redis memory

2. **Implement Rate Limiting:**
   - Protect against abuse
   - Implement backpressure
   - Add request queuing

3. **Improve Error Handling:**
   - Add retry logic
   - Implement circuit breakers
   - Improve timeout handling

### If System Crashes

1. **Identify Root Cause:**
   - Check error logs
   - Review memory usage
   - Check for memory leaks
   - Review database connections

2. **Implement Safeguards:**
   - Add health checks
   - Implement graceful shutdown
   - Add connection pooling
   - Implement request throttling

## Continuous Performance Testing

### Automated Testing

Set up automated performance tests in CI/CD:

```yaml
# .github/workflows/performance-test.yml
name: Performance Test

on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday at 2 AM
  workflow_dispatch:

jobs:
  performance-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      - name: Run load test
        run: k6 run scripts/load-test.js
        env:
          APP_URL: ${{ secrets.STAGING_URL }}
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: '*-test-results.json'
```

### Performance Monitoring

Set up continuous monitoring:

1. **Application Performance Monitoring (APM):**
   - Use Sentry Performance
   - Track transaction times
   - Monitor slow queries

2. **Real User Monitoring (RUM):**
   - Track actual user experience
   - Monitor page load times
   - Identify slow pages

3. **Synthetic Monitoring:**
   - Regular health checks
   - Scheduled performance tests
   - Alert on degradation

## Troubleshooting

### Common Issues

**Issue: High response times**
- Check database query performance
- Verify cache is working
- Check network latency
- Review application logs

**Issue: High error rates**
- Check application logs
- Verify database connections
- Check external service status
- Review rate limiting

**Issue: Memory leaks**
- Monitor memory usage over time
- Check for unclosed connections
- Review event listeners
- Profile application

**Issue: Database connection exhaustion**
- Increase connection pool size
- Check for connection leaks
- Optimize query patterns
- Add connection timeout

## Best Practices

1. **Test Regularly:**
   - Run load tests before major releases
   - Conduct stress tests quarterly
   - Perform spike tests before campaigns

2. **Test Realistic Scenarios:**
   - Use production-like data
   - Simulate real user behavior
   - Test peak traffic patterns

3. **Monitor During Tests:**
   - Watch all metrics in real-time
   - Be ready to stop if issues occur
   - Document observations

4. **Iterate and Improve:**
   - Track performance over time
   - Set improvement goals
   - Optimize continuously

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [Performance Testing Best Practices](https://k6.io/docs/testing-guides/test-types/)
- [Web Performance Optimization](https://web.dev/performance/)
