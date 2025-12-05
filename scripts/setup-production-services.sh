#!/bin/bash

# Production Services Setup Script
# This script helps configure production services for OneTouch BizCard

set -e

echo "=========================================="
echo "OneTouch BizCard Production Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${NC}ℹ $1${NC}"
}

# Check if .env.production exists
if [ -f ".env.production" ]; then
    print_warning ".env.production already exists. Backup will be created."
    cp .env.production .env.production.backup.$(date +%Y%m%d_%H%M%S)
    print_success "Backup created"
fi

# Copy template
if [ ! -f ".env.production" ]; then
    cp .env.production.example .env.production
    print_success "Created .env.production from template"
fi

echo ""
echo "=========================================="
echo "1. Database Configuration"
echo "=========================================="
echo ""

print_info "PostgreSQL Production Setup"
echo "Choose your database provider:"
echo "1) AWS RDS"
echo "2) DigitalOcean Managed Database"
echo "3) Heroku Postgres"
echo "4) Other/Manual"
read -p "Enter choice [1-4]: " db_choice

case $db_choice in
    1)
        print_info "AWS RDS selected"
        echo "Create RDS instance with:"
        echo "  - Instance class: db.t3.medium or higher"
        echo "  - Engine: PostgreSQL 15.4+"
        echo "  - Storage: 100GB+ with encryption"
        echo "  - Multi-AZ: Enabled"
        echo "  - Backup retention: 30 days"
        ;;
    2)
        print_info "DigitalOcean selected"
        echo "Create managed database with:"
        echo "  - Plan: Production (4GB+ RAM)"
        echo "  - PostgreSQL version: 15+"
        echo "  - Enable automatic backups"
        ;;
    3)
        print_info "Heroku Postgres selected"
        echo "Provision Heroku Postgres:"
        echo "  heroku addons:create heroku-postgresql:standard-0"
        ;;
    4)
        print_info "Manual setup selected"
        ;;
esac

read -p "Enter DATABASE_URL (with SSL): " database_url
if [ ! -z "$database_url" ]; then
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$database_url\"|g" .env.production
    print_success "Database URL configured"
fi

echo ""
echo "=========================================="
echo "2. Redis Configuration"
echo "=========================================="
echo ""

print_info "Redis Production Setup"
echo "Choose your Redis provider:"
echo "1) AWS ElastiCache"
echo "2) Redis Cloud"
echo "3) DigitalOcean Managed Redis"
echo "4) Other/Manual"
read -p "Enter choice [1-4]: " redis_choice

case $redis_choice in
    1)
        print_info "AWS ElastiCache selected"
        echo "Create ElastiCache cluster with:"
        echo "  - Node type: cache.t3.medium or higher"
        echo "  - Engine: Redis 7.0+"
        echo "  - Transit encryption: Enabled"
        echo "  - Snapshot retention: 7 days"
        ;;
    2)
        print_info "Redis Cloud selected"
        echo "Create Redis Cloud database:"
        echo "  - Plan: 1GB+ with persistence"
        echo "  - TLS: Enabled"
        ;;
    3)
        print_info "DigitalOcean selected"
        echo "Create managed Redis:"
        echo "  - Plan: Production (1GB+ RAM)"
        echo "  - Enable eviction policy: allkeys-lru"
        ;;
    4)
        print_info "Manual setup selected"
        ;;
esac

read -p "Enter REDIS_URL (with TLS): " redis_url
if [ ! -z "$redis_url" ]; then
    sed -i.bak "s|REDIS_URL=.*|REDIS_URL=\"$redis_url\"|g" .env.production
    print_success "Redis URL configured"
fi

echo ""
echo "=========================================="
echo "3. AWS S3 and CloudFront Setup"
echo "=========================================="
echo ""

print_info "AWS S3 Configuration"
read -p "Enter AWS Access Key ID: " aws_access_key
read -p "Enter AWS Secret Access Key: " aws_secret_key
read -p "Enter AWS Region (e.g., ap-south-1): " aws_region
read -p "Enter S3 Bucket Name: " s3_bucket
read -p "Enter CloudFront Domain (optional): " cloudfront_domain

