# Production Configuration Checklist

Use this checklist to ensure all production services are properly configured before deployment.

## 1. PostgreSQL Database Configuration

### Database Instance
- [ ] Production PostgreSQL instance created (version 15.4+)
- [ ] Instance class appropriate for production load (minimum: db.t3.medium)
- [ ] Storage allocated (minimum: 100GB)
- [ ] Storage encryption enabled
- [ ] Multi-AZ deployment enabled (for high availability)
- [ ] VPC security group configured to allow application access only

### Connection Configuration
- [ ] SSL/TLS connection enabled
- [ ] SSL certificate downloaded and stored securely
- [ ] Connection pooling configured (connection_limit=50)
- [ ] Connection timeout set (pool_timeout=30)
- [ ] DATABASE_URL includes SSL parameters

### Performance Optimization
- [ ] Database indexes created for frequently queried fields
- [ ] Query performance monitoring enabled (pg_stat_statements)
- [ ] Slow query logging configured
- [ ] Connection pool size optimized for application load

### Backup and Recovery
- [ ] Automated daily backups enabled
- [ ] Backup retention period set (30 days)
- [ ] Backup window configured (off-peak hours: 03:00-04:00 UTC)
- [ ] Point-in-time recovery enabled
- [ ] Backup restoration tested successfully

### Security
- [ ] Database user has minimal required permissions
- [ ] Strong password set (minimum 20 characters, mixed case, numbers, symbols)
- [ ] Public accessibility disabled
- [ ] Database firewall rules configured
- [ ] Audit logging enabled

---

## 2. Redis Configuration

### Redis Instance
- [ ] Production Redis instance created (version 7.0+)
- [ ] Instance type appropriate for caching needs (minimum: cache.t3.medium)
- [ ] Memory allocation sufficient (minimum: 2GB)
- [ ] VPC security group configured

