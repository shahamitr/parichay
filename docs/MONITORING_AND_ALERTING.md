# OneTouch BizCard - Monitoring and Alerting Guide

## Overview

This guide covers the monitoring and alerting setup for OneTouch BizCard production environment. It includes configuration for uptime monitoring, error tracking, performance monitoring, log aggregation, and alerting systems.

## Table of Contents

1. [Monitoring Architecture](#monitoring-architecture)
2. [Uptime Monitoring](#uptime-monitoring)
3. [Error Tracking](#error-tracking)
4. [Performance Monitoring](#performance-monitoring)
5. [Log Aggregation](#log-aggregation)
6. [Database Monitoring](#database-monitoring)
7. [Alerting Configuration](#alerting-configuration)
8. [Status Page](#status-page)
9. [Monitoring Dashboards](#monitoring-dashboards)

---

## Monitoring Architecture

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     OneTouch BizCard                         │
│                    Production System                         │
└──────────────┬──────────────────────────────┬────────────────┘
                        │
               │                              │
    ┌──────────▼──────────┐        ┌─────────▼──────────┐
    │  Application Logs   │        │  System Metrics    │
    │  - Error logs       │        │  - CPU/Memory      │
    │  - Access logs      │        │  - Network I/O     │
    │  - Audit logs       │        │  - Disk usage      │
    └──────────┬──────────┘        └─────────┬──────────┘
               │                              │
               │                              │
    ┌──────────▼──────────────────────────────▼──────────┐
    │           Monitoring & Alerting Layer              │
    │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
    │  │  Sentry  │  │ Datadog  │  │ Uptime   │        │
    │  │  (Errors)│  │ (Metrics)│  │ Robot    │        │
    │  └──────────┘  └──────────┘  └──────────┘        │
    └──────────┬──────────────────────────────┬──────────┘
               │                              │
               │                              │
    ┌──────────▼──────────┐        ┌─────────▼──────────┐
    │  Alert Channels     │        │  Dashboards        │
    │  - Email            │        │  - Grafana         │
    │  - Slack            │        │  - Status Page     │
    │  - PagerDuty        │        │  - Custom UI       │
    └─────────────────────┘        └────────────────────┘
```

### Monitoring Components

| Component | Purpose | Tool | Priority |
|-----------|---------|------|----------|
| Uptime Monitoring | Service availability | UptimeRobot/Pingdom | Critical |
| Error Tracking | Application errors | Sentry | Critical |
| Performance Monitoring | Response times, throughput | New Relic/Datadog | High |
| Log Aggregation | Centralized logging | ELK Stack/CloudWatch | High |
| Database Monitoring | Query performance, connections | pgAdmin/CloudWatch | High |
| Infrastructure Monitoring | Server health, resources | Datadog/CloudWatch | Medium |

---

## Uptime Monitoring

### UptimeRobot Setup (Recommended)

#### 1. Create Account
- Sign up at https://uptimerobot.com
- Choose Pro plan for advanced features

#### 2. Configure Monitors

**HTTP(S) Monitor - Main Application**
```
Monitor Type: HTTP(s)
Friendly Name: OneTouch BizCard - Production
URL: https://onetouchbizcard.in
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
```

**HTTP(S) Monitor - API Health Check**
```
Monitor Type: HTTP(s)
Friendly Name: OneTouch BizCard - API Health
URL: https://onetouchbizcard.in/api/health
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
Expected Response: {"status":"ok"}
```

**HTTP(S) Monitor - Database Connectivity**
```
Monitor Type: HTTP(s)
Friendly Name: OneTouch BizCard - Database
URL: https://onetouchbizcard.in/api/health/database
Monitoring Interval: 10 minutes
Monitor Timeout: 30 seconds
```

**Keyword Monitor - Homepage**
```
Monitor Type: Keyword
Friendly Name: OneTouch BizCard - Homepage Content
URL: https://onetouchbizcard.in
Keyword: OneTouch BizCard
Monitoring Interval: 15 minutes
```

#### 3. Alert Contacts

Configure multiple alert channels:

**Email Alerts**
```
Email: alerts@onetouchbizcard.in
Threshold: Alert when down
```

**SMS Alerts** (for critical issues)
```
Phone: +91-XXXXXXXXXX
Threshold: Alert when down for 10 minutes
```

**Webhook to Slack**
```
Webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
Threshold: Alert when down
```

#### 4. Status Page

Create public status page:
```
URL: https://status.onetouchbizcard.in
Custom Domain: Yes
Show Uptime: Yes
Show Response Times: Yes
Monitors to Display: All production monitors
```

### Alternative: Pingdom

```bash
# Configure via Pingdom Dashboard
# 1. Add HTTP Check
#    - URL: https://onetouchbizcard.in
#    - Check interval: 1 minute
#    - Locations: Multiple regions
#
# 2. Add Transaction Check
#    - Test user login flow
#    - Test microsite creation
#    - Check interval: 5 minutes
#
# 3. Configure Alerts
#    - Email: alerts@onetouchbizcard.in
#    - SMS: +91-XXXXXXXXXX
#    - Slack webhook
```

---

## Error Tracking

### Sentry Setup

#### 1. Installation

```bash
npm install @sentry/nextjs
```

#### 2. Configuration

Create `sentry.client.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,

  // Performance Monitoring
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'onetouchbizcard.in'],
    }),
  ],

  // Error Filtering
  beforeSend(event, hint) {
    // Filter out non-critical errors
    if (event.level === 'warning') {
      return null;
    }
    return event;
  },

  // User Context
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'console') {
      return null;
    }
    return breadcrumb;
  },
});
```

Create `sentry.server.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,

  // Server-side integrations
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});
```

#### 3. Error Boundaries

```typescript
// components/ErrorBoundary.tsx
import * as Sentry from '@sentry/nextjs';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

