# 🚀 Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   ```

### Option 2: Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway up
   ```

3. **Add Database**
   ```bash
   railway add postgresql
   ```

### Option 3: Render

1. **Connect GitHub Repository**
   - Go to render.com
   - Connect your GitHub repo
   - Choose "Web Service"

2. **Configure Build**
   - Build Command: `npm run build`
   - Start Command: `npm start`

## Environment Variables

Set these environment variables in your deployment platform:

```env
# Database
DATABASE_URL="your-database-connection-string"

# Authentication
NEXTAUTH_URL="https://your-app-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Payment (optional)
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."
```

## Database Setup

### Option 1: PlanetScale (MySQL)
```bash
# Install PlanetScale CLI
curl -fsSL https://github.com/planetscale/cli/releases/latest/download/pscale_linux_amd64.tar.gz | tar -xz pscale

# Create database
pscale database create parichay

# Get connection string
pscale password create parichay main
```

### Option 2: Supabase (PostgreSQL)
1. Go to supabase.com
2. Create new project
3. Copy connection string from Settings > Database

### Option 3: Railway PostgreSQL
```bash
railway add postgresql
railway variables
```

## Run Migrations

After setting up your database:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

## Custom Domain (Optional)

### Vercel
```bash
vercel domains add yourdomain.com
```

### Railway
1. Go to Railway dashboard
2. Settings > Domains
3. Add custom domain

### Render
1. Go to Render dashboard
2. Settings > Custom Domains
3. Add domain and configure DNS

## SSL Certificate

Most platforms (Vercel, Railway, Render) provide automatic SSL certificates. No additional configuration needed.

## Production Checklist

### Phase 1: Pre-Deployment Setup (1-2 days)

#### 1.1 Infrastructure Provisioning

**Database:**
- Provision PostgreSQL 14+ instance
- Configure connection pooling (50+ connections)
- Enable SSL/TLS
- Set up automated backups
- Configure monitoring

**Redis (Optional):**
- Provision Redis 6+ instance
- Enable password authentication
- Enable TLS/SSL
- Configure persistence (AOF + RDB)
- Set memory limits

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

#### 2.1 Environment Variables

Set all required environment variables in your deployment platform.

#### 2.2 Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

#### 2.3 Build Application

```bash
npm run build
```

### Phase 3: Testing (2-4 hours)

#### 3.1 Test Critical Flows

- User registration and login
- Brand creation and configuration
- Branch creation and management
- Microsite creation and publishing
- Microsite access (/{brand}/{branch})
- Payment processing (Stripe/Razorpay)
- QR code generation
- QR code scanning and tracking
- Lead form submission
- Analytics tracking

#### 3.2 Security Audit

```bash
npm audit
```

### Phase 4: Monitoring Setup (1-2 hours)

#### 4.1 Configure Sentry

- Set up error alerts
- Configure performance monitoring
- Set up release tracking

#### 4.2 Configure Uptime Monitoring

- Add monitors for main site
- Add monitors for API endpoints
- Add monitors for health checks
- Create status page

#### 4.3 Configure Alerting

- Set up Slack notifications
- Configure email alerts
- Test all alert channels

### Phase 5: Backup Configuration (1 hour)

#### 5.1 Set Up Automated Backups

Most cloud platforms provide automated backups. Ensure they're enabled and configured properly.

#### 5.2 Test Backups

Verify that backups are working and can be restored.

## Cost Estimates

### Vercel + PlanetScale
- Vercel Pro: $20/month
- PlanetScale Scaler: $39/month
- **Total: ~$59/month**

### Railway
- Railway Pro: $20/month (includes PostgreSQL)
- **Total: ~$20/month**

### Render + Supabase
- Render: $25/month
- Supabase Pro: $25/month
- **Total: ~$50/month**

## Scaling Considerations

### When to Scale Up
- Response time > 1 second
- Error rate > 1%
- Database connections > 80%
- Monthly cost > budget threshold

### Scaling Options
1. **Upgrade plan** on current platform
2. **Add database replicas** for read scaling
3. **Implement caching** (Redis/Upstash)
4. **Optimize database queries** and indexes
5. **Move to dedicated infrastructure** (AWS/GCP)

## Monitoring

### Free Options
- **Vercel Analytics**: Built-in for Vercel deployments
- **Railway Metrics**: Built-in dashboard
- **Sentry**: Free tier for error tracking

### Setup Sentry
```bash
npm install @sentry/nextjs
```

Add to `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // Your Next.js config
}, {
  // Sentry config
});
```

## Backup Strategy

### Database Backups
```bash
# PlanetScale (automatic backups included)
pscale backup create parichay main