if [ ! -z "$aws_access_key" ]; then
    sed -i.bak "s|AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=\"$aws_access_key\"|g" .env.production
    sed -i.bak "s|AWS_SECRET_ACCESS_KEY=.*|AWS_SECRET_ACCESS_KEY=\"$aws_secret_key\"|g" .env.production
    sed -i.bak "s|AWS_REGION=.*|AWS_REGION=\"$aws_region\"|g" .env.production
    sed -i.bak "s|AWS_S3_BUCKET=.*|AWS_S3_BUCKET=\"$s3_bucket\"|g" .env.production
    if [ ! -z "$cloudfront_domain" ]; then
        sed -i.bak "s|AWS_CLOUDFRONT_DOMAIN=.*|AWS_CLOUDFRONT_DOMAIN=\"$cloudfront_domain\"|g" .env.production
    fi
    print_success "AWS configuration saved"
fi

echo ""
echo "=========================================="
echo "4. Payment Gateway Configuration"
echo "=========================================="
echo ""

print_info "Stripe Configuration"
read -p "Enter Stripe Publishable Key (pk_live_...): " stripe_public
read -p "Enter Stripe Secret Key (sk_live_...): " stripe_secret
read -p "Enter Stripe Webhook Secret (whsec_...): " stripe_webhook

if [ ! -z "$stripe_public" ]; then
    sed -i.bak "s|STRIPE_PUBLIC_KEY=.*|STRIPE_PUBLIC_KEY=\"$stripe_public\"|g" .env.production
    sed -i.bak "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=\"$stripe_secret\"|g" .env.production
    sed -i.bak "s|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=\"$stripe_webhook\"|g" .env.production
    print_success "Stripe configuration saved"
fi

echo ""
print_info "Razorpay Configuration"
read -p "Enter Razorpay Key ID (rzp_live_...): " razorpay_key
read -p "Enter Razorpay Key Secret: " razorpay_secret
read -p "Enter Razorpay Webhook Secret: " razorpay_webhook

if [ ! -z "$razorpay_key" ]; then
    sed -i.bak "s|RAZORPAY_KEY_ID=.*|RAZORPAY_KEY_ID=\"$razorpay_key\"|g" .env.production
    sed -i.bak "s|RAZORPAY_KEY_SECRET=.*|RAZORPAY_KEY_SECRET=\"$razorpay_secret\"|g" .env.production
    sed -i.bak "s|RAZORPAY_WEBHOOK_SECRET=.*|RAZORPAY_WEBHOOK_SECRET=\"$razorpay_webhook\"|g" .env.production
    print_success "Razorpay configuration saved"
fi

echo ""
echo "=========================================="
echo "5. Email Service Configuration"
echo "=========================================="
echo ""

print_info "Email Service Setup"
echo "Choose your email provider:"
echo "1) SendGrid"
echo "2) AWS SES"
echo "3) Other SMTP"
read -p "Enter choice [1-3]: " email_choice

