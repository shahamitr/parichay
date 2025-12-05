# Production Deployment Guide

## Overview

This guide provides a complete walkthrough for deploying the OneTouch BizCard platform to production.

## Quick Start

For experienced teams, follow these steps:

1. **Setup Environment**
   ```bash
   ./scripts/setup-production.sh
   # Edit .env.production with actual values
   ```

2. **Verify Configuration**
   ```bash
   ./scripts/verify-env.sh
   ```

3. **Run Full Verification**
   ```bash
   ./scripts/verify-production.sh
   ```

4. **Deploy**
   ```bash
   npm run build
   npm run start
   ```

## Detailed Deployment Steps

### Phase 1: Pre-Deployment Setup (1-2 days)

#### 1.1 Infrastructure Provisioning

**Database:**
- Provision PostgreSQL 14+ instance
- Configure connection pooling (50+ connections)
- Enable SSL/TLS
- Set up automated backups
- Configure monitoring

**Redis:**
- Provision Redis 6+ instance
- Enable password authentication
- Enable TLS/SSL
- Configure persistence (AOF + RDB)
- Set memory limits

**File Storage:**
- Create AWS S3 bucket
- Enable versioning
- Enable encryption
- Create IAM user with S3 access
- Set up CloudFront distribution

**Compute:**
- Provision application server (EC2, DigitalOcean, etc.)
- Install Node.js 18+
- Install PostgreSQL client
- Install Redis client
- Configure firewall rules

#### 1.2 Third-Party Services

**Payment Gateways:**
- Stripe: Switch to production mode, get live API keys
- Razorpay: Switch to live mode, get live API keys
- Configure webhooks for both

**Email Service:**
- Set up SendGrid or AWS SES
- Verify sender domain
- Configure DNS records (SPF, DKIM, DMARC)
- Get SMTP credentials

**Monitoring:**
- Create Sentry project
- Set up UptimeRobot or Pingdom
- Configure Slack webhook
- Set up status page

#### 1.3 DNS Configuration

- Point domain to server IP
- Configure SSL certificate
- Set up www subdomain
- Configure email DNS records

### Phase 2: Application Configuration (2-4 hours)

#### 2.1 Clone Repository

```bash
git clone https://github.com/your-org/onetouch-bizcard.git
cd onetouch-bizcard
npm install
```

#### 2.2 Configure Environment

```bash
./scripts/setup-production.sh
```

Edit `.env.production` with actual values:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Authentication
NEXTAUTH_URL="https://onetouchbizcard.in"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
JWT_SECRET="<generate-with-openssl-rand-base64-32>"

# Payment Gateways
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG...."
SMTP_FROM="noreply@onetouchbizcard.in"

# AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="onetouch-bizcard-prod-assets"
AWS_CLOUDFRONT_DOMAIN="d1234567890.cloudfront.net"

# Redis
REDIS_URL="redis://:password@host:6379"
REDIS_TLS_ENABLED="true"

# Sentry
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_ENVIRONMENT="production"

# Application
NODE_ENV="production"
APP_URL="https://onetouchbizcard.in"
```

#### 2.3 Verify Configuration

```bash
./scripts/verify-env.sh
```

### Phase 3: Database Setup (1-2 hours)

#### 3.1 Test Connection

```bash
./scripts/test-database.sh
```

#### 3.2 Run Migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

#### 3.3 Seed Initial Data (Optional)

```bash
npx prisma db seed
```

### Phase 4: Testing (2-4 hours)

#### 4.1 Test All Services

```bash
# Test database
./scripts/test-database.sh

# Test Redis
./scripts/test-redis.sh

# Test email
npm run test:email your-email@example.com

# Test monitoring
./scripts/test-monitoring.sh
```

#### 4.2 Security Audit

```bash
./scripts/security-audit.sh
npm audit
```

#### 4.3 Build Application

```bash
npm run build
```

#### 4.4 Start Application (Test)

```bash
npm run start
```

Test critical flows:
- User registration
- Brand creation
- Microsite access
- Payment processing
- QR code generation

### Phase 5: Monitoring Setup (1-2 hours)

#### 5.1 Configure Sentry

- Set up error alerts
- Configure performance monitoring
- Set up release tracking

#### 5.2 Configure Uptime Monitoring

- Add monitors for main site
- Add monitors for API endpoints
- Add monitors for health checks
- Create status page

#### 5.3 Configure Alerting

- Set up Slack notifications
- Configure email alerts
- Set up SMS alerts (optional)
- Test all alert channels

### Phase 6: Backup Configuration (1 hour)

#### 6.1 Set Up Automated Backups

```bash
# Edit crontab
crontab -e

