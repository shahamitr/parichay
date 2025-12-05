# Production Monitoring Setup Guide

This guide covers setting up comprehensive monitoring for the OneTouch BizCard platform.

## Overview

The monitoring stack includes:
- **Uptime Monitoring**: UptimeRobot or Pingdom
- **Error Tracking**: Sentry
- **Alert Notifications**: Slack + Email
- **Database Monitoring**: PostgreSQL slow query logs
- **Application Metrics**: Custom health checks
- **Status Page**: Public system health dashboard

## 1. Sentry Error Tracking Setup

### 1.1 Create Sentry Project

1. Sign up at [sentry.io](https://sentry.io)
2. Create a new organization (if needed)
3. Create a new project:
   - Platform: Node.js
   - Project name: onetouch-bizcard-production
4. Copy the DSN from the project settings

### 1.2 Configure Sentry

Add to `.env.production`:

```env
SENTRY_DSN="https://examplePublicKey@o0.ingest.sentry.io/0"
SENTRY_ENVIRONMENT="production"
SENTRY_TRACES_SAMPLE_RATE="0.1"
```

### 1.3 Set Up Sentry Alerts

1. Navigate to Alerts in Sentry dashboard
2. Create alert rules:

**Critical Error Alert:**
- Condition: Error count > 10 in 5 minutes
- Actions: Email + Slack notification
- Priority: High

**Performance Degradation Alert:**
- Condition: P95 response time > 2 seconds
- Actions: Email notification
- Priority: Medium

**New Issue Alert:**
- Condition: New issue is created
- Actions: Slack notification
- Priority: Low

### 1.4 Configure Issue Grouping

1. Go to Settings > Processing
2. Configure grouping rules for better issue organization
3. Set up source maps for better stack traces

## 2. Uptime Monitoring Setup

### Option A: UptimeRobot (Recommended - Free tier available)

#### 2.1 Create Account

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Verify your email

#### 2.2 Add Monitors

Create the following monitors:

**Main Website Monitor:**
- Monitor Type: HTTP(s)
- URL: https://onetouchbizcard.in
- Monitoring Interval: 5 minutes
- Monitor Timeout: 30 seconds

**API Health Check:**
- Monitor Type: HTTP(s)
- URL: https://onetouchbizcard.in/api/health
- Monitoring Interval: 5 minutes
- Expected Status Code: 200

**Database Health:**
- Monitor Type: HTTP(s)
- URL: https://onetouchbizcard.in/api/health/database
- Monitoring Interval: 5 minutes

**Redis Health:**
- Monitor Type: HTTP(s)
- URL: https://onetouchbizcard.in/api/health/redis
- Monitoring Interval: 5 minutes

#### 2.3 Configure Alert Contacts

1. Go to My Settings > Alert Contacts
2. Add email addresses for critical alerts
3. Add Slack webhook (if available)
4. Set up SMS alerts for critical services (optional)

#### 2.4 Create Status Page

1. Go to Status Pages
2. Create a new public status page
3. Add all monitors to the status page
4. Customize branding and domain
5. Share the status page URL: `https://status.onetouchbizcard.in`

### Option B: Pingdom

#### 2.1 Create Account

1. Sign up at [pingdom.com](https://www.pingdom.com)
2. Choose a plan (paid service)

#### 2.2 Add Uptime Checks

Similar to UptimeRobot, create checks for:
- Main website
- API endpoints
- Health checks

#### 2.3 Configure Alerting

Set up email and SMS alerts for downtime.

## 3. Slack Integration

### 3.1 Create Slack Webhook

1. Go to your Slack workspace
2. Navigate to Apps > Incoming Webhooks
3. Click "Add to Slack"
4. Choose a channel (e.g., #alerts or #monitoring)
5. Copy the Webhook URL

### 3.2 Configure Webhook

Add to `.env.production`:

```env
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
SLACK_ALERT_CHANNEL="#alerts"
```

### 3.3 Test Slack Integration

```bash
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Test alert from OneTouch BizCard",
    "username": "Monitoring Bot",
    "icon_emoji": ":robot_face:"
  }'
```

### 3.4 Configure Alert Types

Set up different alert channels:
- `#critical-alerts`: System down, payment failures
- `#warnings`: Performance degradation, high error rates
- `#info`: Deployments, scheduled maintenance

## 4. Email Alerting

### 4.1 Configure Alert Recipients

Add to `.env.production`:

```env
ALERT_EMAIL_RECIPIENTS="admin@onetouchbizcard.in,ops@onetouchbizcard.in"
CRITICAL_ALERT_RECIPIENTS="cto@onetouchbizcard.in,admin@onetouchbizcard.in"
```

### 4.2 Email Alert Templates

Create templates for different alert types:
- System downtime
- Database connection failures
- Payment processing errors
- High error rates
- Performance degradation

## 5. Database Monitoring

### 5.1 Enable PostgreSQL Logging

Configure PostgreSQL to log slow queries:

```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1 second
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';
ALTER SYSTEM SET log_statement = 'none';
ALTER SYSTEM SET log_duration = off;

-- Reload configuration
SELECT pg_reload_conf();
```

### 5.2 Install pg_stat_statements

```sql
-- Enable pg_stat_statements extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 20;
```

### 5.3 Set Up Database Alerts

Create alerts for:
- Connection pool exhaustion
- Slow queries (> 2 seconds)
- High CPU usage (> 80%)
- Disk space (< 20% free)
- Replication lag (if using replicas)

## 6. Application Health Checks

### 6.1 Health Check Endpoints

Ensure these endpoints are implemented:

```
GET /api/health              - Overall health
GET /api/health/database     - Database connectivity
GET /api/health/redis        - Redis connectivity
GET /api/health/storage      - S3 connectivity
GET /api/health/payments     - Payment gateway status
```

### 6.2 Health Check Response Format

```json
{
  "status": "healthy",
  "timestamp": "2025-10-28T10:30:00Z",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 15
    },
    "redis": {
      "status": "healthy",
      "responseTime": 5
    },
    "storage": {
      "status": "healthy",
      "responseTime": 120
    }
  }
}
```

## 7. Custom Metrics and Dashboards

### 7.1 Key Metrics to Track

**Business Metrics:**
- New user registrations
- Active subscriptions
- Payment success rate
- Lead generation rate
- QR code scans

**Technical Metrics:**
- API response times (P50, P95, P99)
- Error rates by endpoint
- Database query performance
- Cache hit rates
- CDN performance

### 7.2 Create Monitoring Dashboard

Use Grafana or similar tools to create dashboards showing:
- Real-time system health
- Performance trends
- Error rates
- Business KPIs

## 8. Log Aggregation

### 8.1 Structured Logging

Ensure all logs follow a structured format:

```json
{
  "timestamp": "2025-10-28T10:30:00Z",
  "level": "error",
  "message": "Payment processing failed",
  "context": {
    "userId": "user_123",
    "paymentId": "pay_456",
    "error": "Gateway timeout"
  },
  "requestId": "req_789"
}
```

### 8.2 Log Retention

Configure log retention policies:
- Error logs: 90 days
- Access logs: 30 days
- Debug logs: 7 days

## 9. Testing Monitoring Setup

Run the monitoring test script:

```bash
./scripts/test-monitoring.sh
```

This will verify:
- ✅ Sentry connection
- ✅ Slack webhook
- ✅ Email configuration
- ✅ Database connectivity
- ✅ Redis connectivity
- ✅ Application health endpoints

## 10. Monitoring Checklist

- [ ] Sentry project created and configured
- [ ] Sentry alerts set up (critical errors, performance)
- [ ] UptimeRobot/Pingdom monitors created
- [ ] Public status page published
- [ ] Slack webhook configured and tested
- [ ] Email alerting configured
- [ ] Database slow query logging enabled
- [ ] Health check endpoints implemented
- [ ] Monitoring test script passes
- [ ] Alert escalation procedures documented
- [ ] On-call rotation established

## 11. Alert Response Procedures

### Critical Alerts (Immediate Response)

- System downtime
- Database connection failures
- Payment processing failures
- Security breaches

**Response Time:** < 15 minutes

### High Priority Alerts (Quick Response)

- High error rates (> 5%)
- Performance degradation (> 3s response time)
- Redis connection issues
- S3 upload failures

**Response Time:** < 1 hour

### Medium Priority Alerts (Standard Response)

- Slow queries
- Cache misses
- Non-critical API errors

**Response Time:** < 4 hours

## 12. Maintenance and Updates

- Review monitoring dashboards daily
- Analyze error trends weekly
- Update alert thresholds monthly
- Test disaster recovery procedures quarterly

## Support

For monitoring issues or questions, contact the DevOps team.
