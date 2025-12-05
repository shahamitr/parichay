# Production Services Configuration Summary

This document provides a quick overview of all production services that need to be configured for OneTouch BizCard deployment.

## Configuration Status Tracker

Use this checklist to track your configuration progress:

- [ ] PostgreSQL Database
- [ ] Redis Cache
- [ ] AWS S3 and CloudFront
- [ ] Stripe Payment Gateway
- [ ] Razorpay Payment Gateway
- [ ] Email Service (SendGrid/AWS SES)
- [ ] Sentry Error Tracking
- [ ] Environment Variables
- [ ] Security Configuration

## Quick Start

### 1. Run Setup Script

```bash
cd onetouch-bizcard
bash scripts/setup-production-services.sh
```

This interactive script will guide you through configuring all services and generate your `.env.production` file.

### 2. Review Documentation

Refer to detailed guides for each service:

- **Main Guide**: `docs/PRODUCTION_SETUP_GUIDE.md`
- **Configuration Checklist**: `docs/PRODUCTION_CONFIG_CHECKLIST.md`
- **Quick References**: `docs/quick-reference/`

## Service Overview

### 1. PostgreSQL Database

**Purpose**: Primary data storage for all application data

**Provider Options**:
- AWS RDS (Recommended)
- DigitalOcean Managed Database
- Heroku Postgres
- Self-hosted

**Key Configuration**:
```env
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require&connection_limit=50"
```

**Quick Reference**: `docs/quick-reference/DATABASE_SETUP.md`

**Estimated Setup Time**: 30-45 minutes

---

### 2. Redis Cache

**Purpose**: Caching and session management

**Provider Options**:
- AWS ElastiCache (Recommended)
- Redis Cloud
- DigitalOcean Managed Redis
- Self-hosted

**Key Configuration**:
```env
REDIS_URL="rediss://:password@host:6379"
REDIS_TLS_ENABLED="true"
```

**Quick Reference**: `docs/quick-reference/REDIS_SETUP.md`

**Estimated Setup Time**: 20-30 minutes

---

### 3. AWS S3 and CloudFront

**Purpose**: File storage and CDN for static assets

**Provider**: AWS

**Key Configuration**:
```env
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="secret_key"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="onetouch-bizcard-prod-assets"
AWS_CLOUDFRONT_DOMAIN="d1234567890.cloudfront.net"
```

**Quick Reference**: `docs/quick-reference/AWS_S3_CLOUDFRONT_SETUP.md`

**Estimated Setup Time**: 45-60 minutes

---

### 4. Stripe Payment Gateway

**Purpose**: Payment processing (International)

**Provider**: Stripe

**Key Configuration**:
```env
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Quick Reference**: `docs/quick-reference/PAYMENT_GATEWAYS_SETUP.md`

**Estimated Setup Time**: 30-45 minutes

---

### 5. Razorpay Payment Gateway

**Purpose**: Payment processing (India)

**Provider**: Razorpay

**Key Configuration**:
```env
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="secret_key"
RAZORPAY_WEBHOOK_SECRET="webhook_secret"
```

**Quick Reference**: `docs/quick-reference/PAYMENT_GATEWAYS_SETUP.md`

**Estimated Setup Time**: 30-45 minutes

---

### 6. Email Service

**Purpose**: Transactional email delivery

**Provider Options**:
- SendGrid (Recommended)
- AWS SES
- Other SMTP providers

**Key Configuration**:
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.api_key"
SMTP_FROM="noreply@onetouchbizcard.in"
```

**Quick Reference**: `docs/quick-reference/EMAIL_SERVICE_SETUP.md`

**Estimated Setup Time**: 30-45 minutes

---

### 7. Sentry Error Tracking

**Purpose**: Error monitoring and performance tracking

**Provider**: Sentry

**Key Configuration**:
```env
SENTRY_DSN="https://key@o0.ingest.sentry.io/0"
SENTRY_ENVIRONMENT="production"
SENTRY_TRACES_SAMPLE_RATE="0.1"
```

**Quick Reference**: `docs/quick-reference/SENTRY_SETUP.md`

**Estimated Setup Time**: 20-30 minutes

---

## Total Estimated Setup Time

**Minimum**: 3.5 hours
**Maximum**: 5 hours
**Average**: 4 hours

*Note: Times may vary based on familiarity with services and approval processes (e.g., AWS SES production access, Razorpay KYC)*

## Configuration Workflow

### Phase 1: Infrastructure Services (1.5-2 hours)
1. Set up PostgreSQL database
2. Configure Redis cache
3. Set up AWS S3 and CloudFront

### Phase 2: Payment Services (1-1.5 hours)
4. Configure Stripe
5. Configure Razorpay

### Phase 3: Communication Services (1 hour)
6. Set up email service
7. Configure Sentry

### Phase 4: Verification (30 minutes)
8. Review all environment variables
9. Run verification tests
10. Complete security checklist

## Environment Variables Template