#### 4. Custom Error Tracking

```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

export function trackError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    tags: {
      component: context?.component,
      action: context?.action,
    },
    extra: context,
  });
}

export function trackMessage(message: string, level: 'info' | 'warning' | 'error') {
  Sentry.captureMessage(message, level);
}

// Usage in API routes
export async function handleApiError(error: Error, req: Request) {
  Sentry.captureException(error, {
    tags: {
      endpoint: req.url,
      method: req.method,
    },
    user: {
      id: req.headers.get('x-user-id') || 'anonymous',
    },
  });
}
```

#### 5. Alert Rules in Sentry

Configure alerts in Sentry dashboard:

**Critical Errors**
```
Condition: Error count > 10 in 5 minutes
Action: Send to Slack #alerts channel
       Send email to on-call engineer
```

**Payment Failures**
```
Condition: Error with tag "payment" occurs
Action: Immediate Slack notification
       Email to finance team
```

**Database Errors**
```
Condition: Error with tag "database" occurs
Action: Slack notification
       Email to database admin
```

---

## Performance Monitoring

### New Relic Setup

#### 1. Installation

```bash
npm install newrelic
```

#### 2. Configuration

Create `newrelic.js`:
```javascript
'use strict';

exports.config = {
  app_name: ['OneTouch BizCard Production'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
  },

  // Transaction tracing
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    record_sql: 'obfuscated',
  },

  // Error collection
  error_collector: {
    enabled: true,
    ignore_status_codes: [404],
  },

  // Browser monitoring
  browser_monitoring: {
    enable: true,
  },

  // Distributed tracing
  distributed_tracing: {
    enabled: true,
  },
};
```

#### 3. Custom Metrics

```typescript
// lib/performance-monitoring.ts
import newrelic from 'newrelic';

export function trackCustomMetric(name: string, value: number) {
  newrelic.recordMetric(`Custom/${name}`, value);
}

export function trackBusinessMetric(metric: string, value: number) {
  newrelic.recordMetric(`Business/${metric}`, value);
}

// Usage examples
trackCustomMetric('Microsite/Created', 1);
trackCustomMetric('Payment/Successful', 1);
trackBusinessMetric('Revenue/Subscription', 999);
```

#### 4. Performance Alerts

Configure in New Relic dashboard:

**Slow Response Time**
```
Condition: Average response time > 2 seconds for 5 minutes
Severity: Warning
Action: Slack notification
```

**High Error Rate**
```
Condition: Error rate > 5% for 5 minutes
Severity: Critical
Action: PagerDuty alert + Slack
```

**Database Query Performance**
```
Condition: Database query time > 1 second
Severity: Warning
Action: Email to database team
```

### Alternative: Datadog

```typescript
// lib/datadog.ts
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.NEXT_PUBLIC_DATADOG_APP_ID!,
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN!,
  site: 'datadoghq.com',
  service: 'onetouch-bizcard',
  env: process.env.NODE_ENV,
  version: process.env.NEXT_PUBLIC_APP_VERSION,
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});
```

---

## Log Aggregation

### CloudWatch Logs (AWS)

#### 1. Configure Log Groups