# PostgreSQL manual backup
pg_dump $DATABASE_URL > backup.sql
```

### Code Backups
- GitHub repository (primary)
- Regular commits and tags
- Environment variables documented

## GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

      - name: Build application
        run: npm run build

  deploy-vercel:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  run-migrations:
    needs: [deploy-vercel]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Support

For deployment issues:
1. Check platform documentation
2. Review application logs
3. Test locally first
4. Contact platform support if needed

## Next Steps

After successful deployment:
1. ✅ Test all functionality
2. ✅ Set up monitoring
3. ✅ Configure custom domain
4. ✅ Set up backups
5. ✅ Document deployment process
6. ✅ Plan scaling strategy

---

**Deployment complete! 🎉**

Your application is now live and ready for users.
   - Start Command: `npm start`

## Environment Variables

Set these environment variables in your deployment platform:

```env
# Database
DATABASE_URL="your-database-connection-string"

# Authentication
NEXTAUTH_URL="https://your-app-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Payment (optional)
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."
```

## Database Setup

### Option 1: PlanetScale (MySQL)
```bash
# Install PlanetScale CLI
curl -fsSL https://github.com/planetscale/cli/releases/latest/download/pscale_linux_amd64.tar.gz | tar -xz pscale

# Create database
pscale database create parichay

# Get connection string
pscale password create parichay main
```

### Option 2: Supabase (PostgreSQL)
1. Go to supabase.com
2. Create new project
3. Copy connection string from Settings > Database

### Option 3: Railway PostgreSQL
```bash
railway add postgresql
railway variables
```

## Run Migrations

After setting up your database:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

## Custom Domain (Optional)

### Vercel
```bash
vercel domains add yourdomain.com
```

### Railway
1. Go to Railway dashboard
2. Settings > Domains
3. Add custom domain

### Render
1. Go to Render dashboard
2. Settings > Custom Domains
3. Add domain and configure DNS

## SSL Certificate

Most platforms (Vercel, Railway, Render) provide automatic SSL certificates. No additional configuration needed.

## Monitoring

### Free Options
- **Vercel Analytics**: Built-in for Vercel deployments
- **Railway Metrics**: Built-in dashboard
- **Sentry**: Free tier for error tracking

### Setup Sentry
```bash
npm install @sentry/nextjs
```

Add to `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // Your Next.js config
}, {
  // Sentry config
});
```

## Cost Estimates

### Vercel + PlanetScale
- Vercel Pro: $20/month
- PlanetScale Scaler: $39/month
- **Total: ~$59/month**

### Railway
- Railway Pro: $20/month (includes PostgreSQL)
- **Total: ~$20/month**

### Render + Supabase
- Render: $25/month
- Supabase Pro: $25/month
- **Total: ~$50/month**

## Scaling Considerations

### When to Scale Up
- Response time > 1 second
- Error rate > 1%
- Database connections > 80%
- Monthly cost > budget threshold

### Scaling Options
1. **Upgrade plan** on current platform
2. **Add database replicas** for read scaling
3. **Implement caching** (Redis/Upstash)
4. **Optimize database queries** and indexes
5. **Move to dedicated infrastructure** (AWS/GCP)

## Backup Strategy

### Database Backups
```bash
# PlanetScale (automatic backups included)
pscale backup create parichay main

# PostgreSQL manual backup
pg_dump $DATABASE_URL > backup.sql
```

### Code Backups
- GitHub repository (primary)
- Regular commits and tags
- Environment variables documented

## Support

For deployment issues:
1. Check platform documentation
2. Review application logs
3. Test locally first
4. Contact platform support if needed

## Next Steps

After successful deployment:
1. ✅ Test all functionality
2. ✅ Set up monitoring
3. ✅ Configure custom domain
4. ✅ Set up backups
5. ✅ Document deployment process
6. ✅ Plan scaling strategy