case $email_choice in
    1)
        print_info "SendGrid selected"
        read -p "Enter SendGrid API Key (SG....): " sendgrid_key
        if [ ! -z "$sendgrid_key" ]; then
            sed -i.bak "s|SMTP_HOST=.*|SMTP_HOST=\"smtp.sendgrid.net\"|g" .env.production
            sed -i.bak "s|SMTP_PORT=.*|SMTP_PORT=\"587\"|g" .env.production
            sed -i.bak "s|SMTP_USER=.*|SMTP_USER=\"apikey\"|g" .env.production
            sed -i.bak "s|SMTP_PASS=.*|SMTP_PASS=\"$sendgrid_key\"|g" .env.production
            print_success "SendGrid configuration saved"
        fi
        ;;
    2)
        print_info "AWS SES selected"
        read -p "Enter SES SMTP Username: " ses_user
        read -p "Enter SES SMTP Password: " ses_pass
        read -p "Enter SES Region (e.g., ap-south-1): " ses_region
        if [ ! -z "$ses_user" ]; then
            sed -i.bak "s|SMTP_HOST=.*|SMTP_HOST=\"email-smtp.$ses_region.amazonaws.com\"|g" .env.production
            sed -i.bak "s|SMTP_PORT=.*|SMTP_PORT=\"587\"|g" .env.production
            sed -i.bak "s|SMTP_USER=.*|SMTP_USER=\"$ses_user\"|g" .env.production
            sed -i.bak "s|SMTP_PASS=.*|SMTP_PASS=\"$ses_pass\"|g" .env.production
            print_success "AWS SES configuration saved"
        fi
        ;;
    3)
        print_info "Custom SMTP selected"
        read -p "Enter SMTP Host: " smtp_host
        read -p "Enter SMTP Port: " smtp_port
        read -p "Enter SMTP Username: " smtp_user
        read -p "Enter SMTP Password: " smtp_pass
        if [ ! -z "$smtp_host" ]; then
            sed -i.bak "s|SMTP_HOST=.*|SMTP_HOST=\"$smtp_host\"|g" .env.production
            sed -i.bak "s|SMTP_PORT=.*|SMTP_PORT=\"$smtp_port\"|g" .env.production
            sed -i.bak "s|SMTP_USER=.*|SMTP_USER=\"$smtp_user\"|g" .env.production
            sed -i.bak "s|SMTP_PASS=.*|SMTP_PASS=\"$smtp_pass\"|g" .env.production
            print_success "SMTP configuration saved"
        fi
        ;;
esac

read -p "Enter sender email address (e.g., noreply@onetouchbizcard.in): " smtp_from
if [ ! -z "$smtp_from" ]; then
    sed -i.bak "s|SMTP_FROM=.*|SMTP_FROM=\"$smtp_from\"|g" .env.production
fi

echo ""
echo "=========================================="
echo "6. Sentry Error Tracking"
echo "=========================================="
echo ""

print_info "Sentry Configuration"
read -p "Enter Sentry DSN: " sentry_dsn
if [ ! -z "$sentry_dsn" ]; then
    sed -i.bak "s|SENTRY_DSN=.*|SENTRY_DSN=\"$sentry_dsn\"|g" .env.production
    sed -i.bak "s|SENTRY_ENVIRONMENT=.*|SENTRY_ENVIRONMENT=\"production\"|g" .env.production
    print_success "Sentry configuration saved"
fi

echo ""
echo "=========================================="
echo "7. Generate Secure Secrets"
echo "=========================================="
echo ""

print_info "Generating secure secrets..."

# Generate NEXTAUTH_SECRET
nextauth_secret=$(openssl rand -base64 32)
sed -i.bak "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$nextauth_secret\"|g" .env.production
print_success "NEXTAUTH_SECRET generated"

# Generate JWT_SECRET
jwt_secret=$(openssl rand -base64 32)
sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=\"$jwt_secret\"|g" .env.production
print_success "JWT_SECRET generated"

echo ""
echo "=========================================="
echo "8. Application Configuration"
echo "=========================================="
echo ""

read -p "Enter production domain (e.g., https://onetouchbizcard.in): " app_url
if [ ! -z "$app_url" ]; then
    sed -i.bak "s|APP_URL=.*|APP_URL=\"$app_url\"|g" .env.production
    sed -i.bak "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=\"$app_url\"|g" .env.production
    print_success "Application URL configured"
fi

# Set NODE_ENV to production
sed -i.bak "s|NODE_ENV=.*|NODE_ENV=\"production\"|g" .env.production
print_success "NODE_ENV set to production"

# Clean up backup files
rm -f .env.production.bak

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
print_success "Production environment configuration saved to .env.production"
echo ""
print_warning "IMPORTANT: Review .env.production and ensure all values are correct"
print_warning "SECURITY: Never commit .env.production to version control"
echo ""
print_info "Next steps:"
echo "  1. Review the configuration: cat .env.production"
echo "  2. Verify all services are accessible"
echo "  3. Run verification tests: ./scripts/verify-env.sh"
echo "  4. Refer to docs/PRODUCTION_SETUP_GUIDE.md for detailed instructions"
echo ""
