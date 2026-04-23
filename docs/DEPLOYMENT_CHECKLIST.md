# Deployment Checklist

Complete checklist for deploying Parichay on AWS with your domain.

## 📋 Pre-Deployment Checklist

### 1. Prerequisites
- [ ] AWS Account created and verified
- [ ] Domain name purchased and accessible
- [ ] GitHub/GitLab account for code repository
- [ ] AWS CLI installed locally (optional but recommended)
- [ ] Node.js 18+ installed locally

### 2. Service Accounts Setup
- [ ] Google Maps API key obtained
- [ ] Stripe account created (optional)
- [ ] Razorpay account created (optional)
- [ ] Twilio account created (optional)

## 🚀 Deployment Options

Choose ONE of these options:

### Option A: AWS Free Tier (Recommended for Production)
**Best for**: Production apps, need full control, 12 months free
**Estimated time**: 2-3 hours
**Follow**: `docs/AWS_FREE_DEPLOYMENT_GUIDE.md`

- [ ] Step 1: Set up RDS MySQL database
- [ ] Step 2: Set up ElastiCache Redis
- [ ] Step 3: Set up S3 bucket for file storage
- [ ] Step 4: Set up Amazon SES for email
- [ ] Step 5: Deploy with AWS Amplify
- [ ] Step 6: Run database migrations
- [ ] Step 7: Configure custom domain
- [ ] Step 8: Configure VPC peering (optional)

### Option B: Vercel + Free Services (Easiest)
**Best for**: Quick deployment, minimal setup, always free
**Estimated time**: 30-60 minutes
**Follow**: `docs/ZERO_COST_DEPLOYMENT_ALTERNATIVE.md`

- [ ] Step 1: Set up PlanetScale database
- [ ] Step 2: Set up Upstash Redis
- [ ] Step 3: Set up Vercel Blob or Cloudinary
- [ ] Step 4: Set up Resend for email
- [ ] Step 5: Update code for Vercel
- [ ] Step 6: Deploy to Vercel
- [ ] Step 7: Configure custom domain

### Option C: Railway (Simplest All-in-One)
**Best for**: Simplest setup, all services in one place
**Estimated time**: 20-30 minutes

- [ ] Create Railway account
- [ ] Install Railway CLI
- [ ] Deploy app with MySQL and Redis
- [ ] Configure environment variables
- [ ] Set up custom domain

## 🔧 Configuration Steps

### 1. Environment Variables Setup

Create `.env.production` with these required variables:

```env
# Database
DATABASE_URL="[your-database-connection-string]"

# Authentication
JWT_SECRET="[generate-random-32-char-string]"
JWT_REFRESH_SECRET="[generate-random-32-char-string]"

# App URLs
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"

# Redis
REDIS_URL="[your-redis-connection-string]"

# Email
SMTP_HOST="[your-smtp-host]"
SMTP_PORT="587"
SMTP_USER="[your-smtp-username]"
SMTP_PASS="[your-smtp-password]"

# File Storage
AWS_ACCESS_KEY_ID="[your-access-key]"
AWS_SECRET_ACCESS_KEY="[your-secret-key]"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="[your-bucket-name]"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="[your-google-maps-key]"

# Optional Services
STRIPE_SECRET_KEY="[your-stripe-key]"
STRIPE_PUBLISHABLE_KEY="[your-stripe-public-key]"
TWILIO_ACCOUNT_SID="[your-twilio-sid]"
TWILIO_AUTH_TOKEN="[your-twilio-token]"
TWILIO_PHONE_NUMBER="[your-twilio-number]"

# Security
CRON_SECRET="[generate-random-string]"
NODE_ENV="production"
```

**Generate secure secrets:**
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Database Setup

- [ ] Database created
- [ ] Connection string obtained
- [ ] Prisma migrations run
- [ ] Demo data seeded (optional)

**Run migrations:**
```bash
export DATABASE_URL="your-connection-string"
npx prisma migrate deploy
# or for PlanetScale
npx prisma db push
```

### 3. Domain Configuration

- [ ] DNS records updated
- [ ] SSL certificate provisioned
- [ ] Domain verified in hosting platform
- [ ] WWW redirect configured (optional)

**DNS Records:**
```
Type: CNAME
Name: www
Value: [your-hosting-platform-url]

Type: A (or CNAME/ALIAS)
Name: @
Value: [your-hosting-platform-ip-or-url]
```

## ✅ Post-Deployment Verification

