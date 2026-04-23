# AWS Free Tier Deployment Guide

Complete guide to deploy Parichay on AWS with minimal/zero cost using AWS Free Tier.

## 🎯 Overview

This guide helps you deploy the Parichay app on AWS leveraging free tier services:
- **AWS Amplify** (Free tier: 1000 build minutes/month, 15GB storage, 5GB served/month)
- **Amazon RDS MySQL** (Free tier: 750 hours/month of db.t3.micro or db.t4g.micro)
- **Amazon ElastiCache Redis** (Free tier: 750 hours/month of cache.t3.micro or cache.t4g.micro)
- **Amazon S3** (Free tier: 5GB storage, 20,000 GET requests, 2,000 PUT requests)
- **Amazon SES** (Free tier: 62,000 emails/month when sending from EC2)
- **Your existing domain** (Route 53 or external DNS)

## 📋 Prerequisites

- AWS Account (with Free Tier eligibility)
- Your domain name
- GitHub/GitLab repository (for Amplify deployment)
- Basic AWS knowledge

## 🚀 Deployment Steps

### Step 1: Set Up RDS MySQL Database

1. **Navigate to RDS Console**
   - Go to AWS Console → RDS → Create database

2. **Configure Database**
   ```
   Engine: MySQL 8.0
   Template: Free tier
   DB Instance: db.t3.micro (or db.t4g.micro)
   Storage: 20 GB (Free tier limit)
   DB Instance Identifier: parichay-db
   Master username: admin
   Master password: [Create strong password]

   Public access: No (for security)
   VPC: Default VPC
   Security group: Create new (parichay-db-sg)
   ```

3. **Configure Security Group**
   - Edit `parichay-db-sg` inbound rules
   - Add rule: MySQL/Aurora (3306) from your VPC CIDR or specific security group

4. **Note Connection Details**
   ```
   Endpoint: parichay-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
   Port: 3306
   Database: parichay (create after connection)
   ```

### Step 2: Set Up ElastiCache Redis

1. **Navigate to ElastiCache Console**
   - Go to AWS Console → ElastiCache → Create cluster

2. **Configure Redis Cluster**
   ```
   Cluster engine: Redis
   Location: AWS Cloud
   Cluster mode: Disabled
   Name: parichay-redis
   Node type: cache.t3.micro (or cache.t4g.micro)
   Number of replicas: 0 (to stay in free tier)

   Subnet group: Create new
   Security groups: Create new (parichay-redis-sg)
   ```

3. **Configure Security Group**
   - Edit `parichay-redis-sg` inbound rules
   - Add rule: Custom TCP (6379) from your VPC CIDR

4. **Note Connection Details**
   ```
   Primary endpoint: parichay-redis.xxxxxx.0001.use1.cache.amazonaws.com:6379
   ```

### Step 3: Set Up S3 Bucket for File Storage

1. **Create S3 Bucket**
   ```bash
   Bucket name: parichay-uploads-[your-unique-id]
   Region: us-east-1 (or your preferred region)
   Block all public access: Uncheck (we'll configure specific permissions)
   Versioning: DiwedOrigins": ["https://yourdomain.com"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

4. **Create IAM User for S3 Access**
   - Go to IAM → Users → Create user
   - User name: `parichay-s3-user`
   - Attach policy: `AmazonS3FullAccess` (or create custom policy for specific bucket)
   - Create access key → Save Access Key ID and Secret Access Key

### Step 4: Set Up Amazon SES for Email

1. **Navigate to SES Console**
   - Go to AWS Console → Amazon SES

2. **Verify Your Domain**
   - Identities → Create identity → Domain
   - Enter your domain name
   - Add DNS records to your domain registrar

3. **Verify Email Addresses** (for testing)
   - Create identity → Email address
   - Verify the email you'll use for sending

4. **Request Production Access** (if needed)
   - Account dashboard → Request production access
   - Fill out the form explaining your use case

5. **Create SMTP Credentials**
   - Account dashboard → SMTP settings → Create SMTP credentials
   - Save username and password

### Step 5: Deploy with AWS Amplify

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/parichay.git
   git push -u origin main
   ```

