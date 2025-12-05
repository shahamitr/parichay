# Production Environment Setup Guide

This guide walks you through setting up the OneTouch BizCard platform for production deployment.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- Redis 6+ instance
- AWS account with S3 and CloudFront access
- Stripe and Razorpay production accounts
- SMTP service (SendGrid, AWS SES, or similar)
- Sentry account for error tracking

## Step 1: Environment Configuration

### 1.1 Create Production Environment File

```bash
cd onetouch-bizcard
./scripts/setup-production.sh
```

This will create a `.env.production` file from the template.

### 1.2 Generate Secrets

Generate strong secrets for authentication:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

Update these values in `.env.production`.

### 1.3 Configure Database

Set up a production PostgreSQL database with the following configuration:

```env
DATABASE_URL="postgresql://prod_user:STRONG_PASSWORD@prod-db-host:5432/onetouch_bizcard_prod?connection_limit=50&pool_timeout=30&sslmode=require"
```

**Important settings:**
- Use SSL mode (`sslmode=require`)
- Configure connection pooling (50 connections recommended)
- Use a strong password
- Enable automated backups

### 1.4 Configure Redis

Set up a production Redis instance:

```env
REDIS_URL="redis://:REDIS_PASSWORD@prod-redis-host:6379"
REDIS_TLS_ENABLED="true"
```

**Recommended configuration:**
- Enable TLS/SSL encryption
- Set a strong password
- Configure persistence (AOF + RDB)
- Set up replication for high availability

## Step 2: AWS S3 and CloudFront Setup

### 2.1 Create S3 Bucket

1. Log in to AWS Console
2. Navigate to S3
3. Create a new bucket: `onetouch-bizcard-prod-assets`
4. Configure bucket settings:
   - Block public access: OFF (for public assets)
   - Versioning: Enabled
   - Server-side encryption: Enabled
   - Lifecycle rules: Configure for old file cleanup

### 2.2 Create IAM User

Create an IAM user with S3 access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
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
    }
  ]
}
```

Save the Access Key ID and Secret Access Key.

### 2.3 Set Up CloudFront Distribution

1. Navigate to CloudFront in AWS Console
2. Create a new distribution
3. Origin domain: Your S3 bucket
4. Origin access: Origin access control
5. Viewer protocol policy: Redirect HTTP to HTTPS
6. Cache policy: CachingOptimized
7. Save the CloudFront domain name

Update `.env.production`:

```env
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="onetouch-bizcard-prod-assets"
AWS_CLOUDFRONT_DOMAIN="d1234567890.cloudfront.net"
```

## Step 3: Payment Gateway Configuration

### 3.1 Stripe Production Setup

1. Log in to Stripe Dashboard
2. Switch to Production mode
3. Navigate to Developers > API keys
4. Copy the Publishable key and Secret key
5. Navigate to Developers > Webhooks
6. Add endpoint: `https://onetouchbizcard.in/api/webhooks/stripe`
7. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.updated`
8. Copy the Webhook signing secret

Update `.env.production`:

```env
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3.2 Razorpay Production Setup

1. Log in to Razorpay Dashboard
2. Switch to Live mode
3. Navigate to Settings > API Keys
4. Generate new API keys
5. Navigate to Settings > Webhooks
6. Add webhook URL: `https://onetouchbizcard.in/api/webhooks/razorpay`
7. Select events: `payment.captured`, `payment.failed`, `subscription.charged`
8. Copy the Webhook secret

Update `.env.production`:

```env
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="your-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

## Step 4: Email Service Configuration

### Option A: SendGrid

1. Sign up for SendGrid
2. Create an API key with Mail Send permissions
3. Verify your sender domain
4. Configure DNS records for domain authentication

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.your-api-key"
SMTP_FROM="noreply@onetouchbizcard.in"
```

### Option B: AWS SES

1. Set up AWS SES in your region
2. Verify your domain
3. Request production access (remove sandbox limits)
4. Create SMTP credentials

```env
SMTP_HOST="email-smtp.ap-south-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@onetouchbizcard.in"
```

## Step 5: Sentry Error Tracking

1. Sign up for Sentry (sentry.io)
2. Create a new project (Node.js)
3. Copy the DSN

Update `.env.production`:

```env
SENTRY_DSN="https://examplePublicKey@o0.ingest.sentry.io/0"
SENTRY_ENVIRONMENT="production"
SENTRY_TRACES_SAMPLE_RATE="0.1"
```

## Step 6: Verify Configuration

Run the verification script to ensure all environment variables are properly set:

```bash
./scripts/verify-env.sh
```

This script will check:
- All required variables are set
- No placeholder values remain
- Production API keys are being used (not test keys)
- Proper configuration format

## Step 7: Database Migration

Run database migrations in production:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed initial data
npx prisma db seed
```

## Step 8: Build and Deploy

### Build the application

```bash
npm run build
```

### Start the production server

```bash
npm run start
```

Or use a process manager like PM2:

```bash
pm2 start npm --name "onetouch-bizcard" -- start
pm2 save
pm2 startup
```

## Security Checklist

- [ ] All secrets are strong and randomly generated
- [ ] Database uses SSL connections
- [ ] Redis uses TLS encryption
- [ ] S3 bucket has proper access policies
- [ ] CloudFront uses HTTPS only
- [ ] Payment webhooks are verified
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Sentry is configured for error tracking
- [ ] Environment file is not in version control
- [ ] Backup systems are configured

## Monitoring Setup

After deployment, set up monitoring:

1. Configure uptime monitoring (UptimeRobot/Pingdom)
2. Set up Sentry alerts
3. Configure database monitoring
4. Set up log aggregation
5. Create status page

See `MONITORING_SETUP.md` for detailed instructions.

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql "$DATABASE_URL"
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli -u "$REDIS_URL" ping
```

### S3 Upload Issues

Check IAM permissions and bucket policies.

### Email Delivery Issues

Verify domain authentication and check SMTP credentials.

## Support

For issues or questions, contact the development team or refer to the main documentation.
