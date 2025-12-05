# OneTouch BizCard - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying OneTouch BizCard to production. It covers pre-deployment checklist, deployment procedures, post-deployment verification, and rollback procedures.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment Methods](#deployment-methods)
3. [Vercel Deployment](#vercel-deployment)
4. [Docker Deployment](#docker-deployment)
5. [VPS Deployment](#vps-deployment)
6. [Database Migrations](#database-migrations)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Code formatted (`npm run format:check`)
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented

### Security

- [ ] All environment variables configured
- [ ] Secrets rotated (if scheduled)
- [ ] No sensitive data in code
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers configured

### Database

- [ ] Database backup completed
- [ ] Migration scripts tested in staging
- [ ] Database connection pool configured
- [ ] Indexes optimized
- [ ] No pending migrations

### Infrastructure

- [ ] Production database provisioned
- [ ] Redis cache configured
- [ ] S3 buckets created and configured
- [ ] CDN configured
- [ ] DNS records updated
- [ ] SSL certificates valid

### Monitoring

- [ ] Error tracking configured (Sentry)
- [ ] Logging configured
- [ ] Uptime monitoring enabled
- [ ] Performance monitoring enabled
- [ ] Alerts configured

### Documentation

- [ ] CHANGELOG updated
- [ ] API documentation updated
- [ ] Deployment notes prepared
- [ ] Rollback plan documented

---

## Deployment Methods

### Comparison

| Method | Complexity | Cost | Scalability | Recommended For |
|--------|------------|------|-------------|-----------------|
| Vercel | Low | Low-Medium | High | Next.js apps (Recommended) |
| Docker | Medium | Medium | High | Containerized deployments |
| VPS | High | Low | Medium | Self-hosted solutions |

---

## Vercel Deployment

### Prerequisites

- Vercel account
- GitHub repository connected
- Vercel CLI installed

### Initial Setup

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   cd onetouch-bizcard
   vercel link
   ```

4. **Configure Environment Variables**

   Go to Vercel Dashboard → Project Settings → Environment Variables

   Or use CLI:
   ```bash
   # Add production environment variables
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   vercel env add JWT_SECRET production
   vercel env add STRIPE_SECRET_KEY production
   vercel env add RAZORPAY_KEY_SECRET production
   vercel env add AWS_ACCESS_KEY_ID production
   vercel env add AWS_SECRET_ACCESS_KEY production
   vercel env add REDIS_URL production
   vercel env add SMTP_PASS production
   # ... add all other variables
   ```

### Deployment Process

#### Automatic Deployment (Recommended)

1. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Release: v1.0.0"
   git push origin main
   ```

2. **GitHub Actions Triggers**
   - CI pipeline runs tests
   - Build verification
   - Automatic deployment to production

3. **Monitor Deployment**
   - Check GitHub Actions status
   - Monitor Vercel deployment logs
   - Verify deployment success

#### Manual Deployment

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy to Production**
   ```bash
   vercel --prod
   ```

3. **Verify Deployment**
   ```bash
   # Check deployment URL
   vercel ls

   # View logs
   vercel logs
   ```

### Custom Domain Configuration

1. **Add Domain in Vercel Dashboard**
   - Go to Project Settings → Domains
   - Add `onetouchbizcard.in`
   - Add `www.onetouchbizcard.in`

2. **Update DNS Records**

   Add the following records to your DNS provider:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Verify Domain**
   - Wait for DNS propagation (up to 48 hours)
   - Vercel will automatically provision SSL certificate

### Environment-Specific Deployments

#### Staging Deployment

```bash
# Deploy to staging (preview)
git push origin develop

# Or manual staging deployment
vercel --env=staging
```

#### Production Deployment

```bash
# Deploy to production
git push origin main

# Or manual production deployment
vercel --prod
```

---

## Docker Deployment

### Prerequisites

- Docker installed
- Docker Compose installed
- Container registry account (Docker Hub, AWS ECR, etc.)

### Build Docker Image

1. **Build Image**
   ```bash
   docker build -t onetouch-bizcard:latest .
   ```

2. **Test Image Locally**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="$DATABASE_URL" \
     -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
     -e JWT_SECRET="$JWT_SECRET" \
     onetouch-bizcard:latest
   ```

3. **Tag Image**
   ```bash
   docker tag onetouch-bizcard:latest your-registry/onetouch-bizcard:v1.0.0
   docker tag onetouch-bizcard:latest your-registry/onetouch-bizcard:latest
   ```

4. **Push to Registry**
   ```bash
   docker login
   docker push your-registry/onetouch-bizcard:v1.0.0
   docker push your-registry/onetouch-bizcard:latest
   ```

### Deploy with Docker Compose

1. **Create Production docker-compose.yml**
   ```yaml
   version: '3.8'

   services:
     app:
       image: your-registry/onetouch-bizcard:latest
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - NEXTAUTH_URL=${NEXTAUTH_URL}
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
         - JWT_SECRET=${JWT_SECRET}
         - REDIS_URL=redis://redis:6379
         - NODE_ENV=production
       depends_on:
         - redis
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
         interval: 30s
         timeout: 10s
         retries: 3

     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
       volumes:
         - redis_data:/data
       restart: unless-stopped
       command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}

     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf:ro
         - ./ssl:/etc/nginx/ssl:ro
       depends_on:
         - app
       restart: unless-stopped

   volumes:
     redis_data:
   ```

2. **Deploy**
   ```bash
   # Pull latest images
   docker-compose pull

   # Start services
   docker-compose up -d

   # View logs
   docker-compose logs -f
   ```

3. **Run Database Migrations**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

### Deploy to AWS ECS

1. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name onetouch-bizcard-prod
   ```

2. **Create Task Definition**
   ```json
   {
     "family": "onetouch-bizcard",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "1024",
     "memory": "2048",
     "containerDefinitions": [
       {
         "name": "app",
         "image": "your-registry/onetouch-bizcard:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {"name": "NODE_ENV", "value": "production"}
         ],
         "secrets": [
           {"name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:..."},
           {"name": "NEXTAUTH_SECRET", "valueFrom": "arn:aws:secretsmanager:..."}
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/onetouch-bizcard",
             "awslogs-region": "ap-south-1",
             "awslogs-stream-prefix": "app"
           }
         }
       }
     ]
   }
   ```

3. **Create Service**
   ```bash
   aws ecs create-service \
     --cluster onetouch-bizcard-prod \
     --service-name onetouch-bizcard-service \
     --task-definition onetouch-bizcard \
     --desired-count 2 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
   ```

---

## VPS Deployment

### Prerequisites

- Ubuntu 22.04 LTS server
- Root or sudo access
- Domain pointing to server IP

### Server Setup

1. **Update System**
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Install Nginx**
   ```bash
   sudo apt install -y nginx
   ```

5. **Install PostgreSQL** (if self-hosting)
   ```bash
   sudo apt install -y postgresql postgresql-contrib
   ```

6. **Install Redis** (if self-hosting)
   ```bash
   sudo apt install -y redis-server
   ```

### Application Deployment

1. **Create Application User**
   ```bash
   sudo adduser --system --group --home /opt/onetouch-bizcard onetouch
   ```

2. **Clone Repository**
   ```bash
   sudo -u onetouch git clone https://github.com/your-org/onetouch-bizcard.git /opt/onetouch-bizcard/app
   cd /opt/onetouch-bizcard/app
   ```

3. **Install Dependencies**
   ```bash
   sudo -u onetouch npm ci --production
   ```

4. **Configure Environment**
   ```bash
   sudo -u onetouch nano /opt/onetouch-bizcard/app/.env.production
   # Add all environment variables
   ```

5. **Generate Prisma Client**
   ```bash
   sudo -u onetouch npx prisma generate
   ```

6. **Run Database Migrations**
   ```bash
   sudo -u onetouch npx prisma migrate deploy
   ```

7. **Build Application**
   ```bash
   sudo -u onetouch npm run build
   ```

8. **Configure PM2**
   ```bash
   # Create PM2 ecosystem file
   sudo -u onetouch nano /opt/onetouch-bizcard/app/ecosystem.config.js
   ```

   ```javascript
   module.exports = {
     apps: [{
       name: 'onetouch-bizcard',
       script: 'npm',
       args: 'start',
       cwd: '/opt/onetouch-bizcard/app',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       error_file: '/var/log/onetouch-bizcard/error.log',
       out_file: '/var/log/onetouch-bizcard/out.log',
       log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
       merge_logs: true,
       max_memory_restart: '1G'
     }]
   };
   ```

9. **Start Application**
   ```bash
   sudo -u onetouch pm2 start ecosystem.config.js
   sudo -u onetouch pm2 save
   sudo pm2 startup systemd -u onetouch --hp /opt/onetouch-bizcard
   ```

### Nginx Configuration

1. **Create Nginx Configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/onetouch-bizcard
   ```

   ```nginx
   # Rate limiting
   limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
   limit_req_zone $binary_remote_addr zone=general_limit:10m rate=100r/s;

   # Upstream
   upstream onetouch_backend {
       least_conn;
       server 127.0.0.1:3000;
       keepalive 64;
   }

   # HTTP to HTTPS redirect
   server {
       listen 80;
       listen [::]:80;
       server_name onetouchbizcard.in www.onetouchbizcard.in;

       location /.well-known/acme-challenge/ {
           root /var/www/certbot;
       }

       location / {
           return 301 https://$server_name$request_uri;
       }
   }

   # HTTPS server
   server {
       listen 443 ssl http2;
       listen [::]:443 ssl http2;
       server_name onetouchbizcard.in www.onetouchbizcard.in;

       # SSL configuration
       ssl_certificate /etc/letsencrypt/live/onetouchbizcard.in/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/onetouchbizcard.in/privkey.pem;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;
       ssl_session_cache shared:SSL:10m;
       ssl_session_timeout 10m;

       # Security headers
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;

       # Logging
       access_log /var/log/nginx/onetouch-bizcard-access.log;
       error_log /var/log/nginx/onetouch-bizcard-error.log;

       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

       # API rate limiting
       location /api/ {
           limit_req zone=api_limit burst=20 nodelay;

           proxy_pass http://onetouch_backend;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           proxy_read_timeout 300s;
           proxy_connect_timeout 75s;
       }

       # General rate limiting
       location / {
           limit_req zone=general_limit burst=200 nodelay;

           proxy_pass http://onetouch_backend;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;

           # Cache static assets
           location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
               expires 1y;
               add_header Cache-Control "public, immutable";
           }
       }
   }
   ```

2. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/onetouch-bizcard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Install SSL Certificate**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d onetouchbizcard.in -d www.onetouchbizcard.in
   ```

---

## Database Migrations

### Pre-Migration Checklist

- [ ] Database backup completed
- [ ] Migration tested in staging
- [ ] Rollback plan prepared
- [ ] Downtime window scheduled (if needed)
- [ ] Team notified

### Running Migrations

#### Automatic (Zero-Downtime)

```bash
# Prisma automatically handles migrations
npx prisma migrate deploy
```

#### Manual Migration

```bash
# Generate migration
npx prisma migrate dev --name migration_name

# Review migration SQL
cat prisma/migrations/YYYYMMDD_migration_name/migration.sql

# Apply to production
npx prisma migrate deploy
```

### Post-Migration Verification

```bash
# Check migration status
npx prisma migrate status

# Verify database schema
psql "$DATABASE_URL" -c "\dt"

# Test application
curl https://onetouchbizcard.in/api/health
```

---

## Post-Deployment Verification

### Automated Health Checks

```bash
# Run health check script
./scripts/health-check.sh
```

### Manual Verification

1. **Application Health**
   ```bash
   curl https://onetouchbizcard.in/api/health
   ```

   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "database": "connected",
     "redis": "connected"
   }
   ```

2. **Database Connection**
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM brands;"
   ```

3. **Redis Connection**
   ```bash
   redis-cli -u "$REDIS_URL" PING
   ```

4. **S3 Access**
   ```bash
   aws s3 ls s3://onetouch-bizcard-production/
   ```

5. **Critical Workflows**
   - User registration and login
   - Microsite creation
   - Payment processing (test mode)
   - QR code generation
   - Analytics tracking

### Performance Testing

```bash
# Load test homepage
ab -n 1000 -c 10 https://onetouchbizcard.in/

# Load test API endpoint
ab -n 500 -c 5 https://onetouchbizcard.in/api/brands
```

### Monitoring

- Check error tracking dashboard (Sentry)
- Monitor application logs
- Verify uptime monitoring
- Check performance metrics

---

## Rollback Procedures

### Quick Rollback (Vercel)

```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Docker Rollback

```bash
# Pull previous version
docker pull your-registry/onetouch-bizcard:v1.0.0

# Update docker-compose.yml to use previous version
# Restart services
docker-compose up -d
```

### VPS Rollback

```bash
# Stop application
pm2 stop onetouch-bizcard

# Checkout previous version
cd /opt/onetouch-bizcard/app
git checkout v1.0.0

# Rebuild
npm ci
npm run build

# Restart application
pm2 restart onetouch-bizcard
```

### Database Rollback

```bash
# Restore from pre-deployment backup
./scripts/restore-database.sh onetouch_bizcard_pre_deploy_backup.sql.gz
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs onetouch-bizcard
# Or
docker-compose logs app
# Or
vercel logs

# Common issues:
# - Missing environment variables
# - Database connection failure
# - Port already in use
```

### Database Connection Errors

```bash
# Test connection
psql "$DATABASE_URL" -c "SELECT 1;"

# Check firewall
sudo ufw status

# Verify credentials
echo $DATABASE_URL
```

### High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart onetouch-bizcard

# Increase memory limit in ecosystem.config.js
max_memory_restart: '2G'
```

### Slow Response Times

```bash
# Check database queries
# Enable slow query log in PostgreSQL

# Check Redis connection
redis-cli -u "$REDIS_URL" INFO stats

# Review application logs for bottlenecks
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Database backup completed
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Monitoring configured
- [ ] Team notified

### During Deployment

- [ ] Deployment initiated
- [ ] Database migrations applied
- [ ] Application started successfully
- [ ] Health checks passing
- [ ] No errors in logs

### Post-Deployment

- [ ] All services running
- [ ] Critical workflows tested
- [ ] Performance acceptable
- [ ] Monitoring active
- [ ] Documentation updated
- [ ] Team notified of completion

---

## Support

For deployment issues:
- Email: devops@onetouchbizcard.in
- Slack: #deployments
- On-call: [Phone Number]

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Next Review**: [Date + 3 months]
