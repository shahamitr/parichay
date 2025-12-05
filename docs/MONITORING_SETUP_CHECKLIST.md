# Production Monitoring Setup Checklist

## Overview

This checklist ensures all monitoring and alerting services are properly configured for OneTouch BizCard production environment.

**Setup Date**: _______________
**Completed By**: _______________
**Reviewed By**: _______________

---

## 1. Uptime Monitoring

### UptimeRobot / Pingdom Setup

- [ ] Account created
- [ ] Main application monitor configured (https://onetouchbizcard.in)
- [ ] API health check monitor configured (/api/health)
- [ ] Database connectivity monitor configured
- [ ] Monitoring interval set (5 minutes recommended)
- [ ] Alert contacts configured (email, SMS, webhook)
- [ ] Status page created
- [ ] Custom domain configured for status page (optional)
- [ ] Team notified of status page URL

**Monitor URLs**:
- Main App: _______________
- API Health: _______________
- Status Page: _______________

**Notes**: _______________

---

## 2. Error Tracking (Sentry)

### Sentry Configuration

- [ ] Sentry account created
- [ ] Project created (onetouch-bizcard-production)
- [ ] DSN keys obtained
- [ ] Environment variables configured:
  - [ ] `SENTRY_DSN`
  - [ ] `NEXT_PUBLIC_SENTRY_DSN`
  - [ ] `SENTRY_ORG`
  - [ ] `SENTRY_PROJECT`
  - [ ] `SENTRY_AUTH_TOKEN`
- [ ] Sentry configuration files verified:
  - [ ] `sentry.client.config.ts`
  - [ ] `sentry.server.config.ts`
- [ ] Test error triggered and verified in dashboard
- [ ] Alert rules configured:
  - [ ] Critical errors (> 10 in 5 min)
  - [ ] Payment failures (immediate)
  - [ ] Database errors (> 5 in 10 min)
- [ ] Performance monitoring enabled
- [ ] Transaction sample rate configured (10% recommended)
- [ ] Team members invited to project

**Sentry Project URL**: _______________

**Notes**: _______________

---

## 3. Slack Integration

### Slack Workspace Setup

- [ ] Slack workspace created/accessed
- [ ] Channels created:
  - [ ] #alerts (critical alerts)
  - [ ] #monitoring (general monitoring)
  - [ ] #deployments (deployment notifications)
- [ ] Incoming webhook app created
- [ ] Webhook URL obtained
- [ ] Environment variables configured:
  - [ ] `SLACK_WEBHOOK_URL`
  - [ ] `SLACK_ALERTS_CHANNEL`
  - [ ] `SLACK_MONITORING_CHANNEL`
- [ ] Test message sent and received
- [ ] UptimeRobot webhook configured
- [ ] Sentry Slack integration configured
- [ ] Team members added to channels

**Slack Workspace**: _______________
**Webhook URL**: _______________

**Notes**: _______________

---

## 4. Email Alerting

### SMTP Configuration

- [ ] SMTP service selected (Gmail, SendGrid, AWS SES, etc.)
- [ ] SMTP credentials obtained
- [ ] Environment variables configured:
  - [ ] `SMTP_HOST`
  - [ ] `SMTP_PORT`
  - [ ] `SMTP_USER`
  - [ ] `SMTP_PASS`
  - [ ] `SMTP_FROM`
- [ ] Email service verified in codebase (`src/lib/email-service.ts`)
- [ ] Alert email template created
- [ ] Alert recipients configured:
  - [ ] Critical: _______________
  - [ ] High: _______________
  - [ ] Medium: _______________
  - [ ] Payment: _______________
  - [ ] Database: _______________
  - [ ] Security: _______________
- [ ] Test email sent and received
- [ ] Email deliverability verified (check spam folders)

**SMTP Provider**: _______________

**Notes**: _______________

---

## 5. Performance Monitoring

### New Relic / Datadog Setup

- [ ] Service selected: [ ] New Relic [ ] Datadog [ ] Other: _______________
- [ ] Account created
- [ ] Application/project created
- [ ] License key / API key obtained
- [ ] Environment variables configured:
  - [ ] `NEW_RELIC_LICENSE_KEY` or `DD_API_KEY`
  - [ ] `NEW_RELIC_APP_NAME` or `DD_SERVICE`
- [ ] Configuration file created (`newrelic.js` or equivalent)
- [ ] Agent installed (if applicable)
- [ ] Application restarted with monitoring enabled
- [ ] Data appearing in dashboard
- [ ] Alert policies configured:
  - [ ] Slow response time (> 2 seconds)
  - [ ] High error rate (> 5%)
  - [ ] Low throughput
- [ ] Custom metrics configured (optional)
- [ ] Team members invited

**Service URL**: _______________

**Notes**: _______________

---

## 6. Database Monitoring

### PostgreSQL Monitoring Setup

- [ ] `pg_stat_statements` extension enabled
- [ ] PostgreSQL configuration updated:
  - [ ] `shared_preload_libraries = 'pg_stat_statements'`
  - [ ] `pg_stat_statements.track = all`
- [ ] Database monitoring script created (`scripts/monitor-database.sh`)
- [ ] Cron job configured for monitoring (every 15 minutes)
- [ ] CloudWatch alarms configured (if using AWS RDS):
  - [ ] High CPU (> 80%)
  - [ ] High connections (> 80)
  - [ ] Low free storage (< 10 GB)
  - [ ] High read/write latency
- [ ] Slow query logging enabled
- [ ] Database backup monitoring configured
- [ ] Connection pool monitoring configured

**Database Monitoring Dashboard**: _______________

**Notes**: _______________

---

## 7. Redis Monitoring (if applicable)

### Redis Monitoring Setup

- [ ] Redis monitoring enabled
- [ ] Memory usage alerts configured
- [ ] Connection monitoring configured
- [ ] Eviction rate monitoring configured
- [ ] CloudWatch alarms configured (if using AWS ElastiCache):
  - [ ] High memory usage (> 80%)
  - [ ] High CPU (> 80%)
  - [ ] High evictions

**Redis Monitoring Dashboard**: _______________

**Notes**: _______________

---

## 8. Log Aggregation

### Logging Setup

- [ ] Logging service selected: [ ] CloudWatch [ ] ELK Stack [ ] Other: _______________
- [ ] Log groups created:
  - [ ] Application logs
  - [ ] Access logs
  - [ ] Error logs
  - [ ] Audit logs
- [ ] Log retention policies configured (30 days recommended)
- [ ] Log aggregation working
- [ ] Log search and filtering tested
- [ ] Log-based alerts configured (optional)
- [ ] Team has access to logs

**Logging Service URL**: _______________

**Notes**: _______________

---

## 9. Status Page

### Public Status Page Setup

- [ ] Status page service selected: [ ] Statuspage.io [ ] Self-hosted [ ] Other: _______________
- [ ] Status page created
- [ ] Custom domain configured (status.onetouchbizcard.in)
- [ ] Components added:
  - [ ] Website
  - [ ] API
  - [ ] Database
  - [ ] File Storage
  - [ ] Payment Processing
- [ ] Automated status updates configured
- [ ] Incident templates created
- [ ] Maintenance window templates created
- [ ] Subscribers can sign up for notifications
- [ ] Status page URL shared with team and customers

**Status Page URL**: _______________

**Notes**: _______________

---

## 10. Alert Testing

### Alert Verification

- [ ] Health check endpoint tested
- [ ] Sentry test error triggered and received
- [ ] Slack test message sent and received
- [ ] Email test alert sent and received
- [ ] UptimeRobot alert tested (simulate downtime)
- [ ] Database alert tested
- [ ] Performance alert tested
- [ ] All alert channels verified working
- [ ] Alert escalation tested
- [ ] On-call rotation configured (if applicable)

**Test Results**: _______________

**Notes**: _______________

---

## 11. Documentation

### Monitoring Documentation

- [ ] Monitoring setup guide completed
- [ ] Alert response procedures documented
- [ ] Incident response playbook created
- [ ] Escalation procedures documented
- [ ] Team trained on monitoring tools
- [ ] Emergency contact list updated
- [ ] Runbooks created for common issues
- [ ] Monitoring dashboard URLs documented

**Documentation Location**: _______________

**Notes**: _______________

---

## 12. Team Training

### Team Readiness

- [ ] Team trained on monitoring tools
- [ ] Team knows how to access dashboards
- [ ] Team knows how to respond to alerts
- [ ] Team knows escalation procedures
- [ ] Team has access to all monitoring services
- [ ] On-call schedule established (if applicable)
- [ ] Incident response drill conducted

**Training Date**: _______________
**Attendees**: _______________

**Notes**: _______________

---

## Environment Variables Summary

Verify all required environment variables are set in production:

```bash
# Sentry
SENTRY_DSN="_______________"
NEXT_PUBLIC_SENTRY_DSN="_______________"
SENTRY_ORG="_______________"
SENTRY_PROJECT="_______________"
SENTRY_AUTH_TOKEN="_______________"

# Slack
SLACK_WEBHOOK_URL="_______________"
SLACK_ALERTS_CHANNEL="_______________"
SLACK_MONITORING_CHANNEL="_______________"

# Email
SMTP_HOST="_______________"
SMTP_PORT="_______________"
SMTP_USER="_______________"
SMTP_PASS="_______________"
SMTP_FROM="_______________"

# Performance Monitoring
NEW_RELIC_LICENSE_KEY="_______________"  # or DD_API_KEY
NEW_RELIC_APP_NAME="_______________"     # or DD_SERVICE

# UptimeRobot (optional)
UPTIMEROBOT_API_KEY="_______________"

# Status Page (optional)
STATUSPAGE_PAGE_ID="_______________"
STATUSPAGE_API_KEY="_______________"
```

---

## Verification Tests

Run the monitoring test script:

```bash
cd onetouch-bizcard/scripts
chmod +x test-monitoring.sh
./test-monitoring.sh
```

**Test Results**:
- [ ] All tests passed
- [ ] Some tests failed (document below)

**Failed Tests**: _______________

---

## Post-Setup Tasks

### 24-Hour Monitoring Period

- [ ] Monitor for 24 hours after setup
- [ ] Verify alerts are being received
- [ ] Adjust alert thresholds if needed
- [ ] Document any false positives
- [ ] Fine-tune monitoring configuration

**Monitoring Period**: _______________ to _______________

**Adjustments Made**: _______________

---

## Sign-off

### Setup Completion

**Setup Completed By**: _______________
**Signature**: _______________
**Date**: _______________

**Reviewed By**: _______________
**Signature**: _______________
**Date**: _______________

**Approved By**: _______________
**Signature**: _______________
**Date**: _______________

---

## Next Steps

- [ ] Schedule monthly monitoring review
- [ ] Schedule quarterly alert threshold review
- [ ] Add monitoring to incident response procedures
- [ ] Update team documentation
- [ ] Schedule team training refresher (quarterly)

---

## Support Contacts

**Monitoring Issues**:
- Email: devops@onetouchbizcard.in
- Slack: #monitoring
- On-call: _______________

**Emergency Contacts**:
- DevOps Lead: _______________
- CTO: _______________
- On-call Engineer: _______________

---

**Document Version**: 1.0
**Last Updated**: _______________
**Next Review**: _______________