# Add backup jobs
0 */6 * * * cd /path/to/onetouch-bizcard && ./scripts/backup-database.sh
0 2 * * * cd /path/to/onetouch-bizcard && ./scripts/backup-files.sh
0 3 * * 0 cd /path/to/onetouch-bizcard && ./scripts/verify-backups.sh
```

#### 6.2 Test Backups

```bash
# Create backup
./scripts/backup-database.sh

# Verify backup
./scripts/verify-backups.sh
```

### Phase 7: Load Testing (2-4 hours)

#### 7.1 Install k6

```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6
```

#### 7.2 Run Load Tests

```bash
export APP_URL="https://onetouchbizcard.in"

# Normal load test
npm run load:test

# Stress test
npm run load:stress

# Spike test
npm run load:spike
```

#### 7.3 Analyze Results

Review test results and optimize if needed:
- Check response times
- Review error rates
- Monitor resource usage
- Optimize bottlenecks

### Phase 8: Final Verification (1 hour)

#### 8.1 Run Complete Verification

```bash
./scripts/verify-production.sh
```

This checks:
- Environment configuration
- Database connectivity
- Redis connectivity
- Application health
- Third-party integrations
- Security configuration
- Backup systems
- Monitoring systems
- Performance metrics

#### 8.2 Review Pre-Launch Checklist

Go through `docs/PRE_LAUNCH_CHECKLIST.md` and ensure all items are checked.

### Phase 9: Deployment (30 minutes)

#### 9.1 Set Up Process Manager

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "onetouch-bizcard" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

#### 9.2 Configure Nginx (Optional)

If using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name onetouchbizcard.in www.onetouchbizcard.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name onetouchbizcard.in www.onetouchbizcard.in;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 9.3 Verify Deployment

```bash
# Check application is running
pm2 status

# Check logs
pm2 logs onetouch-bizcard

# Test endpoints
curl https://onetouchbizcard.in/api/health
curl https://onetouchbizcard.in/
```

### Phase 10: Post-Deployment Monitoring (24 hours)

#### 10.1 Monitor Closely

Watch these metrics for the first 24 hours:
- Error rates in Sentry
- Response times
- Server resources (CPU, memory, disk)
- Database connections
- Redis memory
- Payment processing
- User registrations

#### 10.2 Be Ready to Rollback

If critical issues occur:

```bash
# Stop application
pm2 stop onetouch-bizcard

# Rollback to previous version
git checkout <previous-tag>
npm run build

# Restart
pm2 start onetouch-bizcard
```

## Deployment Checklist

Use this quick checklist during deployment:

- [ ] Infrastructure provisioned
- [ ] Third-party services configured
- [ ] DNS configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] All tests passing
- [ ] Security audit passed
- [ ] Load testing completed
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] Application deployed
- [ ] Health checks passing
- [ ] Team notified

## Troubleshooting

### Application Won't Start

1. Check logs: `pm2 logs onetouch-bizcard`
2. Verify environment variables: `./scripts/verify-env.sh`
3. Check database connection: `./scripts/test-database.sh`
4. Check Redis connection: `./scripts/test-redis.sh`

### High Error Rates

1. Check Sentry for error details
2. Review application logs
3. Check database performance
4. Verify external services are up
5. Check rate limiting configuration

### Slow Performance

1. Check database query performance
2. Verify Redis caching is working
3. Check CDN configuration
4. Review application logs for slow operations
5. Run load test to identify bottlenecks

### Payment Processing Failures

1. Verify API keys are correct
2. Check webhook configuration
3. Review payment gateway logs
4. Verify webhook signature validation
5. Check for rate limiting issues

## Maintenance

### Daily Tasks

- Review error logs in Sentry
- Check monitoring dashboards
- Verify backup completion
- Monitor resource usage

### Weekly Tasks

- Review performance metrics
- Analyze user feedback
- Check for security updates
- Review database performance

### Monthly Tasks

- Run security audit
- Review and optimize slow queries
- Update dependencies
- Review backup retention
- Conduct load testing

### Quarterly Tasks

- Run disaster recovery drill
- Conduct penetration testing
- Review and update documentation
- Optimize infrastructure costs

## Support

For deployment issues or questions:

- **Documentation:** `/docs` directory
- **Scripts:** `/scripts` directory
- **DevOps Team:** [contact info]
- **Emergency:** [on-call rotation]

## Additional Resources

- [Production Setup Guide](./PRODUCTION_SETUP.md)
- [Monitoring Setup Guide](./MONITORING_SETUP.md)
- [Disaster Recovery Runbook](./DISASTER_RECOVERY.md)
- [Security Audit Guide](./SECURITY_AUDIT.md)
- [Load Testing Guide](./LOAD_TESTING.md)
- [Pre-Launch Checklist](./PRE_LAUNCH_CHECKLIST.md)