### Security
- [ ] Transit encryption (TLS) enabled
- [ ] Authentication token configured
- [ ] Strong auth token generated (minimum 32 characters)
- [ ] REDIS_URL includes TLS parameters (rediss://)
- [ ] Public accessibility disabled

### Persistence
- [ ] RDB snapshots enabled
- [ ] Snapshot schedule configured (save 900 1, save 300 10, save 60 10000)
- [ ] AOF (Append-Only File) enabled
- [ ] Snapshot retention configured (7 days)

### Performance
- [ ] Maxmemory policy set (allkeys-lru)
- [ ] Memory limit configured (maxmemory 2gb)
- [ ] Connection timeout configured
- [ ] Eviction policy appropriate for use case

---

## 3. AWS S3 and CloudFront Configuration

### S3 Bucket Setup
- [ ] Production S3 bucket created
- [ ] Bucket name follows naming convention (onetouch-bizcard-prod-assets)
- [ ] Bucket region selected (ap-south-1 or appropriate region)
- [ ] Versioning enabled
- [ ] Server-side encryption enabled (AES256 or KMS)
- [ ] Lifecycle policies configured (optional)

### IAM Configuration
- [ ] IAM user created for application access
- [ ] Access keys generated (Access Key ID and Secret Access Key)
- [ ] IAM policy attached with minimal required permissions
- [ ] Policy allows: s3:PutObject, s3:GetObject, s3:DeleteObject, s3:ListBucket
- [ ] Access keys stored securely in environment variables

### Bucket Policy
- [ ] Bucket policy configured for CloudFront access
- [ ] Origin Access Identity (OAI) created
- [ ] Public access blocked (except through CloudFront)
- [ ] CORS configuration added for application domain

### CloudFront CDN
- [ ] CloudFront distribution created
- [ ] Origin set to S3 bucket
- [ ] Viewer protocol policy set to "Redirect HTTP to HTTPS"
- [ ] Compress objects automatically enabled
- [ ] Price class selected (Use All Edge Locations for global reach)
- [ ] SSL certificate configured (CloudFront default or custom ACM)
- [ ] Cache behavior configured
- [ ] CloudFront domain added to environment variables

### Testing
- [ ] File upload to S3 tested successfully
- [ ] File retrieval from CloudFront tested
- [ ] CORS configuration verified
- [ ] SSL certificate valid and trusted

---

## 4. Payment Gateway Configuration

### Stripe Configuration
- [ ] Stripe account created and activated
- [ ] Business verification completed
- [ ] Production mode enabled
- [ ] Publishable key obtained (pk_live_...)
- [ ] Secret key obtained (sk_live_...)
- [ ] Keys stored in environment variables

#### Stripe Webhooks
- [ ] Webhook endpoint created: https://onetouchbizcard.in/api/webhooks/stripe
- [ ] Webhook events configured:
  - [ ] payment_intent.succeeded
  - [ ] payment_intent.payment_failed
  - [ ] customer.subscription.created
  - [ ] customer.subscription.updated
  - [ ] customer.subscription.deleted
  - [ ] invoice.payment_succeeded
  - [ ] invoice.payment_failed
- [ ] Webhook signing secret obtained (whsec_...)
- [ ] Webhook endpoint tested with Stripe CLI
- [ ] Webhook signature verification implemented

### Razorpay Configuration
- [ ] Razorpay account created
- [ ] KYC completed and approved
- [ ] Production mode enabled
- [ ] Key ID obtained (rzp_live_...)
- [ ] Key Secret obtained
- [ ] Keys stored in environment variables

#### Razorpay Webhooks
- [ ] Webhook endpoint created: https://onetouchbizcard.in/api/webhooks/razorpay
- [ ] Webhook events configured:
  - [ ] payment.authorized
  - [ ] payment.captured
  - [ ] payment.failed
  - [ ] subscription.activated
  - [ ] subscription.charged
  - [ ] subscription.cancelled
- [ ] Webhook secret obtained
- [ ] Webhook endpoint tested
- [ ] Webhook signature verification implemented

### Payment Testing
- [ ] Test payment processed successfully with Stripe
- [ ] Test payment processed successfully with Razorpay
- [ ] Webhook notifications received and processed
- [ ] Subscription creation tested
- [ ] Invoice generation tested
- [ ] Payment failure handling tested
- [ ] Refund process tested

---

## 5. Email Service Configuration

### Domain Verification
- [ ] Email domain verified (onetouchbizcard.in)
- [ ] SPF record added to DNS
- [ ] DKIM record added to DNS
- [ ] DMARC record added to DNS (optional but recommended)
- [ ] Domain authentication status: Verified

### SendGrid Configuration (if using SendGrid)
- [ ] SendGrid account created
- [ ] Domain authenticated
- [ ] Sender identity verified
- [ ] API key created with Mail Send permissions
- [ ] API key stored in environment variables
- [ ] SMTP credentials configured:
  - [ ] SMTP_HOST="smtp.sendgrid.net"
  - [ ] SMTP_PORT="587"
  - [ ] SMTP_USER="apikey"
  - [ ] SMTP_PASS="SG.your_api_key"

### AWS SES Configuration (if using AWS SES)
- [ ] AWS SES account set up
- [ ] Domain verified in SES
- [ ] Production access requested and approved
- [ ] SMTP credentials created
- [ ] SMTP credentials stored in environment variables
- [ ] Sending limits appropriate for expected volume

### Email Templates
- [ ] Welcome email template created and tested
- [ ] Password reset email template created and tested
- [ ] Payment receipt email template created and tested
- [ ] Subscription renewal reminder template created and tested
- [ ] License expiry alert template created and tested
- [ ] Lead notification email template created and tested

### Email Testing
- [ ] Test email sent successfully
- [ ] Email delivery confirmed (check inbox)
- [ ] Email formatting correct (HTML and plain text)
- [ ] Links in emails working correctly
- [ ] Unsubscribe link working (if applicable)
- [ ] Email deliverability rate acceptable (> 95%)

---

## 6. Sentry Error Tracking Configuration

### Sentry Project Setup
- [ ] Sentry account created
- [ ] Organization created
- [ ] Project created (onetouch-bizcard-production)
- [ ] Platform set to Next.js
- [ ] DSN obtained
- [ ] DSN stored in environment variables

### Sentry Configuration
- [ ] SENTRY_DSN configured
- [ ] SENTRY_ENVIRONMENT set to "production"
- [ ] SENTRY_TRACES_SAMPLE_RATE configured (0.1 = 10%)
- [ ] SENTRY_RELEASE configured with version number
- [ ] Source maps upload configured (for better error tracking)

### Alert Configuration
- [ ] Alert rules created for critical errors
- [ ] Alert rules created for error rate threshold (> 1%)
- [ ] Alert rules created for performance degradation (P95 > 2s)
- [ ] Alert rules created for payment processing failures
- [ ] Alert rules created for database connection errors
- [ ] Notification channels configured (email, Slack, etc.)

### Integration Testing
- [ ] Test error sent to Sentry
- [ ] Error appears in Sentry dashboard
- [ ] Error details are complete (stack trace, context)
- [ ] Alerts triggered correctly
- [ ] Notifications received

---

## 7. Environment Variables Configuration

### Core Application Variables
- [ ] NODE_ENV="production"
- [ ] APP_URL="https://onetouchbizcard.in"
- [ ] APP_NAME="OneTouch BizCard"
- [ ] NEXTAUTH_URL="https://onetouchbizcard.in"

### Security Secrets
- [ ] NEXTAUTH_SECRET generated (32+ characters, base64)
- [ ] JWT_SECRET generated (32+ characters, base64)
- [ ] Secrets are unique and not reused from development

### Database and Cache
- [ ] DATABASE_URL configured with SSL
- [ ] REDIS_URL configured with TLS
- [ ] REDIS_TLS_ENABLED="true"

### File Storage
- [ ] AWS_ACCESS_KEY_ID configured
- [ ] AWS_SECRET_ACCESS_KEY configured
- [ ] AWS_REGION configured
- [ ] AWS_S3_BUCKET configured
- [ ] AWS_CLOUDFRONT_DOMAIN configured

### Payment Gateways
- [ ] STRIPE_PUBLIC_KEY configured (pk_live_...)
- [ ] STRIPE_SECRET_KEY configured (sk_live_...)
- [ ] STRIPE_WEBHOOK_SECRET configured (whsec_...)
- [ ] RAZORPAY_KEY_ID configured (rzp_live_...)
- [ ] RAZORPAY_KEY_SECRET configured
- [ ] RAZORPAY_WEBHOOK_SECRET configured

### Email Service
- [ ] SMTP_HOST configured
- [ ] SMTP_PORT configured
- [ ] SMTP_USER configured
- [ ] SMTP_PASS configured
- [ ] SMTP_FROM configured with verified sender

### Monitoring
- [ ] SENTRY_DSN configured
- [ ] SENTRY_ENVIRONMENT="production"
- [ ] LOG_LEVEL="info"
- [ ] ENABLE_REQUEST_LOGGING="true"

### Security Settings
- [ ] CORS_ORIGIN configured
- [ ] COOKIE_SECURE="true"
- [ ] COOKIE_SAME_SITE="strict"
- [ ] RATE_LIMIT_MAX_REQUESTS configured
- [ ] RATE_LIMIT_WINDOW_MS configured

### Feature Flags
- [ ] ENABLE_CUSTOM_DOMAINS configured
- [ ] ENABLE_SMS_NOTIFICATIONS configured
- [ ] ENABLE_CRM_INTEGRATION configured

---

## 8. Security Configuration

### SSL/TLS
- [ ] SSL certificate installed
- [ ] SSL certificate valid and not expired
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate auto-renewal configured
- [ ] TLS 1.2+ enforced (TLS 1.0/1.1 disabled)

### Application Security
- [ ] Rate limiting enabled and configured
- [ ] CORS configured for production domain only
- [ ] Security headers configured:
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
  - [ ] Strict-Transport-Security (HSTS)
  - [ ] X-XSS-Protection
- [ ] Input validation enabled
- [ ] SQL injection protection verified (Prisma ORM)
- [ ] XSS protection enabled

### Access Control
- [ ] Database user has minimal required permissions
- [ ] IAM user has least-privilege access
- [ ] API keys not exposed in client-side code
- [ ] Secrets not committed to version control
- [ ] .env.production added to .gitignore

### Network Security
- [ ] VPC security groups configured
- [ ] Database accessible only from application servers
- [ ] Redis accessible only from application servers
- [ ] SSH access restricted to specific IP addresses
- [ ] Firewall rules configured

---

## 9. Monitoring and Logging

### Application Monitoring
- [ ] Sentry error tracking active
- [ ] Application performance monitoring enabled
- [ ] Custom metrics tracking configured
- [ ] Health check endpoints implemented:
  - [ ] /api/health
  - [ ] /api/health/database
  - [ ] /api/health/redis

### Infrastructure Monitoring
- [ ] Server metrics monitoring (CPU, memory, disk)
- [ ] Database metrics monitoring (connections, queries)
- [ ] Redis metrics monitoring (memory, hit rate)
- [ ] Network metrics monitoring (bandwidth, latency)

### Logging
- [ ] Structured logging implemented
- [ ] Log aggregation configured
- [ ] Log retention policy set
- [ ] Sensitive data not logged (passwords, API keys)
- [ ] Correlation IDs added to requests

### Alerting
- [ ] Critical error alerts configured
- [ ] Performance degradation alerts configured
- [ ] Resource utilization alerts configured
- [ ] Payment failure alerts configured
- [ ] Database connection alerts configured

---

## 10. Backup and Disaster Recovery

### Database Backups
- [ ] Automated daily backups enabled
- [ ] Backup retention: 30 days
- [ ] Backup window: Off-peak hours
- [ ] Point-in-time recovery enabled
- [ ] Backup restoration tested

### File Storage Backups
- [ ] S3 versioning enabled
- [ ] S3 lifecycle policies configured
- [ ] Cross-region replication configured (optional)

### Disaster Recovery Plan
- [ ] Disaster recovery runbook documented
- [ ] RTO (Recovery Time Objective) defined
- [ ] RPO (Recovery Point Objective) defined
- [ ] Disaster recovery drill conducted
- [ ] Rollback procedures documented

---

## 11. Documentation

### Technical Documentation
- [ ] Production setup guide complete
- [ ] Architecture documentation updated
- [ ] API documentation current
- [ ] Database schema documented
- [ ] Deployment procedures documented

### Operational Documentation
- [ ] Runbook for common issues created
- [ ] Incident response procedures documented
- [ ] Escalation procedures defined
- [ ] Contact information for on-call team
- [ ] Monitoring dashboard access documented

---

## 12. Final Verification

### Configuration Review
- [ ] All environment variables set correctly
- [ ] No test/development credentials in production
- [ ] All secrets are strong and unique
- [ ] Configuration matches production requirements

### Service Connectivity
- [ ] Database connection successful
- [ ] Redis connection successful
- [ ] S3 upload/download working
- [ ] Email sending working
- [ ] Payment gateways responding
- [ ] Sentry receiving events

### Security Audit
- [ ] Security scan completed
- [ ] Vulnerabilities addressed
- [ ] Dependencies updated
- [ ] Security headers verified
- [ ] SSL configuration verified

---

## Sign-Off

### Configuration Completed By
- Name: ___________________________
- Date: ___________________________
- Signature: ___________________________

### Configuration Reviewed By
- Name: ___________________________
- Date: ___________________________
- Signature: ___________________________

### Production Deployment Approved By
- Name: ___________________________
- Date: ___________________________
- Signature: ___________________________

---

## Notes

Use this section to document any deviations from the standard configuration or special considerations:

```
[Add notes here]
```

---

**Next Steps After Checklist Completion:**
1. Run verification scripts (Task 12.2)
2. Execute load and performance testing (Task 12.3)
3. Validate backup and disaster recovery (Task 12.4)
4. Complete pre-launch checklist (Task 12.5)
5. Deploy to production (Task 12.6)
6. Monitor for 48 hours (Task 12.7)
