#!/bin/bash

# Production Setup Script
# This script helps set up the production environment

set -e

echo "🚀 OneTouch BizCard Production Setup"
echo "====================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if .env.production exists
if [ -f ".env.production" ]; then
    echo -e "${YELLOW}⚠ .env.production already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting without changes."
        exit 0
    fi
fi

# Copy template
echo -e "${BLUE}📋 Copying .env.production.example to .env.production...${NC}"
cp .env.production.example .env.production

echo ""
echo -e "${GREEN}✓ Created .env.production file${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env.production and fill in all the production values"
echo "2. Generate strong secrets using: openssl rand -base64 32"
echo "3. Configure production API keys for Stripe and Razorpay"
echo "4. Set up AWS S3 bucket and CloudFront distribution"
echo "5. Configure production Redis instance"
echo "6. Set up Sentry project and get DSN"
echo "7. Configure SMTP service (SendGrid, AWS SES, etc.)"
echo "8. Run './scripts/verify-env.sh' to verify configuration"
echo ""
echo -e "${YELLOW}⚠ IMPORTANT: Never commit .env.production to version control!${NC}"
