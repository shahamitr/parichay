# OneTouch BizCard - Production Infrastructure Setup Guide

## Overview

This guide provides comprehensive instructions for setting up the production infrastructure for OneTouch BizCard. The platform requires PostgreSQL database, Redis cache, file storage (AWS S3), and proper environment configuration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [PostgreSQL Database Setup](#postgresql-database-setup)
3. [Redis Cache Setup](#redis-cache-setup)
4. [AWS S3 File Storage Setup](#aws-s3-file-storage-setup)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Deployment Options](#deployment-options)
7. [Post-Deployment Verification](#post-deployment-verification)

---

## Prerequisites

Before starting the production setup, ensure you have:

- **Cloud Provider Account**: AWS, DigitalOcean, or similar
- **Domain Name**: Registered and configured (e.g., onetouchbizcard.in)
- **SSL Certificate**: For HTTPS (can be auto-provisioned with Let's Encrypt)
- **Payment Gateway Accounts**: Stripe and Razorpay with live API keys
- **Email Service**: SMTP credentials (Gmail, SendGrid, AWS SES, etc.)
- **Node.js**: Version 20.x or higher
- **Git**: For version control and CI/CD

---

## PostgreSQL Database Setup

### Option 1: Managed Database Service (Recommended)

#### AWS RDS PostgreSQL

1. **Create RDS Instance**
   ```bash
   # Navigate to AWS RDS Console
   # Click "Create database"
   ```

2. **Configuration Settings**
   - **Engine**: PostgreSQL 16.x
   - **Template**: Production
   - **DB Instance Class**: db.t3.medium (minimum) or db.t3.large (recommended)
   - **Storage**:
     - Type: General Purpose SSD (gp3)
     - Allocated: 100 GB (with autoscaling enabled)
   - **Multi-AZ**: Enable for high availability
   - **Database Name**: `onetouch_bizcard_prod`
   - **Master Username**: `onetouch_admin`
   - **Master Password**: Generate strong password (save securely)

3. **Network & Security**
   - **VPC**: Select your VPC
   - **Public Access**: No (access via VPC only)
   - **VPC Security Group**: Create new security group
     - Inbound Rule: PostgreSQL (5432) from application servers only
   - **Encryption**: Enable encryption at rest

4. **Backup Configuration**
   - **Automated Backups**: Enable
   - **Backup Retention**: 30 days
   - **Backup Window**: Set during low-traffic hours
   - **Copy Tags to Snapshots**: Enable

5. **Monitoring**
   - **Enhanced Monitoring**: Enable (60-second granularity)
   - **Performance Insights**: Enable

6. **Get Connection String**
   ```
   postgresql://onetouch_admin:YOUR_PASSWORD@your-db-instance.region.rds.amazonaws.com:5432/onetouch_bizcard_prod?sslmode=require
   ```

#### DigitalOcean Managed Database

1. **Create Database Cluster**
   - Navigate to Databases → Create Database Cluster
   - **Engine**: PostgreSQL 16
   - **Plan**: Production (4 GB RAM / 2 vCPUs minimum)
   - **Datacenter**: Choose closest to your users
   - **Database Name**: `onetouch_bizcard_prod`

2. **Security Settings**
   - Add trusted sources (application server IPs)
   - Enable SSL/TLS connections
   - Create database user with strong password

3. **Connection Details**
   - Copy connection string from dashboard
   - Format: `postgresql://username:password@host:port/database?sslmode=require`

### Option 2: Self-Hosted PostgreSQL

#### On Ubuntu Server

1. **Install PostgreSQL**
   ```bash
   sudo apt update
   sudo apt install postgresql-16 postgresql-contrib-16
   ```

2. **Configure PostgreSQL**
   ```bash
   sudo -u postgres psql
   ```

   ```sql
   -- Create database
   CREATE DATABASE onetouch_bizcard_prod;

   -- Create user
   CREATE USER onetouch_admin WITH ENCRYPTED PASSWORD 'your_secure_password';

   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE onetouch_bizcard_prod TO onetouch_admin;

   -- Exit
   \q
   ```

3. **Configure Remote Access** (if needed)
   ```bash
   sudo nano /etc/postgresql/16/main/postgresql.conf
   ```

   Update:
   ```
   listen_addresses = '*'
   max_connections = 100
   shared_buffers = 256MB
   ```

   ```bash
   sudo nano /etc/postgresql/16/main/pg_hba.conf
   ```

   Add:
   ```
   host    onetouch_bizcard_prod    onetouch_admin    0.0.0.0/0    md5
   ```

4. **Restart PostgreSQL**
   ```bash
   sudo systemctl restart postgresql
   ```

5. **Enable SSL** (Recommended)
   ```bash
   # Generate self-signed certificate or use Let's Encrypt
   sudo openssl req -new -x509 -days 365 -nodes -text \
     -out /etc/postgresql/16/main/server.crt \
     -keyout /etc/postgresql/16/main/server.key

   sudo chmod 600 /etc/postgresql/16/main/server.key
   sudo chown postgres:postgres /etc/postgresql/16/main/server.*
   ```

### Database Performance Tuning

Add to `postgresql.conf`:

```conf
# Memory Settings
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB

# Connection Settings
max_connections = 100

# Write-Ahead Log
wal_buffers = 16MB
checkpoint_completion_target = 0.9

# Query Planner
random_page_cost = 1.1
effective_io_concurrency = 200
```

---

## Redis Cache Setup

### Option 1: Managed Redis Service (Recommended)

#### AWS ElastiCache for Redis

1. **Create Redis Cluster**
   - Navigate to ElastiCache Console
   - Click "Create" → "Redis cluster"

2. **Configuration**
   - **Cluster Mode**: Disabled (for simplicity) or Enabled (for scaling)
   - **Engine Version**: Redis 7.x
   - **Node Type**: cache.t3.medium (minimum)
   - **Number of Replicas**: 1 (for high availability)
   - **Multi-AZ**: Enable

3. **Security**
   - **Subnet Group**: Select private subnets
   - **Security Group**: Allow port 6379 from application servers
   - **Encryption**: Enable at-rest and in-transit encryption
   - **Auth Token**: Enable and generate strong token

4. **Backup**
   - **Automatic Backups**: Enable
   - **Backup Retention**: 7 days

5. **Get Connection String**
   ```
   redis://your-cluster.region.cache.amazonaws.com:6379
   ```

   With auth:
   ```
   redis://:your-auth-token@your-cluster.region.cache.amazonaws.com:6379
   ```

#### DigitalOcean Managed Redis

1. **Create Redis Cluster**
   - Navigate to Databases → Create Database Cluster
   - **Engine**: Redis 7
   - **Plan**: Production (2 GB RAM minimum)
   - **Datacenter**: Same as your application

2. **Security**
   - Add trusted sources
   - Enable TLS

3. **Connection String**
   - Copy from dashboard

### Option 2: Self-Hosted Redis

#### On Ubuntu Server

1. **Install Redis**
   ```bash
   sudo apt update
   sudo apt install redis-server
   ```

2. **Configure Redis**
   ```bash
   sudo nano /etc/redis/redis.conf
   ```

   Update:
   ```conf
   # Bind to all interfaces (or specific IP)
   bind 0.0.0.0

   # Set password
   requirepass your_strong_redis_password

   # Enable persistence
   appendonly yes
   appendfsync everysec

   # Memory management
   maxmemory 2gb
   maxmemory-policy allkeys-lru

   # Disable dangerous commands
   rename-command FLUSHDB ""
   rename-command FLUSHALL ""
   rename-command CONFIG ""
   ```

3. **Enable and Start Redis**
   ```bash
   sudo systemctl enable redis-server
   sudo systemctl start redis-server
   ```

4. **Verify Installation**
   ```bash
   redis-cli
   AUTH your_strong_redis_password
   PING
   # Should return PONG
   ```

### Redis Performance Tuning

```conf
# /etc/redis/redis.conf

# Memory
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec

# Performance
tcp-backlog 511
timeout 300
tcp-keepalive 300
```

---

## AWS S3 File Storage Setup

### 1. Create S3 Buckets

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
```

### 2. Create Production Bucket

```bash
# Create main storage bucket
aws s3 mb s3://onetouch-bizcard-production --region ap-south-1

# Create backup bucket
aws s3 mb s3://onetouch-bizcard-backups --region ap-south-1
```

### 3. Configure Bucket Policies

**Production Bucket Policy** (`production-bucket-policy.json`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::onetouch-bizcard-production/public/*"
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::onetouch-bizcard-production",
        "arn:aws:s3:::onetouch-bizcard-production/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

Apply policy:
```bash
aws s3api put-bucket-policy \
  --bucket onetouch-bizcard-production \
  --policy file://production-bucket-policy.json
```

### 4. Enable Versioning

```bash
aws s3api put-bucket-versioning \
  --bucket onetouch-bizcard-production \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-versioning \
  --bucket onetouch-bizcard-backups \
  --versioning-configuration Status=Enabled
```

### 5. Configure Lifecycle Policies

**Lifecycle Policy** (`lifecycle-policy.json`):

```json
{
  "Rules": [
    {
      "Id": "MoveOldVersionsToGlacier",
      "Status": "Enabled",
      "NoncurrentVersionTransitions": [
        {
          "NoncurrentDays": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 90
      }
    },
    {
      "Id": "DeleteIncompleteMultipartUploads",
      "Status": "Enabled",
      "AbortIncompleteMultipartUpload": {
        "DaysAfterInitiation": 7
      }
    }
  ]
}
```

Apply lifecycle policy:
```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket onetouch-bizcard-production \
  --lifecycle-configuration file://lifecycle-policy.json
```

### 6. Enable Server-Side Encryption

```bash
aws s3api put-bucket-encryption \
  --bucket onetouch-bizcard-production \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

### 7. Configure CORS

**CORS Configuration** (`cors-config.json`):

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://onetouchbizcard.in", "https://*.onetouchbizcard.in"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Apply CORS:
```bash
aws s3api put-bucket-cors \
  --bucket onetouch-bizcard-production \
  --cors-configuration file://cors-config.json
```

### 8. Create IAM User for Application

```bash
# Create IAM user
aws iam create-user --user-name onetouch-bizcard-app

# Create access key
aws iam create-access-key --user-name onetouch-bizcard-app
# Save the AccessKeyId and SecretAccessKey
```

**IAM Policy** (`s3-access-policy.json`):

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
        "arn:aws:s3:::onetouch-bizcard-production",
        "arn:aws:s3:::onetouch-bizcard-production/*"
      ]
    }
  ]
}
```

Attach policy:
```bash
aws iam put-user-policy \
  --user-name onetouch-bizcard-app \
  --policy-name S3AccessPolicy \
  --policy-document file://s3-access-policy.json
```

### 9. Set Up CloudFront CDN (Optional but Recommended)

1. **Create CloudFront Distribution**
   - Origin: S3 bucket (onetouch-bizcard-production)
   - Origin Access: Use OAI (Origin Access Identity)
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
   - Cache Policy: CachingOptimized
   - Compress Objects: Yes

2. **Update S3 Bucket Policy for CloudFront**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowCloudFrontOAI",
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity YOUR_OAI_ID"
         },
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::onetouch-bizcard-production/*"
       }
     ]
   }
   ```

3. **Get CloudFront Domain**
   - Note the CloudFront distribution domain (e.g., `d1234567890.cloudfront.net`)
   - Use this in your `AWS_CLOUDFRONT_DOMAIN` environment variable

---

## Environment Variables Configuration

### Production Environment Variables

Create `.env.production` file (never commit to Git):

```bash
# Database Configuration
DATABASE_URL="postgresql://onetouch_admin:YOUR_PASSWORD@your-db-host:5432/onetouch_bizcard_prod?connection_limit=20&pool_timeout=30&sslmode=require"

# Authentication
NEXTAUTH_URL="https://onetouchbizcard.in"
NEXTAUTH_SECRET="GENERATE_STRONG_RANDOM_STRING_HERE"
JWT_SECRET="GENERATE_ANOTHER_STRONG_RANDOM_STRING"

# Payment Gateways - PRODUCTION KEYS
STRIPE_PUBLIC_KEY="pk_live_YOUR_STRIPE_PUBLIC_KEY"
STRIPE_SECRET_KEY="sk_live_YOUR_STRIPE_SECRET_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET"

RAZORPAY_KEY_ID="rzp_live_YOUR_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_RAZORPAY_SECRET"
RAZORPAY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"

# Email Service (Example: Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@onetouchbizcard.in"
SMTP_PASS="YOUR_APP_PASSWORD"

# SMS Service (Optional)
SMS_API_KEY="YOUR_SMS_API_KEY"
SMS_API_SECRET="YOUR_SMS_API_SECRET"

# AWS S3 File Storage
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_KEY"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="onetouch-bizcard-production"
AWS_CLOUDFRONT_DOMAIN="d1234567890.cloudfront.net"

# Redis Cache
REDIS_URL="redis://:YOUR_PASSWORD@your-redis-host:6379"
REDIS_PASSWORD="YOUR_REDIS_PASSWORD"
REDIS_TLS="true"

# Application Settings
NODE_ENV="production"
APP_URL="https://onetouchbizcard.in"

# Monitoring and Logging
SENTRY_DSN="YOUR_SENTRY_DSN"
LOG_LEVEL="info"

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="900000"

# Backup Configuration
AWS_S3_BACKUP_BUCKET="onetouch-bizcard-backups"
BACKUP_RETENTION_DAYS="30"
```

### Generating Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32

# Generate webhook secrets
openssl rand -hex 32
```

### Environment Variable Security

1. **Never commit `.env` files to Git**
   - Add to `.gitignore`
   - Use `.env.example` as template

2. **Use Secret Management Services**
   - AWS Secrets Manager
   - HashiCorp Vault
   - GitHub Secrets (for CI/CD)

3. **Rotate Secrets Regularly**
   - Database passwords: Every 90 days
   - API keys: Every 180 days
   - JWT secrets: Every 365 days

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

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
   ```bash
   # Add all production environment variables
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   # ... add all other variables
   ```

5. **Deploy**
   ```bash
   vercel --prod
   ```

6. **Configure Custom Domain**
   - Go to Vercel Dashboard → Project Settings → Domains
   - Add `onetouchbizcard.in`
   - Update DNS records as instructed

### Option 2: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t onetouch-bizcard:latest .
   ```

2. **Run with Docker Compose**
   ```bash
   # Update docker-compose.yml with production settings
   docker-compose up -d
   ```

3. **Or Deploy to Container Service**
   - AWS ECS
   - Google Cloud Run
   - DigitalOcean App Platform

### Option 3: Traditional VPS Deployment

1. **Install Node.js and PM2**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/onetouch-bizcard.git
   cd onetouch-bizcard
   ```

3. **Install Dependencies**
   ```bash
   npm ci --production
   ```

4. **Build Application**
   ```bash
   npm run build
   ```

5. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "onetouch-bizcard" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name onetouchbizcard.in;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name onetouchbizcard.in;

       ssl_certificate /etc/letsencrypt/live/onetouchbizcard.in/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/onetouchbizcard.in/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Post-Deployment Verification

### 1. Health Check

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

### 2. Database Connection Test

```bash
# SSH into application server
psql "$DATABASE_URL" -c "SELECT version();"
```

### 3. Redis Connection Test

```bash
redis-cli -u "$REDIS_URL" PING
```

### 4. S3 Upload Test

```bash
aws s3 cp test-file.txt s3://onetouch-bizcard-production/test/
aws s3 ls s3://onetouch-bizcard-production/test/
```

### 5. SSL Certificate Verification

```bash
curl -vI https://onetouchbizcard.in 2>&1 | grep -i "SSL certificate"
```

### 6. Performance Test

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test homepage
ab -n 1000 -c 10 https://onetouchbizcard.in/
```

### 7. Monitor Logs

```bash
# If using PM2
pm2 logs onetouch-bizcard

# If using Docker
docker logs -f onetouch-bizcard

# If using Vercel
vercel logs
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql "$DATABASE_URL" -c "SELECT 1;"

# Check firewall rules
sudo ufw status

# Verify PostgreSQL is running
sudo systemctl status postgresql
```

### Redis Connection Issues

```bash
# Test connection
redis-cli -u "$REDIS_URL" PING

# Check Redis logs
sudo journalctl -u redis-server -f
```

### S3 Upload Issues

```bash
# Verify AWS credentials
aws sts get-caller-identity

# Test bucket access
aws s3 ls s3://onetouch-bizcard-production/

# Check IAM permissions
aws iam get-user-policy --user-name onetouch-bizcard-app --policy-name S3AccessPolicy
```

---

## Security Checklist

- [ ] Database uses SSL/TLS encryption
- [ ] Redis requires authentication
- [ ] S3 buckets have proper access policies
- [ ] All secrets are stored securely (not in code)
- [ ] HTTPS is enforced for all connections
- [ ] Firewall rules restrict access to necessary ports only
- [ ] Regular security updates are applied
- [ ] Backup and disaster recovery procedures are tested
- [ ] Monitoring and alerting are configured
- [ ] Rate limiting is enabled on API endpoints

---

## Next Steps

1. Review [Backup and Disaster Recovery Guide](./BACKUP_AND_DISASTER_RECOVERY.md)
2. Set up [Monitoring and Alerting](./MONITORING_AND_ALERTING.md)
3. Review [Deployment Guide](./DEPLOYMENT_GUIDE.md)
4. Configure [CI/CD Pipeline](../.github/workflows/README.md)

---

## Support

For issues or questions:
- Email: support@onetouchbizcard.in
- Documentation: https://docs.onetouchbizcard.in
- GitHub Issues: https://github.com/your-org/onetouch-bizcard/issues