2. **Connect to Amplify**
   - Go to AWS Amplify Console
   - New app → Host web app
   - Connect to GitHub
   - Select your repository and branch

3. **Configure Build Settings**

   Amplify will auto-detect Next.js. Update the build settings:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
           - npx prisma generate
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

4. **Add Environment Variables**

   In Amplify Console → App settings → Environment variables:

   ```
   DATABASE_URL=mysql://admin:[password]@parichay-db.xxxxxxxxx.us-east-1.rds.amazonaws.com:3306/parichay

   JWT_SECRET=[generate-strong-secret]
   JWT_REFRESH_SECRET=[generate-strong-secret]

   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com

   REDIS_URL=redis://parichay-redis.xxxxxx.0001.use1.cache.amazonaws.com:6379

   AWS_ACCESS_KEY_ID=[your-s3-user-access-key]
   AWS_SECRET_ACCESS_KEY=[your-s3-user-secret-key]
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=parichay-uploads-[your-unique-id]

   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=[your-ses-smtp-username]
   SMTP_PASS=[your-ses-smtp-password]

   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[your-google-maps-key]

   # Optional - Add if you have these services
   STRIPE_SECRET_KEY=[your-stripe-key]
   STRIPE_PUBLISHABLE_KEY=[your-stripe-public-key]
   TWILIO_ACCOUNT_SID=[your-twilio-sid]
   TWILIO_AUTH_TOKEN=[your-twilio-token]
   TWILIO_PHONE_NUMBER=[your-twilio-number]

   CRON_SECRET=[generate-random-secret]
   NODE_ENV=production
   ```

5. **Deploy**
   - Save and deploy
   - Amplify will build and deploy your app
   - You'll get a URL like: `https://main.xxxxxxxxx.amplifyapp.com`

### Step 6: Set Up Database Schema

1. **Connect to RDS via Bastion or VPC**

   Option A: Use AWS Systems Manager Session Manager (Free)
   - Create an EC2 instance in the same VPC (t2.micro free tier)
   - Install MySQL client
   - Connect to RDS from EC2

   Option B: Temporarily enable public access
   - Enable public access on RDS (not recommended for production)
   - Connect from your local machine
   - Disable public access after setup

2. **Run Migrations**
   ```bash
   # From your local machine or EC2 instance
   export DATABASE_URL="mysql://admin:[password]@parichay-db.xxxxxxxxx.us-east-1.rds.amazonaws.com:3306/parichay"

   # Create database
   mysql -h parichay-db.xxxxxxxxx.us-east-1.rds.amazonaws.com -u admin -p -e "CREATE DATABASE parichay;"

   # Run Prisma migrations
   npx prisma migrate deploy

   # Optional: Seed demo data
   npm run seed:demo
   ```

### Step 7: Configure Custom Domain

1. **In Amplify Console**
   - Domain management → Add domain
   - Enter your domain name
   - Follow DNS configuration instructions

2. **Update DNS Records**

   If using Route 53:
   - Amplify will auto-configure

   If using external DNS:
   - Add CNAME record: `www` → `[amplify-url]`
   - Add CNAME record: `@` → `[amplify-url]` (or use ALIAS if supported)

3. **SSL Certificate**
   - Amplify automatically provisions SSL certificate
   - Wait for DNS propagation (can take up to 48 hours)

### Step 8: Configure VPC Peering (Optional but Recommended)

To allow Amplify to access RDS and ElastiCache:

1. **Create VPC Peering Connection**
   - VPC → Peering Connections → Create
   - Connect Amplify VPC to your RDS/Redis VPC

2. **Update Route Tables**
   - Add routes for cross-VPC communication

3. **Update Security Groups**
   - Allow traffic from Amplify VPC CIDR

