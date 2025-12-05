# Pre-Launch Checklist

## Overview

This comprehensive checklist ensures the OneTouch BizCard platform is ready for production launch. Complete all items before going live.

## Quick Verification

Run the automated verification script:

```bash
./scripts/verify-production.sh
```

This script checks all critical systems and provides a pass/fail report.

## Detailed Checklist

### 1. Environment Configuration ✓

- [ ] `.env.production` file created and configured
- [ ] All environment variables set (no placeholders)
- [ ] Production API keys configured (Stripe, Razorpay)
- [ ] Strong secrets generated (JWT, NextAuth)
- [ ] NODE_ENV set to "production"
- [ ] APP_URL set to production domain
- [ ] Run: `./scripts/verify-env.sh`

### 2. Database Setup ✓

- [ ] Production PostgreSQL database provisioned
- [ ] Database connection string configured with SSL
- [ ] Connection pooling configured (50+ connections)
- [ ] Database migrations applied
- [ ] Database indexes created
- [ ] Database backup schedule configured
- [ ] Test connection: `./scripts/test-database.sh`

### 3. Redis Configuration ✓

- [ ] Production Redis instance provisioned
- [ ] Redis password authentication enabled
- [ ] Redis TLS/SSL enabled
- [ ] Redis persistence configured (AOF + RDB)
- [ ] Redis memory limits set
- [ ] Test connection: `./scripts/test-redis.sh`

### 4. AWS S3 and CloudFront ✓

- [ ] S3 bucket created for file storage
- [ ] S3 bucket versioning enabled
- [ ] S3 bucket encryption enabled
- [ ] IAM user created with S3 access
- [ ] CloudFront distribution created
- [ ] CloudFront SSL certificate configured
- [ ] CDN caching rules configured
- [ ] Test upload and download functionality

### 5. Payment Gateways ✓

#### Stripe
- [ ] Stripe account in production mode
- [ ] Production API keys configured
- [ ] Webhook endpoint configured
- [ ] Webhook secret configured
- [ ] Test payment flow in production mode
- [ ] Verify webhook signature validation

#### Razorpay
- [ ] Razorpay account in live mode
- [ ] Production API keys configured
- [ ] Webhook endpoint configured
- [ ] Webhook secret configured
- [ ] Test payment flow in production mode
- [ ] Verify webhook signature validation

### 6. Email Service ✓

- [ ] SMTP service configured (SendGrid/AWS SES)
- [ ] Sender domain verified
- [ ] DNS records configured (SPF, DKIM, DMARC)
- [ ] Email templates tested
- [ ] Test email delivery: `npm run test:email`
- [ ] Verify email deliverability

### 7. Monitoring and Alerting ✓

- [ ] Sentry project created and configured
- [ ] Sentry alerts configured
- [ ] UptimeRobot/Pingdom monitors created
- [ ] Status page published
- [ ] Slack webhook configured
- [ ] Email alerting configured
- [ ] Database monitoring enabled
- [ ] Test monitoring: `./scripts/test-monitoring.sh`

### 8. Backup Systems ✓

- [ ] Automated database backups configured
- [ ] Automated file backups configured
- [ ] Backup retention policy set (30 days)
- [ ] Backups stored in S3
- [ ] Backup verification script tested
- [ ] Disaster recovery procedures documented
- [ ] Run DR drill: `./scripts/dr-drill.sh`

### 9. Security ✓

- [ ] HTTPS enforced on all endpoints
- [ ] SSL certificate valid and not expiring soon
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection protection verified
- [ ] XSS protection verified
- [ ] CSRF protection enabled
- [ ] Run security audit: `./scripts/security-audit.sh`

### 10. Performance ✓

- [ ] Production build created: `npm run build`
- [ ] Static assets optimized
- [ ] Images optimized and compressed
- [ ] CDN configured for static assets
- [ ] Database queries optimized
- [ ] Redis caching implemented
- [ ] Load testing completed
- [ ] Performance benchmarks met

### 11. Application Testing ✓

#### Critical User Flows
- [ ] User registration and login
- [ ] Brand creation and configuration
- [ ] Branch creation and management
- [ ] Microsite creation and publishing
- [ ] Microsite access (/{brand}/{branch})
- [ ] Payment processing (Stripe)
- [ ] Payment processing (Razorpay)
- [ ] QR code generation
- [ ] QR code scanning and tracking
- [ ] Lead form submission
- [ ] Lead routing (email/WhatsApp)
- [ ] Analytics tracking
- [ ] Analytics dashboard display

#### API Endpoints
- [ ] GET /api/health
- [ ] GET /api/health/database
- [ ] GET /api/health/redis
- [ ] POST /api/auth/login
- [ ] POST /api/auth/register
- [ ] GET /api/brands
- [ ] POST /api/brands
- [ ] GET /api/branches
- [ ] POST /api/branches
- [ ] POST /api/payments/stripe/create-intent
- [ ] POST /api/payments/razorpay/create-order
- [ ] POST /api/webhooks/stripe
- [ ] POST /api/webhooks/razorpay

### 12. DNS and Domain Configuration ✓

- [ ] Domain purchased and configured
- [ ] DNS A record pointing to server
- [ ] DNS CNAME for www subdomain
- [ ] SSL certificate installed
- [ ] DNS propagation verified
- [ ] Email DNS records configured (MX, SPF, DKIM)

### 13. Deployment ✓