```bash
# Create log groups
aws logs create-log-group --log-group-name /onetouch-bizcard/application
aws logs create-log-group --log-group-name /onetouch-bizcard/access
aws logs create-log-group --log-group-name /onetouch-bizcard/error
aws logs create-log-group --log-group-name /onetouch-bizcard/audit

# Set retention policy (30 days)
aws logs put-retention-policy \
  --log-group-name /onetouch-bizcard/application \
  --retention-in-days 30
```

#### 2. Application Logging

```typescript
// lib/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,

  // CloudWatch compatible format
  messageKey: 'message',

  // Add context
  base: {
    service: 'onetouch-bizcard',
    environment: process.env.NODE_ENV,
  },
});

export default logger;

// Usage
logger.info({ userId: '123', action: 'login' }, 'User logged in');
logger.error({ error: err, userId: '123' }, 'Payment failed');
```

#### 3. Log Insights Queries

**Error Analysis**
```sql
fields @timestamp, level, message, error
| filter level = "error"
| sort @timestamp desc
| limit 100
```

**API Performance**
```sql
fields @timestamp, method, path, duration
| filter path like /api/
| stats avg(duration), max(duration), count() by path
| sort avg(duration) desc
```

**User Activity**
```sql
fields @timestamp, userId, action
| filter action in ["login", "signup", "payment"]
| stats count() by action, bin(5m)
```

### Alternative: ELK Stack

#### 1. Setup Elasticsearch

```bash
# Docker Compose for ELK
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    ports:
      - "5000:5000"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

volumes:
  elasticsearch_data:
```

#### 2. Logstash Configuration

```conf
# logstash.conf
input {
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  if [level] == "error" {
    mutate {
      add_tag => ["error"]
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "onetouch-bizcard-%{+YYYY.MM.dd}"
  }
}
```

---

## Database Monitoring

### PostgreSQL Monitoring

#### 1. Enable pg_stat_statements

```sql
-- Add to postgresql.conf
shared_preload_libraries = 'pg_stat_statements'
pg_stat_statements.track = all
pg_stat_statements.max = 10000

-- Restart PostgreSQL and create extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

#### 2. Monitoring Queries

**Slow Queries**
```sql
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- queries taking > 1 second
ORDER BY mean_exec_time DESC
LIMIT 20;
```

**Connection Count**
```sql
SELECT
  count(*) as total_connections,
  count(*) FILTER (WHERE state = 'active') as active_connections,
  count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;
```

**Database Size**
```sql
SELECT
  pg_size_pretty(pg_database_size('onetouch_bizcard_prod')) as database_size;
```

**Table Sizes**
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
```

#### 3. CloudWatch Metrics for RDS

```bash
# CPU Utilization
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=onetouch-bizcard-prod \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 3600 \
  --statistics Average

# Database Connections
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --dimensions Name=DBInstanceIdentifier,Value=onetouch-bizcard-prod \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 3600 \
  --statistics Average
```

#### 4. Database Alerts

**High Connection Count**
```
Metric: DatabaseConnections
Threshold: > 80% of max_connections
Action: Alert database team
```

**High CPU Usage**
```
Metric: CPUUtilization
Threshold: > 80% for 10 minutes
Action: Alert DevOps team
```

**Low Free Storage**
```
Metric: FreeStorageSpace
Threshold: < 10 GB
Action: Alert immediately
```

---

## Alerting Configuration

### Alert Severity Levels

| Level | Response Time | Notification Channels | Examples |
|-------|--------------|----------------------|----------|
| Critical | Immediate | PagerDuty + Slack + SMS | Service down, payment failures |
| High | 15 minutes | Slack + Email | High error rate, slow response |
| Medium | 1 hour | Email | Elevated resource usage |
| Low | 4 hours | Email | Non-critical warnings |

### Slack Integration

#### 1. Create Slack Webhook

```bash
# In Slack: Apps → Incoming Webhooks → Add New Webhook
# Copy webhook URL
```

#### 2. Alert Script

```typescript
// lib/alerts.ts
export async function sendSlackAlert(
  severity: 'critical' | 'high' | 'medium' | 'low',
  title: string,
  message: string,
  details?: Record<string, any>
) {
  const colors = {
    critical: '#FF0000',
    high: '#FF6600',
    medium: '#FFCC00',
    low: '#00CC00',
  };

  const payload = {
    attachments: [
      {
        color: colors[severity],
        title: `[${severity.toUpperCase()}] ${title}`,
        text: message,
        fields: Object.entries(details || {}).map(([key, value]) => ({
          title: key,
          value: String(value),
          short: true,
        })),
        footer: 'OneTouch BizCard Monitoring',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// Usage
await sendSlackAlert(
  'critical',
  'Database Connection Failed',
  'Unable to connect to production database',
  {
    'Error': 'Connection timeout',
    'Database': 'onetouch_bizcard_prod',
    'Time': new Date().toISOString(),
  }
);
```

