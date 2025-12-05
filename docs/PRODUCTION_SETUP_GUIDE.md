# Production Setup Guide

This guide provides step-by-step instructions for configuring all production services required for OneTouch BizCard platform deployment.

## Table of Contents

1. [PostgreSQL Database Setup](#1-postgresql-database-setup)
2. [Redis Configuration](#2-redis-configuration)
3. [AWS S3 and CloudFront Setup](#3-aws-s3-and-cloudfront-setup)
4. [Payment Gateway Configuration](#4-payment-gateway-configuration)
5. [Email Service Setup](#5-email-service-setup)
6. [Sentry Error Tracking](#6-sentry-error-tracking)
7. [Environment Variables](#7-environment-variables)
8. [Security Checklist](#8-security-checklist)

---

## 1. PostgreSQL Database Setup

### 1.1 Create Production Database

**Option A: AWS RDS PostgreSQL**

```bash
# Create RDS PostgreSQL instance via AWS Console or CLI
aws rds create-db-instance \
  --db-instance-identifier onetouch-bizcard-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username admin \
  --master-user-password <STRONG_PASSWORD> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --storage-encrypted \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --multi-az \
  --publicly-accessible false \
  --vpc-security-group-ids sg-xxxxxxxxx
```

**Option B: Managed PostgreSQL (DigitalOcean, Heroku, etc.)**

Follow your provider's documentation to create a production PostgreSQL instance.

### 1.2 Configure SSL Connection

1. Download SSL certificate from your database provider
2. Store certificate in secure location: `/etc/ssl/certs/postgres-ca.crt`
3. Update connection string to include SSL parameters

### 1.3 Connection Pooling Configuration

```env
DATABASE_URL="postgresql://prod_user:PASSWORD@prod-db-host:5432/onetouch_bizcard_prod?connection_limit=50&pool_timeout=30&sslmode=require&sslcert=/path/to/client-cert.pem&sslkey=/path/to/client-key.pem&sslrootcert=/path/to/ca-cert.pem"
```

**Recommended Settings:**
- Connection limit: 50 (adjust based on server capacity)
- Pool timeout: 30 seconds
- SSL mode: require
- Enable connection pooling at application level (Prisma handles this)

### 1.4 Database Performance Optimization

```sql
-- Create indexes for frequently queried fields
CREATE INDEX idx_brands_slug ON "Brand"(slug);
CREATE INDEX idx_branches_slug ON "Branch"(slug);
CREATE INDEX idx_branches_brand_id ON "Branch"("brandId");
CREATE INDEX idx_users_email ON "User"(email);
CREATE INDEX idx_subscriptions_brand_id ON "Subscription"("brandId");
CREATE INDEX idx_analytics_microsite_id ON "AnalyticsEvent"("micrositeId");
CREATE INDEX idx_analytics_timestamp ON "AnalyticsEvent"(timestamp);

-- Enable query performance monitoring
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET pg_stat_statements.track = all;
```

### 1.5 Backup Configuration

```bash
# Automated daily backups (configure in RDS or via cron)
# Retention: 30 days
# Backup window: 03:00-04:00 UTC

# Manual backup command
pg_dump -h prod-db-host -U prod_user -d onetouch_bizcard_prod -F c -f backup_$(date +%Y%m%d).dump
```

---

## 2. Redis Configuration

### 2.1 Create Production Redis Instance

**Option A: AWS ElastiCache Redis**

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id onetouch-bizcard-redis \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --cache-parameter-group default.redis7 \
  --snapshot-retention-limit 7 \
  --snapshot-window "03:00-05:00" \
  --preferred-maintenance-window "sun:05:00-sun:07:00" \
  --transit-encryption-enabled \
  --auth-token <STRONG_AUTH_TOKEN>
```

**Option B: Managed Redis (Redis Cloud, DigitalOcean, etc.)**

Follow your provider's documentation to create a production Redis instance.

### 2.2 Enable TLS/SSL

1. Enable transit encryption in Redis configuration
2. Download TLS certificate if required
3. Update connection string with TLS parameters

```env
REDIS_URL="rediss://:AUTH_TOKEN@prod-redis-host:6379"
REDIS_TLS_ENABLED="true"
```

### 2.3 Configure Persistence

**RDB (Snapshot) Configuration:**
```
save 900 1      # Save after 900 seconds if at least 1 key changed
save 300 10     # Save after 300 seconds if at least 10 keys changed
save 60 10000   # Save after 60 seconds if at least 10000 keys changed
```

**AOF (Append-Only File) Configuration:**
```
appendonly yes
appendfsync everysec
```

### 2.4 Memory Management

```
maxmemory 2gb
maxmemory-policy allkeys-lru
```

---

## 3. AWS S3 and CloudFront Setup

### 3.1 Create S3 Bucket

```bash
# Create production S3 bucket
aws s3api create-bucket \
  --bucket onetouch-bizcard-prod-assets \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket onetouch-bizcard-prod-assets \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket onetouch-bizcard-prod-assets \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

### 3.2 Configure Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity XXXXX"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::onetouch-bizcard-prod-assets/*"
    }
  ]
}
```

### 3.3 Create IAM User for Application Access

```bash
# Create IAM user
aws iam create-user --user-name onetouch-bizcard-app

# Attach S3 access policy
aws iam put-user-policy \
  --user-name onetouch-bizcard-app \
  --policy-name S3AccessPolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::onetouch-bizcard-prod-assets",
        "arn:aws:s3:::onetouch-bizcard-prod-assets/*"
      ]
    }]
  }'

# Create access keys
aws iam create-access-key --user-name onetouch-bizcard-app
```

### 3.4 Configure CloudFront CDN

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name onetouch-bizcard-prod-assets.s3.ap-south-1.amazonaws.com \
  --default-root-object index.html
```

**CloudFront Configuration:**
- Origin: S3 bucket
- Viewer Protocol Policy: Redirect HTTP to HTTPS
- Allowed HTTP Methods: GET, HEAD, OPTIONS
- Compress Objects Automatically: Yes
- Price Class: Use All Edge Locations
- SSL Certificate: Use CloudFront certificate or custom ACM certificate

### 3.5 Configure CORS for S3

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://onetouchbizcard.in"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 4. Payment Gateway Configuration

### 4.1 Stripe Production Setup

1. **Create Stripe Account**: https://dashboard.stripe.com/register
2. **Activate Account**: Complete business verification
3. **Get Production API Keys**:
   - Navigate to Developers → API keys
   - Copy Publishable key (pk_live_...)
   - Copy Secret key (sk_live_...)

4. **Configure Webhooks**:
   ```
   Webhook URL: https://onetouchbizcard.in/api/webhooks/stripe
   Events to listen:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
   ```

5. **Get Webhook Secret**: Copy signing secret (whsec_...)

### 4.2 Razorpay Production Setup

1. **Create Razorpay Account**: https://dashboard.razorpay.com/signup
2. **Complete KYC**: Submit business documents
3. **Get Production API Keys**:
   - Navigate to Settings → API Keys
   - Generate Live Mode keys
   - Copy Key ID (rzp_live_...)
   - Copy Key Secret

4. **Configure Webhooks**:
   ```
   Webhook URL: https://onetouchbizcard.in/api/webhooks/razorpay
   Events to listen:
   - payment.authorized
   - payment.captured
   - payment.failed
   - subscription.activated
   - subscription.charged
   - subscription.cancelled
   ```

5. **Get Webhook Secret**: Copy webhook secret from settings

### 4.3 Test Payment Processing

```bash
# Use test mode first, then switch to live mode
# Stripe test cards: https://stripe.com/docs/testing
# Razorpay test cards: https://razorpay.com/docs/payments/payments/test-card-details/
```

---

## 5. Email Service Setup

### 5.1 SendGrid Configuration (Recommended)

1. **Create SendGrid Account**: https://signup.sendgrid.com/
2. **Verify Domain**:
   - Navigate to Settings → Sender Authentication
   - Add domain: onetouchbizcard.in
   - Add DNS records provided by SendGrid

3. **Create API Key**:
   - Navigate to Settings → API Keys
   - Create API key with "Mail Send" permissions
   - Copy API key (starts with SG.)

4. **Configure SMTP**:
   ```env
   SMTP_HOST="smtp.sendgrid.net"
   SMTP_PORT="587"
   SMTP_USER="apikey"
   SMTP_PASS="SG.your_api_key_here"
   SMTP_FROM="noreply@onetouchbizcard.in"
   ```

### 5.2 AWS SES Configuration (Alternative)

1. **Verify Domain**:
   ```bash
   aws ses verify-domain-identity --domain onetouchbizcard.in
   ```

2. **Add DNS Records**: Add TXT and CNAME records provided by AWS

3. **Create SMTP Credentials**:
   - Navigate to SES → SMTP Settings
   - Create SMTP credentials
   - Copy username and password

4. **Request Production Access**:
   - Submit request to move out of sandbox mode
   - Provide use case and expected volume

5. **Configure SMTP**:
   ```env
   SMTP_HOST="email-smtp.ap-south-1.amazonaws.com"
   SMTP_PORT="587"
   SMTP_USER="your_smtp_username"
   SMTP_PASS="your_smtp_password"
   SMTP_FROM="noreply@onetouchbizcard.in"
   ```

### 5.3 Email Templates

Ensure all email templates are production-ready:
- Welcome email
- Password reset
- Payment receipt
- Subscription renewal reminder
- License expiry alert
- Lead notification

---

## 6. Sentry Error Tracking

### 6.1 Create Sentry Project

1. **Create Sentry Account**: https://sentry.io/signup/
2. **Create New Project**:
   - Platform: Next.js
   - Project name: onetouch-bizcard-production

3. **Get DSN**:
   - Navigate to Settings → Projects → onetouch-bizcard-production
   - Copy DSN (https://xxxxx@o0.ingest.sentry.io/xxxxx)

### 6.2 Configure Sentry

```env
SENTRY_DSN="https://examplePublicKey@o0.ingest.sentry.io/0"
SENTRY_ENVIRONMENT="production"
SENTRY_TRACES_SAMPLE_RATE="0.1"
SENTRY_RELEASE="onetouch-bizcard@1.0.0"
```

### 6.3 Set Up Alerts

Configure alerts for:
- Error rate threshold (> 1%)
- Performance degradation (P95 > 2 seconds)
- Payment processing failures
- Database connection errors

---

## 7. Environment Variables

### 7.1 Complete Production .env File

Copy `.env.production.example` to `.env.production` and fill in all values:

```bash
cp .env.production.example .env.production
```

### 7.2 Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32

# Generate Redis AUTH_TOKEN
openssl rand -base64 32
```

### 7.3 Environment Variable Checklist

- [ ] DATABASE_URL with SSL enabled
- [ ] REDIS_URL with TLS enabled
- [ ] AWS credentials (Access Key ID, Secret Access Key)
- [ ] S3 bucket name and CloudFront domain
- [ ] Stripe production keys (public, secret, webhook)
- [ ] Razorpay production keys (key ID, secret, webhook)
- [ ] SMTP credentials and verified sender domain
- [ ] Sentry DSN
- [ ] NEXTAUTH_SECRET and JWT_SECRET
- [ ] APP_URL set to production domain
- [ ] NODE_ENV set to "production"

---

## 8. Security Checklist

### 8.1 SSL/TLS Configuration

- [ ] HTTPS enabled for application
- [ ] SSL certificate installed and valid
- [ ] Database connections use SSL
- [ ] Redis connections use TLS
- [ ] Force HTTPS redirect configured

### 8.2 Access Control

- [ ] Database user has minimal required permissions
- [ ] IAM user has least-privilege S3 access
- [ ] API keys stored in environment variables (not in code)
- [ ] Secrets encrypted at rest
- [ ] VPC security groups configured properly

### 8.3 Application Security

- [ ] Rate limiting enabled
- [ ] CORS configured for production domain only
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Input validation and sanitization enabled
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS protection enabled

### 8.4 Monitoring and Logging

- [ ] Sentry error tracking configured
- [ ] Application logging enabled
- [ ] Database query logging enabled
- [ ] Audit trail for sensitive operations
- [ ] Uptime monitoring configured

### 8.5 Backup and Recovery

- [ ] Automated database backups enabled (30-day retention)
- [ ] S3 versioning enabled
- [ ] Disaster recovery plan documented
- [ ] Backup restoration tested

---

## Next Steps

After completing all configuration steps:

1. Run verification scripts (Task 12.2)
2. Execute load and performance testing (Task 12.3)
3. Validate backup and disaster recovery (Task 12.4)
4. Complete pre-launch checklist (Task 12.5)
5. Deploy to production (Task 12.6)
6. Monitor for 48 hours (Task 12.7)

---

## Support and Troubleshooting

### Common Issues

**Database Connection Errors:**
- Verify SSL certificate path
- Check security group rules
- Confirm database credentials

**Redis Connection Errors:**
- Verify TLS is enabled
- Check auth token
- Confirm security group rules

**S3 Upload Errors:**
- Verify IAM permissions
- Check bucket policy
- Confirm CORS configuration

**Payment Gateway Errors:**
- Verify webhook URLs are accessible
- Check API keys are for live mode
- Confirm webhook secrets match

**Email Delivery Issues:**
- Verify domain authentication
- Check SPF and DKIM records
- Confirm sender email is verified

For additional support, refer to:
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Sentry Documentation](https://docs.sentry.io/)