- [ ] CI/CD pipeline configured
- [ ] Automated tests passing
- [ ] Production deployment successful
- [ ] Application running (PM2 or similar)
- [ ] Health checks passing
- [ ] Logs being collected
- [ ] Rollback plan documented

### 14. Documentation ✓

- [ ] Production setup guide complete
- [ ] Disaster recovery runbook complete
- [ ] Monitoring setup guide complete
- [ ] Security audit guide complete
- [ ] Load testing guide complete
- [ ] API documentation complete
- [ ] User documentation complete
- [ ] Support team trained

### 15. Legal and Compliance ✓

- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent banner implemented
- [ ] GDPR compliance verified
- [ ] Data retention policy documented
- [ ] Data deletion process implemented

### 16. Business Readiness ✓

- [ ] Pricing plans finalized
- [ ] Payment processing tested
- [ ] Invoice generation tested
- [ ] Subscription management tested
- [ ] Customer support channels ready
- [ ] Marketing materials prepared
- [ ] Launch announcement ready

## Pre-Launch Testing Scenarios

### Scenario 1: New User Onboarding

1. Register new account
2. Verify email (if applicable)
3. Create first brand
4. Upload logo and set theme
5. Create first branch
6. Configure microsite
7. Publish microsite
8. Access microsite at /{brand}/{branch}
9. Verify all sections display correctly

**Expected Result:** Complete flow works without errors

### Scenario 2: Payment Processing

1. Select subscription plan
2. Enter payment details (Stripe)
3. Complete payment
4. Verify webhook received
5. Verify subscription activated
6. Verify invoice generated
7. Verify email notification sent

**Expected Result:** Payment processed successfully, subscription active

### Scenario 3: Lead Generation

1. Access microsite
2. Fill out contact form
3. Submit form
4. Verify lead stored in database
5. Verify email notification sent
6. Verify WhatsApp notification (if configured)
7. Check lead in dashboard

**Expected Result:** Lead captured and routed correctly

### Scenario 4: QR Code Flow

1. Generate QR code for branch
2. Download QR code
3. Scan QR code with mobile device
4. Verify microsite loads
5. Verify scan tracked in analytics
6. Check analytics dashboard

**Expected Result:** QR code works and tracking is accurate

### Scenario 5: High Load

1. Run load test: `npm run load:test`
2. Monitor system metrics
3. Verify response times acceptable
4. Verify error rate low
5. Verify system recovers after test

**Expected Result:** System handles load without issues

## Launch Day Checklist

### Morning of Launch

- [ ] Run full verification: `./scripts/verify-production.sh`
- [ ] Check all monitoring systems
- [ ] Verify backup systems running
- [ ] Review error logs (should be clean)
- [ ] Test critical user flows
- [ ] Verify payment processing
- [ ] Check database performance
- [ ] Verify CDN working

### During Launch

- [ ] Monitor error rates in Sentry
- [ ] Watch server metrics (CPU, memory, disk)
- [ ] Monitor database connections
- [ ] Check Redis memory usage
- [ ] Watch for payment errors
- [ ] Monitor user registrations
- [ ] Check email delivery
- [ ] Review application logs

### Post-Launch (First 24 Hours)

- [ ] Monitor system stability
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify backup completion
- [ ] Review user feedback
- [ ] Check payment processing
- [ ] Monitor database growth
- [ ] Review analytics data

## Rollback Plan

If critical issues occur after launch:

1. **Immediate Actions:**
   - Stop accepting new users (maintenance mode)
   - Notify team via Slack
   - Assess severity of issue

2. **Rollback Procedure:**
   ```bash
   # Stop application
   pm2 stop onetouch-bizcard

   # Checkout previous version
   git checkout <previous-stable-tag>

   # Rebuild
   npm run build

   # Restart application
   pm2 start onetouch-bizcard
   ```

3. **Database Rollback (if needed):**
   ```bash
   # Restore from backup
   ./scripts/restore-database.sh ./backups/database/latest.sql.gz
   ```

4. **Communication:**
   - Update status page
   - Notify users via email
   - Post on social media
   - Provide ETA for resolution

## Post-Launch Monitoring

### First Week

- Daily review of:
  - Error rates
  - Performance metrics
  - User feedback
  - Payment processing
  - Database performance
  - Backup completion

### First Month

- Weekly review of:
  - System stability
  - Performance trends
  - Security incidents
  - Backup integrity
  - User growth
  - Resource utilization

## Success Criteria

The launch is considered successful when:

- [ ] All automated checks pass
- [ ] Error rate < 1%
- [ ] P95 response time < 2 seconds
- [ ] Payment success rate > 95%
- [ ] No critical security issues
- [ ] Backup systems working
- [ ] Monitoring systems active
- [ ] User feedback positive

## Emergency Contacts

**On-Call Engineer:** [Phone]
**Engineering Manager:** [Phone]
**CTO:** [Phone]
**DevOps Lead:** [Phone]

**External Support:**
- AWS Support: [Ticket system]
- Stripe Support: [Email/Phone]
- Razorpay Support: [Email/Phone]

## Final Sign-Off

Before launching to production, obtain sign-off from:

- [ ] Engineering Lead
- [ ] DevOps Lead
- [ ] Security Lead
- [ ] Product Manager
- [ ] CTO

**Launch Date:** _______________

**Signed By:** _______________

---

## Notes

Use this space to document any specific considerations or issues encountered during the pre-launch process:

```
[Add notes here]
```