### PagerDuty Integration

#### 1. Setup

```bash
npm install @pagerduty/pdjs
```

#### 2. Configuration

```typescript
// lib/pagerduty.ts
import { event } from '@pagerduty/pdjs';

export async function triggerPagerDutyAlert(
  severity: 'critical' | 'error' | 'warning' | 'info',
  summary: string,
  details: Record<string, any>
) {
  await event({
    data: {
      routing_key: process.env.PAGERDUTY_INTEGRATION_KEY!,
      event_action: 'trigger',
      payload: {
        summary,
        severity,
        source: 'onetouch-bizcard',
        custom_details: details,
      },
    },
  });
}
```

### Email Alerts

```typescript
// lib/email-alerts.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmailAlert(
  to: string[],
  subject: string,
  body: string
) {
  await transporter.sendMail({
    from: 'alerts@onetouchbizcard.in',
    to: to.join(', '),
    subject: `[Alert] ${subject}`,
    html: body,
  });
}
```

---

## Status Page

### Setup with Statuspage.io

#### 1. Create Status Page

- Sign up at https://statuspage.io
- Create page: status.onetouchbizcard.in
- Configure components:
  - Website
  - API
  - Database
  - File Storage
  - Payment Processing

#### 2. Automated Updates

```typescript
// lib/status-page.ts
export async function updateComponentStatus(
  componentId: string,
  status: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage'
) {
  await fetch(`https://api.statuspage.io/v1/pages/${process.env.STATUSPAGE_PAGE_ID}/components/${componentId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `OAuth ${process.env.STATUSPAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ component: { status } }),
  });
}

// Usage in health check
if (databaseHealthy) {
  await updateComponentStatus('database-component-id', 'operational');
} else {
  await updateComponentStatus('database-component-id', 'major_outage');
}
```

### Self-Hosted Status Page

```typescript
// app/status/page.tsx
export default async function StatusPage() {
  const services = await checkAllServices();

  return (
    <div>
      <h1>OneTouch BizCard System Status</h1>
      {services.map(service => (
        <ServiceStatus key={service.name} service={service} />
      ))}
    </div>
  );
}

async function checkAllServices() {
  return [
    { name: 'Website', status: await checkWebsite() },
    { name: 'API', status: await checkAPI() },
    { name: 'Database', status: await checkDatabase() },
    { name: 'Redis', status: await checkRedis() },
  ];
}
```

---

## Monitoring Dashboards

### Grafana Setup

#### 1. Installation

```bash
docker run -d \
  -p 3001:3000 \
  --name=grafana \
  -e "GF_SECURITY_ADMIN_PASSWORD=admin" \
  grafana/grafana
```

#### 2. Data Sources

- Add Prometheus for metrics
- Add CloudWatch for AWS metrics
- Add PostgreSQL for database metrics

#### 3. Dashboard Panels

**Application Overview**
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate (%)
- Active users

**Database Metrics**
- Connection count
- Query performance
- Cache hit ratio
- Replication lag

**Infrastructure**
- CPU usage
- Memory usage
- Disk I/O
- Network traffic

### Custom Monitoring Dashboard

```typescript
// app/admin/monitoring/page.tsx
export default async function MonitoringDashboard() {
  const metrics = await getSystemMetrics();

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard
        title="Response Time"
        value={`${metrics.avgResponseTime}ms`}
        trend={metrics.responseTimeTrend}
      />
      <MetricCard
        title="Error Rate"
        value={`${metrics.errorRate}%`}
        trend={metrics.errorRateTrend}
      />
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers}
        trend={metrics.activeUsersTrend}
      />
    </div>
  );
}
```

---

## Monitoring Checklist

### Daily Checks
- [ ] Review error logs in Sentry
- [ ] Check uptime status
- [ ] Review performance metrics
- [ ] Verify backup completion

### Weekly Checks
- [ ] Review slow query reports
- [ ] Analyze traffic patterns
- [ ] Check disk space usage
- [ ] Review security alerts

### Monthly Checks
- [ ] Review and update alert thresholds
- [ ] Analyze long-term trends
- [ ] Update monitoring documentation
- [ ] Test disaster recovery procedures

---

## Support

For monitoring issues:
- Email: monitoring@onetouchbizcard.in
- Slack: #monitoring
- On-call: [Phone Number]

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Next Review**: [Date + 3 months]