### 1. Basic Functionality Tests

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Email sending works
- [ ] File upload works
- [ ] QR code generation works
- [ ] Microsite creation works
- [ ] Custom domain microsites work (/{brand}/{branch})

### 2. Performance Tests

- [ ] Page load time < 3 seconds
- [ ] Images load correctly
- [ ] CDN working (if configured)
- [ ] Mobile responsive
- [ ] SSL certificate valid

### 3. Security Tests

- [ ] HTTPS enforced
- [ ] Environment variables not exposed
- [ ] Database not publicly accessible
- [ ] API endpoints protected
- [ ] CORS configured correctly

### 4. Integration Tests

- [ ] Payment gateway working (if configured)
- [ ] SMS sending working (if configured)
- [ ] Google Maps displaying correctly
- [ ] Analytics tracking working
- [ ] Email notifications working

## 📊 Monitoring Setup

### 1. Set Up Monitoring

- [ ] CloudWatch alarms configured (AWS)
- [ ] Vercel Analytics enabled (Vercel)
- [ ] Error tracking configured (Sentry)
- [ ] Uptime monitoring (UptimeRobot or similar)

### 2. Set Up Alerts

- [ ] Database CPU > 80%
- [ ] Storage > 90% of limit
- [ ] Error rate > 5%
- [ ] Response time > 5 seconds

### 3. Set Up Backups

- [ ] Database automated backups enabled
- [ ] Manual backup tested
- [ ] Backup restoration tested
- [ ] S3 versioning enabled (optional)

## 💰 Cost Monitoring

### AWS Free Tier Limits

- [ ] RDS: 750 hours/month (db.t3.micro)
- [ ] ElastiCache: 750 hours/month (cache.t3.micro)
- [ ] S3: 5GB storage, 20K GET, 2K PUT
- [ ] Amplify: 1000 build minutes, 15GB storage
- [ ] SES: 62,000 emails/month

### Set Up Budget Alerts

- [ ] AWS Budget created ($10 threshold)
- [ ] Billing alerts enabled
- [ ] Cost anomaly detection enabled
- [ ] Weekly cost reports configured

## 🔒 Security Hardening

### 1. AWS Security

- [ ] MFA enabled on root account
- [ ] IAM users created (no root access)
- [ ] Security groups configured (minimal access)
- [ ] VPC configured for RDS/Redis
- [ ] S3 bucket policy reviewed
- [ ] CloudTrail enabled (audit logs)

### 2. Application Security

- [ ] Strong JWT secrets configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] SQL injection protection verified
- [ ] XSS protection enabled
- [ ] CSRF protection enabled

### 3. Compliance

- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] Cookie consent implemented (if needed)
- [ ] GDPR compliance reviewed (if EU users)

## 📚 Documentation

- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Admin credentials stored securely
- [ ] Disaster recovery plan created
- [ ] Team access configured

## 🎯 Go-Live Checklist

### Final Steps Before Launch

- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Monitoring configured
- [ ] Backups tested
- [ ] Team trained
- [ ] Support process defined
- [ ] Marketing materials ready

### Launch Day

- [ ] Final backup taken
- [ ] DNS updated to production
- [ ] SSL certificate verified
- [ ] Monitoring active
- [ ] Team on standby
- [ ] Announcement sent

### Post-Launch (First 24 Hours)

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all integrations
- [ ] Review user feedback
- [ ] Check cost usage
- [ ] Verify backups running

## 🚨 Troubleshooting

### Common Issues

**Build fails:**
- Check environment variables
- Verify Prisma generates correctly
- Check Node.js version

**Database connection fails:**
- Verify connection string
- Check security group rules
- Ensure database is running

**File upload fails:**
- Check S3 permissions
- Verify CORS configuration
- Check IAM credentials

**Email not sending:**
- Verify SMTP credentials
- Check SES verification status
- Review email logs

## 📞 Support Resources

- AWS Support: https://console.aws.amazon.com/support
- Vercel Support: https://vercel.com/support
- PlanetScale Support: https://planetscale.com/support
- Community: [Your support channel]

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Application is accessible via your domain
- ✅ All core features working
- ✅ No critical errors in logs
- ✅ Performance meets requirements
- ✅ Security measures in place
- ✅ Monitoring and alerts active
- ✅ Team can access and manage
- ✅ Users can register and use the platform

---

**Estimated Total Time**: 2-4 hours (depending on option chosen)

**Recommended Path**: Start with Vercel for quick deployment, migrate to AWS later if needed.
