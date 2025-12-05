# Production Verification Testing Guide

This guide walks you through running all production verification tests before deploying to production.

## Prerequisites

Before running verification tests, ensure you have:

1. ✅ Production environment file (`.env.production`) configured
2. ✅ All required services running (Database, Redis)
3. ✅ Node.js and npm installed
4. ✅ All dependencies installed (`npm install`)

## Test Execution Order

Run tests in this order for best results:

### 1. Environment Configuration Verification

**Purpose:** Verify all required environment variables are set correctly.

**Windows:**
```powershell
npm run verify:env:ps
```

**Linux/Mac:**
```bash
npm run verify:env
```

**What it checks:**
- Database connection string
- Authentication secrets (JWT, NextAuth)
- Payment gateway keys (Stripe, Razorpay)
- Email service configuration
- AWS S3 credentials
- Redis connection string
- Sentry error tracking
- Application settings

**Expected Result:** All required variables should be set with production values (no test keys or placeholders).

---

### 2. Database Connectivity Test

**Purpose:** Verify database connection and migration status.

**Windows:**
```powershell
npm run test:database:ps
```

**Linux/Mac:**
```bash
npm run test:database
```

**What it checks:**
- Database connection successful
- Prisma can connect
- Migration status is up to date

**Expected Result:** All database tests pass, migrations are current.

---

### 3. Redis Connectivity Test

**Purpose:** Verify Redis cache connection and operations.

**Windows:**
```powershell
npm run test:redis:ps
```

**Linux/Mac:**
```bash
npm run test:redis
```

**What it checks:**
- Redis PING command
- SET/GET/DEL operations
- Redis server information

**Expected Result:** All Redis operations succeed.

---

### 4. Email Delivery Test

**Purpose:** Verify email service configuration and delivery.

**Command:**
```bash
npm run test:email
# or specify recipient
npm run test:email your-email@example.com
```

**What it checks:**
- SMTP connection verification
- Test email delivery
- Email configuration validity

**Expected Result:** Test email is sent and received successfully.

---

### 5. Monitoring Integrations Test

**Purpose:** Verify all monitoring and alerting systems.

**Windows:**
```powershell
npm run test:monitoring:ps
```

**Linux/Mac:**
```bash
npm run test:monitoring
```

**What it checks:**
- Sentry error tracking configuration
- Slack webhook (if configured)
- Email alerting configuration
- Database monitoring
- Application health endpoints
- Redis monitoring

**Expected Result:** All monitoring systems are properly configured.

---

### 6. Security Audit

**Purpose:** Perform comprehensive security checks.

**Windows:**
```powershell
npm run security:audit:ps
```

**Linux/Mac:**
```bash
npm run security:audit
```

**What it checks:**
- HTTPS enforcement
- Strong secrets (minimum 32 characters)
- Production API keys (not test keys)
- Database SSL enforcement
- Redis authentication
- Cookie security settings
- CORS configuration
- Rate limiting
- Dependency vulnerabilities
- Error tracking setup

**Expected Result:** All security checks pass with no critical errors.

---

### 7. Complete Production Verification

**Purpose:** Run all verification tests in sequence.

**Windows:**
```powershell
npm run verify:production:ps
```

**Linux/Mac:**
```bash
npm run verify:production
```

**What it checks:**
- All of the above tests
- Third-party integrations (S3, Stripe)
- Application health
- Performance metrics
- Build status

**Expected Result:** All checks pass, system ready for production.

---

## Interpreting Results

### Success Indicators

- ✅ **Green checkmarks** - Test passed
- ⚠️ **Yellow warnings** - Optional features not configured (may be acceptable)
- ✗ **Red errors** - Critical issues that must be fixed

### Common Issues and Solutions

#### Issue: Environment variables contain placeholders

**Solution:** Update `.env.production` with actual production values.

```bash
# Bad
JWT_SECRET="your-secret-key"

# Good
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

#### Issue: Using test API keys in production

**Solution:** Replace test keys with production keys.

```bash
# Bad
STRIPE_SECRET_KEY="sk_test_..."

# Good
STRIPE_SECRET_KEY="sk_live_..."
```

#### Issue: Database SSL not enforced

**Solution:** Add `sslmode=require` to DATABASE_URL.

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

#### Issue: Secrets too short

**Solution:** Generate strong secrets (minimum 32 characters).

```bash
# Generate strong secret
openssl rand -base64 32
```

#### Issue: Redis authentication missing

**Solution:** Add password to REDIS_URL.

```bash
REDIS_URL="redis://:password@host:6379"
```

---

## Pre-Launch Checklist

After all tests pass, verify:

- [ ] All verification tests completed successfully
- [ ] No critical errors in security audit
- [ ] Test email received successfully
- [ ] Database migrations are current
- [ ] Production build exists (`.next` directory)
- [ ] Monitoring systems configured
- [ ] Backup systems tested
- [ ] Load testing completed (if required)
- [ ] Disaster recovery plan documented
- [ ] Team trained on production procedures

---

## Continuous Monitoring

After deployment, continue monitoring:

1. **Application Health**
   - Check `/api/health` endpoint regularly
   - Monitor response times
   - Watch error rates in Sentry

2. **Database Performance**
   - Monitor connection pool usage
   - Watch for slow queries
   - Check disk space

3. **Redis Performance**
   - Monitor memory usage
   - Check cache hit rates
   - Watch connection count

4. **Payment Processing**
   - Monitor transaction success rates
   - Check webhook delivery
   - Watch for failed payments

5. **Email Delivery**
   - Monitor delivery rates
   - Check bounce rates
   - Watch for spam complaints

---

## Troubleshooting

### Tests fail on Windows

**Issue:** Bash scripts don't run on Windows.

**Solution:** Use PowerShell versions with `:ps` suffix:
```powershell
npm run verify:env:ps
npm run test:database:ps
npm run test:redis:ps
```

### Permission denied errors

**Issue:** Scripts not executable.

**Solution (Linux/Mac):**
```bash
chmod +x scripts/*.sh
```

### Cannot connect to database

**Issue:** Database not running or wrong credentials.

**Solution:**
1. Verify database is running
2. Check DATABASE_URL is correct
3. Test connection manually with psql

### Redis connection fails

**Issue:** Redis not running or wrong URL.

**Solution:**
1. Verify Redis is running
2. Check REDIS_URL is correct
3. Test connection with redis-cli

### Email test fails

**Issue:** SMTP credentials incorrect or service blocked.

**Solution:**
1. Verify SMTP credentials
2. Check firewall/security groups
3. Ensure SMTP port is open (587 or 465)
4. Try different SMTP provider

---

## Getting Help

If you encounter issues:

1. Check the error messages carefully
2. Review the [scripts README](../scripts/README.md)
3. Consult the [production deployment guide](./PRODUCTION_DEPLOYMENT.md)
4. Contact the DevOps team

---

## Automation

### CI/CD Integration

Add verification tests to your CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Run Production Verification
  run: |
    npm run verify:env
    npm run test:database
    npm run test:redis
    npm run security:audit
```

### Scheduled Checks

Run verification tests regularly:

```bash
# Cron job - daily at 2 AM
0 2 * * * cd /path/to/app && npm run verify:production
```

---

## Next Steps

After all verification tests pass:

1. Review [Pre-Launch Checklist](./PRE_LAUNCH_CHECKLIST.md)
2. Execute [Load Testing](./LOAD_TESTING.md)
3. Perform [Disaster Recovery Drill](./DISASTER_RECOVERY.md)
4. Proceed with [Production Deployment](./PRODUCTION_DEPLOYMENT.md)