Complete `.env.production` template:

```env
# Application
NODE_ENV="production"
APP_URL="https://onetouchbizcard.in"
NEXTAUTH_URL="https://onetouchbizcard.in"
NEXTAUTH_SECRET="[GENERATED]"
JWT_SECRET="[GENERATED]"

# Database
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DB]?sslmode=require&connection_limit=50"

# Redis
REDIS_URL="rediss://:[PASSWORD]@[HOST]:6379"
REDIS_TLS_ENABLED="true"

# AWS S3 and CloudFront
AWS_ACCESS_KEY_ID="[ACCESS_KEY]"
AWS_SECRET_ACCESS_KEY="[SECRET_KEY]"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="onetouch-bizcard-prod-assets"
AWS_CLOUDFRONT_DOMAIN="[CLOUDFRONT_DOMAIN]"

# Stripe
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Razorpay
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="[SECRET]"
RAZORPAY_WEBHOOK_SECRET="[WEBHOOK_SECRET]"

# Email Service
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.[API_KEY]"
SMTP_FROM="noreply@onetouchbizcard.in"

# Sentry
SENTRY_DSN="https://[KEY]@o0.ingest.sentry.io/[PROJECT]"
SENTRY_ENVIRONMENT="production"
SENTRY_TRACES_SAMPLE_RATE="0.1"

# Security
CORS_ORIGIN="https://onetouchbizcard.in"
COOKIE_SECURE="true"
COOKIE_SAME_SITE="strict"

# Monitoring
LOG_LEVEL="info"
ENABLE_REQUEST_LOGGING="true"
```

## Common Issues and Solutions

### Issue: Database Connection Fails

**Solution**:
1. Verify SSL certificate path
2. Check security group rules allow application server access
3. Confirm database credentials are correct
4. Test connection with `psql` command

### Issue: Redis Connection Timeout

**Solution**:
1. Verify TLS is enabled in connection string
2. Check auth token is correct
3. Confirm security group rules
4. Test with `redis-cli` command

### Issue: S3 Upload Fails

**Solution**:
1. Verify IAM user has correct permissions
2. Check bucket policy allows uploads
3. Confirm CORS configuration
4. Test with AWS CLI

### Issue: Payment Webhook Not Receiving Events

**Solution**:
1. Verify webhook URL is publicly accessible
2. Check webhook signature verification
3. Confirm webhook events are selected
4. Test with provider's CLI tools

### Issue: Emails Not Delivered

**Solution**:
1. Verify domain authentication (SPF, DKIM)
2. Check sender email is verified
3. Confirm SMTP credentials
4. Test with provider's test tool

### Issue: Sentry Not Receiving Events

**Solution**:
1. Verify DSN is correct
2. Check environment is set to production
3. Confirm source maps are uploaded
4. Test with manual error capture

## Security Checklist

Before going live, ensure:

- [ ] All secrets are stored in environment variables
- [ ] No credentials committed to version control
- [ ] SSL/TLS enabled for all services
- [ ] Database uses SSL connections
- [ ] Redis uses TLS encryption
- [ ] S3 bucket is not publicly accessible
- [ ] CloudFront uses HTTPS only
- [ ] Payment webhooks verify signatures
- [ ] Email domain is authenticated
- [ ] Sentry filters sensitive data
- [ ] Rate limiting is enabled
- [ ] CORS is configured for production domain only
- [ ] Security headers are configured
- [ ] Firewall rules restrict access

## Support Resources

### Documentation
- Main Setup Guide: `docs/PRODUCTION_SETUP_GUIDE.md`
- Configuration Checklist: `docs/PRODUCTION_CONFIG_CHECKLIST.md`
- Quick References: `docs/quick-reference/`

### Provider Documentation
- AWS: https://docs.aws.amazon.com/
- Stripe: https://stripe.com/docs
- Razorpay: https://razorpay.com/docs/
- SendGrid: https://docs.sendgrid.com/
- Sentry: https://docs.sentry.io/

### Community Support
- Stack Overflow
- Provider support forums
- GitHub issues

## Next Steps

After completing service configuration:

1. ✅ **Task 12.1**: Configure Production Services (Current)
2. ⏭️ **Task 12.2**: Run Production Verification Tests
3. ⏭️ **Task 12.3**: Execute Load and Performance Testing
4. ⏭️ **Task 12.4**: Conduct Backup and Disaster Recovery Validation
5. ⏭️ **Task 12.5**: Complete Pre-Launch Checklist
6. ⏭️ **Task 12.6**: Deploy to Production
7. ⏭️ **Task 12.7**: Post-Deployment Monitoring (First 48 Hours)

## Configuration Sign-Off

Once all services are configured, complete the sign-off in `docs/PRODUCTION_CONFIG_CHECKLIST.md`.

---

**Last Updated**: [Date]
**Configured By**: [Name]
**Reviewed By**: [Name]
**Status**: [In Progress / Complete]
