#!/bin/bash

# Production Environment Verification Script
# This script verifies that all required environment variables are properly set

set -e

echo "🔍 Verifying Production Environment Configuration..."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for errors
ERRORS=0
WARNINGS=0

# Function to check if variable is set and not empty
check_var() {
    local var_name=$1
    local var_value="${!var_name}"
    local is_required=${2:-true}

    if [ -z "$var_value" ]; then
        if [ "$is_required" = true ]; then
            echo -e "${RED}✗${NC} $var_name is not set or empty (REQUIRED)"
            ((ERRORS++))
        else
            echo -e "${YELLOW}⚠${NC} $var_name is not set (OPTIONAL)"
            ((WARNINGS++))
        fi
        return 1
    else
        echo -e "${GREEN}✓${NC} $var_name is set"
        return 0
    fi
}

# Function to check if variable contains placeholder values
check_placeholder() {
    local var_name=$1
    local var_value="${!var_name}"

    if [[ "$var_value" == *"EXAMPLE"* ]] || [[ "$var_value" == *"your-"* ]] || [[ "$var_value" == *"..."* ]]; then
        echo -e "${RED}✗${NC} $var_name contains placeholder value: $var_value"
        ((ERRORS++))
        return 1
    fi
    return 0
}

echo "📋 Checking Database Configuration..."
check_var "DATABASE_URL"
check_placeholder "DATABASE_URL"

echo ""
echo "🔐 Checking Authentication Configuration..."
check_var "NEXTAUTH_URL"
check_var "NEXTAUTH_SECRET"
check_var "JWT_SECRET"
check_placeholder "NEXTAUTH_SECRET"
check_placeholder "JWT_SECRET"

echo ""
echo "💳 Checking Payment Gateway Configuration..."
check_var "STRIPE_PUBLIC_KEY"
check_var "STRIPE_SECRET_KEY"
check_var "STRIPE_WEBHOOK_SECRET"
check_var "RAZORPAY_KEY_ID"
check_var "RAZORPAY_KEY_SECRET"
check_var "RAZORPAY_WEBHOOK_SECRET"

# Verify production keys
if [[ "$STRIPE_SECRET_KEY" == sk_test_* ]]; then
    echo -e "${RED}✗${NC} STRIPE_SECRET_KEY is using TEST key, not PRODUCTION"
    ((ERRORS++))
fi

if [[ "$RAZORPAY_KEY_ID" == rzp_test_* ]]; then
    echo -e "${RED}✗${NC} RAZORPAY_KEY_ID is using TEST key, not PRODUCTION"
    ((ERRORS++))
fi

echo ""
echo "📧 Checking Email Service Configuration..."
check_var "SMTP_HOST"
check_var "SMTP_PORT"
check_var "SMTP_USER"
check_var "SMTP_PASS"
check_var "SMTP_FROM"
check_placeholder "SMTP_PASS"

echo ""
echo "📱 Checking SMS Service Configuration..."
check_var "SMS_API_KEY" false
check_var "SMS_API_SECRET" false

echo ""
echo "☁️ Checking AWS S3 Configuration..."
check_var "AWS_ACCESS_KEY_ID"
check_var "AWS_SECRET_ACCESS_KEY"
check_var "AWS_REGION"
check_var "AWS_S3_BUCKET"
check_var "AWS_CLOUDFRONT_DOMAIN" false
check_placeholder "AWS_ACCESS_KEY_ID"
check_placeholder "AWS_SECRET_ACCESS_KEY"

echo ""
echo "🔴 Checking Redis Configuration..."
check_var "REDIS_URL"
check_placeholder "REDIS_URL"

echo ""
echo "🐛 Checking Sentry Configuration..."
check_var "SENTRY_DSN"
check_var "SENTRY_ENVIRONMENT"
check_placeholder "SENTRY_DSN"

echo ""
echo "🌐 Checking Application Configuration..."
check_var "NODE_ENV"
check_var "APP_URL"

if [ "$NODE_ENV" != "production" ]; then
    echo -e "${RED}✗${NC} NODE_ENV is not set to 'production'"
    ((ERRORS++))
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All required environment variables are properly configured!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS optional variables are not set${NC}"
    fi
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS error(s) in environment configuration${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ Found $WARNINGS warning(s)${NC}"
    fi
    echo ""
    echo "Please fix the errors before deploying to production."
    exit 1
fi