## 💰 Cost Optimization Tips

### Stay Within Free Tier

1. **Monitor Usage**
   - Set up AWS Budgets (free)
   - Create alerts for 80% of free tier limits
   - Check AWS Free Tier usage dashboard regularly

2. **RDS Optimization**
   - Use db.t3.micro or db.t4g.micro (750 hours/month free)
   - 20GB storage max (free tier limit)
   - Single-AZ deployment
   - Automated backups: 1 day retention

3. **ElastiCache Optimization**
   - Use cache.t3.micro or cache.t4g.micro
   - No replicas (0 replicas = 1 node = 750 hours free)
   - Single-AZ deployment

4. **S3 Optimization**
   - Use S3 Intelligent-Tiering for automatic cost optimization
   - Set lifecycle policies to delete old files
   - Compress images before upload
   - Use CloudFront (50GB free/month) for CDN

5. **Amplify Optimization**
   - Limit build minutes (1000/month free)
   - Use build caching
   - Disable auto-builds for non-main branches

### Alternative: Ultra-Low-Cost Setup

If you exceed free tier, consider:

1. **Use AWS Lightsail** ($3.50/month)
   - 512MB RAM, 1 vCPU
   - 20GB SSD
   - 1TB transfer
   - Includes MySQL database

2. **Use Vercel** (Free tier)
   - Deploy Next.js app on Vercel
   - Use PlanetScale (Free tier MySQL)
   - Use Upstash (Free tier Redis)
   - Use Vercel Blob (Free tier storage)

## 🔒 Security Best Practices

1. **Enable MFA** on AWS root account
2. **Use IAM roles** instead of access keys where possible
3. **Enable VPC** for RDS and ElastiCache (no public access)
4. **Use AWS Secrets Manager** for sensitive credentials
5. **Enable CloudWatch Logs** for monitoring
6. **Set up AWS WAF** (optional, costs extra)
7. **Regular security audits** using AWS Security Hub

## 📊 Monitoring & Maintenance

1. **CloudWatch Dashboards**
   - Monitor RDS CPU, memory, connections
   - Monitor ElastiCache hit rate
   - Monitor S3 storage usage
   - Monitor Amplify build times

2. **Set Up Alarms**
   ```
   - RDS CPU > 80%
   - RDS Storage > 18GB (90% of free tier)
   - ElastiCache memory > 80%
   - S3 storage > 4.5GB (90% of free tier)
   ```

3. **Backup Strategy**
   - RDS automated backups (1 day retention)
   - Manual snapshots before major changes
   - S3 versioning for critical files

## 🚨 Troubleshooting

### Common Issues

1. **Amplify build fails**
   - Check build logs in Amplify Console
   - Verify environment variables
   - Ensure Prisma generates correctly

2. **Cannot connect to RDS**
   - Check security group rules
   - Verify VPC configuration
   - Ensure database exists

3. **Redis connection timeout**
   - Check security group rules
   - Verify endpoint and port
   - Ensure ElastiCache is in same VPC

4. **S3 upload fails**
   - Verify IAM permissions
   - Check CORS configuration
   - Verify bucket policy

## 📚 Additional Resources

- [AWS Free Tier Details](https://aws.amazon.com/free/)
- [Amplify Documentation](https://docs.amplify.aws/)
- [RDS MySQL Documentation](https://docs.aws.amazon.com/rds/mysql/)
- [ElastiCache Redis Documentation](https://docs.aws.amazon.com/elasticache/redis/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🎉 Next Steps

After deployment:

1. Test all functionality
2. Set up monitoring and alerts
3. Configure backup strategy
4. Implement CI/CD pipeline
5. Set up staging environment
6. Document your specific configuration
7. Train your team on AWS console

---

**Estimated Monthly Cost**: $0 (within free tier limits) to $15-30 (if exceeding free tier)

**Free Tier Duration**: 12 months from AWS account creation (some services like S3 are always free within limits)
