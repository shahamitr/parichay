# Production Monitoring and Alerting Setup Guide

## Overview

This guide provides step-by-step instructions for setting up production monitoring and alerting for OneTouch BizCard. It covers uptime monitoring, error tracking, performance monitoring, and alerting configuration.

## Table of Contents

1. [Uptime Monitoring Setup](#uptime-monitoring-setup)
2. [Error Tracking with Sentry](#error-tracking-with-sentry)
3. [Slack Integration](#slack-integration)
4. [Email Alerting](#email-alerting)
5. [Performance Monitoring](#performance-monitoring)
6. [Database Monitoring](#database-monitoring)
7. [Status Page Setup](#status-page-setup)
8. [Verification and Testing](#verification-and-testing)

---

## Uptime Monitoring Setup

### Option 1: UptimeRobot (Recommended - Free Tier Available)

#### 1. Create Account

1. Go to https://uptimerobot.com
2. Sign up for a free account
3. Verify your email address

#### 2. Create Monitors

**Monitor 1: Main Application**
```
Monitor Type: HTTP(s)
Friendly Name: OneTouch BizCard - Production
URL: https://onetouchbizcard.in
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
```

**Monitor 2: API Health Check**
```
Monitor Type: HTTP(s)
Friendly Name: OneTouch BizCard - API Health
URL: https://onetouchbizcard.in/api/health
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
Keyword Monitoring: "ok" (check for this in response)
```

**Monitor 3: Database Connectivity**
```
Monitor Type: HTTP(s)
Friendly Name: OneTouch BizCard - Database
URL: https://onetouchbizcard.in/api/health
Monitoring Interval: 10 minutes
Monitor Timeout: 30 seconds
```

#### 3. Configure Alert Contacts

**Email Alerts**:
1. Go to "My Settings" → "Alert Contacts"
2. Add email: `alerts@onetouchbizcard.in`
3. Set threshold: Alert when down

**SMS Alerts** (for critical issues):
1. Add phone number: `+91-XXXXXXXXXX`
2. Set threshold: Alert when down for 10 minutes

**Webhook to Slack** (configured in Slack section below)

#### 4. Create Status Page

1. Go to "Status Pages" → "Add Status Page"
2. Configure:
   ```
   Status Page Name: OneTouch BizCard Status
   Custom Domain: status.onetouchbizcard.in (optional)
   Monitors to Display: All production monitors
   Show Uptime: Yes
   Show Response Times: Yes
   ```

3. Get status page URL and share with team

#### 5. Environment Variables

Add to `.env.production`:
```bash
# UptimeRobot (for API integration if needed)
UPTIMEROBOT_API_KEY="your-api-key-here"
```

---

### Option 2: Pingdom

#### 1. Create Account

1. Go to https://www.pingdom.com
2. Sign up for an account
3. Choose appropriate plan

#### 2. Create Uptime Checks

**Check 1: HTTP Check**
```
Name: OneTouch BizCard Production
URL: https://onetouchbizcard.in
Check Interval: 1 minute
Locations: Multiple regions (US, Europe, Asia)
```

**Check 2: Transaction Check**
```
Name: User Login Flow
Steps:
  1. Navigate to https://onetouchbizcard.in
  2. Click login button
  3. Verify login page loads
Check Interval: 5 minutes
```

#### 3. Configure Alerts

1. Go to Alerting → Integrations
2. Add email, SMS, and Slack integrations
3. Set alert policies for different severity levels

---

## Error Tracking with Sentry

### 1. Create Sentry Account

1. Go to https://sentry.io
2. Sign up for an account
3. Create a new project:
   - Platform: Next.js
   - Project Name: onetouch-bizcard-production

### 2. Get DSN Keys

After creating the project, you'll get:
- **Client DSN** (for browser): `https://xxxxx@sentry.io/xxxxx`
- **Server DSN** (for server): Same as client DSN

### 3. Configure Environment Variables

Add to `.env.production`:
```bash
# Sentry Error Tracking
SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="onetouch-bizcard-production"
SENTRY_AUTH_TOKEN="your-auth-token"
```

### 4. Verify Sentry Configuration

The Sentry configuration is already implemented in the codebase:
- `sentry.client.config.ts` - Client-side error tracking
- `sentry.server.config.ts` - Server-side error tracking
- `src/lib/error-tracking.ts` - Error tracking utilities

Test Sentry integration:
```bash
# Trigger a test error
curl -X POST https://onetouchbizcard.in/api/test-error
```

Check Sentry dashboard to verify error appears.

### 5. Configure Alert Rules

In Sentry dashboard:

**Alert Rule 1: Critical Errors**
```
Name: Critical Production Errors
Conditions:
  - Event level is error or fatal
  - Event count > 10 in 5 minutes
Actions:
  - Send notification to Slack #alerts
  - Send email to alerts@onetouchbizcard.in
```

**Alert Rule 2: Payment Failures**
```
Name: Payment Processing Errors
Conditions:
  - Event tags contain "payment"
  - Any error occurs
Actions:
  - Immediate Slack notification
  - Email to finance@onetouchbizcard.in
```

**Alert Rule 3: Database Errors**
```
Name: Database Connection Errors
Conditions:
  - Event tags contain "database"
  - Event count > 5 in 10 minutes
Actions:
  - Slack notification
  - Email to devops@onetouchbizcard.in
```

### 6. Configure Performance Monitoring

In Sentry project settings:
```
Performance Monitoring: Enabled
Transaction Sample Rate: 0.1 (10% of transactions)
Profiles Sample Rate: 0.1 (10% of profiles)
```

---

## Slack Integration

### 1. Create Slack Workspace (if needed)

1. Go to https://slack.com
2. Create workspace: `onetouchbizcard`
3. Create channels:
   - `#alerts` - Critical alerts
   - `#monitoring` - General monitoring notifications
   - `#deployments` - Deployment notifications

### 2. Create Incoming Webhook

1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. App Name: "OneTouch BizCard Monitoring"
4. Select workspace
5. Go to "Incoming Webhooks" → Enable
6. Click "Add New Webhook to Workspace"
7. Select channel: `#alerts`
8. Copy webhook URL

### 3. Configure Environment Variables

Add to `.env.production`:
```bash
# Slack Integration
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
SLACK_ALERTS_CHANNEL="#alerts"
SLACK_MONITORING_CHANNEL="#monitoring"
```

### 4. Test Slack Integration

The Slack alert utility is already implemented in `src/lib/alerts.ts`.

Test it:
```bash
# Create a test script
cat > test-slack.js << 'EOF'
const fetch = require('node-fetch');

async function testSlackAlert() {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  const payload = {
    attachments: [{
      color: '#FF0000',
      title: '[TEST] Slack Integration Test',
      text: 'This is a test alert from OneTouch BizCard monitoring system',
      fields: [
        { title: 'Environment', value: 'Produc, short: true },
        { title: 'Status', value: 'Testing', short: true }
      ],
      footer: 'OneTouch BizCard Monitoring',
      ts: Math.floor(Date.now() / 1000)
    }]
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  console.log('Slack test:', response.ok ? 'Success' : 'Failed');
}

testSlackAlert();
EOF

# Run test
node test-slack.js
```

### 5. Configure UptimeRobot Slack Webhook

In UptimeRobot:
1. Go to "My Settings" → "Alert Contacts"
2. Add "Web-Hook" contact
3. Webhook URL: Your Slack webhook URL
4. POST Value:
```json
{
  "text": "*monitorFriendlyName* is *alertTypeFriendlyName*",
  "attachments": [{
    "color": "danger",
    "fields": [
      {"title": "Monitor", "value": "*monitorFriendlyName*", "short": true},
      {"title": "Status", "value": "*alertTypeFriendlyName*", "short": true},
      {"title": "URL", "value": "*monitorURL*", "short": false}
    ]
  }]
}
```

---

## Email Alerting

### 1. Configure SMTP Settings

Email configuration is already set up in the codebase. Verify `.env.production`:

```bash
# Email Service (for alerts)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="alerts@onetouchbizcard.in"
SMTP_PASS="your-app-password"
SMTP_FROM="alerts@onetouchbizcard.in"
```

### 2. Create Alert Email Templates

The email service is already implemented in `src/lib/email-service.ts`.

Create alert email template at `src/lib/email-templates/alert.ts`:

```typescript
export function generateAlertEmail(alert: {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  details?: Record<string, any>;
}) {
  const severityColors = {
    critical: '#FF0000',
    high: '#FF6600',
    medium: '#FFCC00',
    low: '#00CC00',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .alert-box {
          border-left: 4px solid ${severityColors[alert.severity]};
          padding: 20px;
          background: #f9f9f9;
        }
        .severity {
          color: ${severityColors[alert.severity]};
          font-weight: bold;
          text-transform: uppercase;
        }
        .details {
          background: white;
          padding: 10px;
          margin-top: 10px;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="alert-box">
        <h2><span class="severity">[${alert.severity}]</span> ${alert.title}</h2>
        <p>${alert.message}</p>
        ${alert.details ? `
          <div class="details">
            <h3>Details:</h3>
            <pre>${JSON.stringify(alert.details, null, 2)}</pre>
          </div>
        ` : ''}
        <p style="margin-top: 20px; color: #666;">
          <small>
            Timestamp: ${new Date().toISOString()}<br>
            System: OneTouch BizCard Production
          </small>
        </p>
      </div>
    </body>
    </html>
  `;
}
```

### 3. Configure Alert Recipients

Create `src/config/alert-recipients.ts`:

```typescript
export const ALERT_RECIPIENTS = {
  critical: [
    'devops@onetouchbizcard.in',
    'cto@onetouchbizcard.in',
  ],
  high: [
    'devops@onetouchbizcard.in',
  ],
  medium: [
    'monitoring@onetouchbizcard.in',
  ],
  low: [
    'monitoring@onetouchbizcard.in',
  ],

  // Specific alert types
  payment: [
    'finance@onetouchbizcard.in',
    'devops@onetouchbizcard.in',
  ],
  database: [
    'dba@onetouchbizcard.in',
    'devops@onetouchbizcard.in',
  ],
  security: [
    'security@onetouchbizcard.in',
    'cto@onetouchbizcard.in',
  ],
};
```

### 4. Test Email Alerts

```bash
# Create test script
cat > test-email-alert.js << 'EOF'
const nodemailer = require('nodemailer');

async function testEmailAlert() {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: 'alerts@onetouchbizcard.in',
    subject: '[TEST] Email Alert System Test',
    html: '<h1>Test Alert</h1><p>This is a test email from OneTouch BizCard monitoring system.</p>',
  });

  console.log('Email test sent successfully');
}

testEmailAlert();
EOF

# Run test
node test-email-alert.js
```

---

## Performance Monitoring

### Option 1: New Relic (Recommended)

#### 1. Create Account

1. Go to https://newrelic.com
2. Sign up for an account
3. Create new application:
   - Name: OneTouch BizCard Production
   - Type: Node.js

#### 2. Install New Relic

```bash
cd onetouch-bizcard
npm install newrelic
```

#### 3. Configure New Relic

Create `newrelic.js` in project root:

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

  // Custom attributes
  attributes: {
    enabled: true,
    include: ['request.headers.userAgent'],
  },
};
```

#### 4. Environment Variables

Add to `.env.production`:
```bash
# New Relic
NEW_RELIC_LICENSE_KEY="your-license-key"
NEW_RELIC_APP_NAME="OneTouch BizCard Production"
NEW_RELIC_LOG_LEVEL="info"
```

#### 5. Configure Alerts

In New Relic dashboard:

**Alert Policy 1: Response Time**
```
Name: Slow Response Time
Condition: Average response time > 2 seconds for 5 minutes
Severity: Warning
Notification: Slack + Email
```

**Alert Policy 2: Error Rate**
```
Name: High Error Rate
Condition: Error rate > 5% for 5 minutes
Severity: Critical
Notification: PagerDuty + Slack + Email
```

**Alert Policy 3: Throughput**
```
Name: Low Throughput
Condition: Requests per minute < 10 for 10 minutes
Severity: Warning
Notification: Slack
```

---

### Option 2: Datadog

#### 1. Create Account

1. Go to https://www.datadoghq.com
2. Sign up for an account
3. Get API key from "Organization Settings"

#### 2. Install Datadog Agent

```bash
# For Ubuntu/Debian
DD_API_KEY=your-api-key DD_SITE="datadoghq.com" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"
```

#### 3. Configure APM

Add to `.env.production`:
```bash
# Datadog
DD_API_KEY="your-api-key"
DD_SERVICE="onetouch-bizcard"
DD_ENV="production"
DD_VERSION="1.0.0"
```

---

## Database Monitoring

### 1. Enable PostgreSQL Monitoring

#### Configure pg_stat_statements

```sql
-- Connect to database
psql "$DATABASE_URL"

-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Verify
SELECT * FROM pg_stat_statements LIMIT 1;
```

#### Add to postgresqf:
```conf
shared_preload_libraries = 'pg_stat_statements'
pg_stat_statements.track = all
pg_stat_statements.max = 10000
```

### 2. Create Monitoring Queries

Create `scripts/monitor-database.sh`:

```bash
#!/bin/bash

# Database Monitoring Script

DB_URL="${DATABASE_URL}"

echo "=== Database Health Check ==="
echo "Timestamp: $(date)"
echo ""

# Connection count
echo "Active Connections:"
psql "$DB_URL" -t -c "
  SELECT count(*) as total,
         count(*) FILTER (WHERE state = 'active') as active,
         count(*) FILTER (WHERE state = 'idle') as idle
  FROM pg_stat_activity;
"

# Database size
echo ""
echo "Database Size:"
psql "$DB_URL" -t -c "
  SELECT pg_size_pretty(pg_database_size(current_database()));
"

# Slow queries
echo ""
echo "Slow Queries (> 1 second):"
psql "$DB_URL" -c "
  SELECT query,
         calls,
         mean_exec_time,
         max_exec_time
  FROM pg_stat_statements
  WHERE mean_exec_time > 1000
  ORDER BY mean_exec_time DESC
  LIMIT 10;
"

# Table sizes
echo ""
echo "Largest Tables:"
psql "$DB_URL" -c "
  SELECT schemaname,
         tablename,
         pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  LIMIT 10;
"
```

### 3. Configure Database Alerts

Create monitoring script that runs via cron:

```bash
# Add to crontab
*/15 * * * * /path/to/scripts/monitor-database.sh >> /var/log/db-monitor.log 2>&1
```

### 4. CloudWatch RDS Monitoring (if using AWS RDS)

Configure CloudWatch alarms:

```bash
# High CPU
aws cloudwatch put-metric-alarm \
  --alarm-name onetouch-db-high-cpu \
  --alarm-description "Database CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --dimensions Name=DBInstanceIdentifier,Value=onetouch-bizcard-prod

# High Connections
aws cloudwatch put-metric-alarm \
  --alarm-name onetouch-db-high-connections \
  --alarm-description "Database connections > 80" \
  --metric-name DatabaseConnections \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --dimensions Name=DBInstanceIdentifier,Value=onetouch-bizcard-prod
```

---

## Status Page Setup

### Option 1: Statuspage.io

#### 1. Create Account

1. Go to https://statuspage.io
2. Sign up for an account
3. Create status page: `status.onetouchbizcard.in`

#### 2. Configure Components

Add components:
- Website
- API
- Database
- File Storage
- Payment Processing

#### 3. Configure Automation

Use Statuspage API to update status automatically:

```typescript
// src/lib/status-page.ts
export async function updateComponentStatus(
  componentId: string,
  status: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage'
) {
  const response = await fetch(
    `https://api.statuspage.io/v1/pages/${process.env.STATUSPAGE_PAGE_ID}/components/${componentId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `OAuth ${process.env.STATUSPAGE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ component: { status } }),
    }
  );

  return response.ok;
}
```

### Option 2: Self-Hosted Status Page

Use the existing health check endpoint to create a simple status page:

Create `src/app/status/page.tsx`:

```typescript
// Implementation already exists in the codebase
// Just needs to be deployed and configured
```

---

## Verification and Testing

### 1. Test All Monitoring Services

Create `scripts/test-monitoring.sh`:

```bash
#!/bin/bash

echo "Testing Monitoring Services..."
echo ""

# Test uptime monitoring
echo "1. Testing uptime monitoring..."
curl -s https://onetouchbizcard.in/api/health | grep -q "ok" && echo "✅ Health check passed" || echo "❌ Health check failed"

# Test Sentry
echo "2. Testing Sentry error tracking..."
curl -X POST https://onetouchbizcard.in/api/test-error && echo "✅ Test error sent to Sentry"

# Test Slack
echo "3. Testing Slack integration..."
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test alert from monitoring setup"}' && echo "✅ Slack test sent"

# Test email
echo "4. Testing email alerts..."
node test-email-alert.js && echo "✅ Email test sent"

echo ""
echo "Monitoring tests completed!"
```

### 2. Verification Checklist

- [ ] UptimeRobot monitors created and active
- [ ] Sentry project configured with DSN
- [ ] Slack webhook working
- [ ] Email alerts configured
- [ ] Performance monitoring active
- [ ] Database monitoring configured
- [ ] Status page created
- [ ] All alerts tested and working
- [ ] Team notified of monitoring channels

---

## Next Steps

1. **Monitor for 24 hours** - Verify all alerts are working
2. **Adjust thresholds** - Fine-tune alert thresholds based on actual traffic
3. **Document incidents** - Create incident response procedures
4. **Train team** - Ensure team knows how to respond to alerts
5. **Regular reviews** - Review monitoring data weekly

---

## Support

For questions or issues:
- Email: devops@onetouchbizcard.in
- Slack: #monitoring
- Documentation: /docs/MONITORING_AND_ALERTING.md

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Next Review**: [Date + 1 month]
