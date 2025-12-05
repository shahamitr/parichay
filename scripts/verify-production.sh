#!/bin/bash

# Production Verification Script
# This script performs comprehensive checks before launch

set -e

echo "🚀 Production Verification Script"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0
PASSED=0

# Load environment variables
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ No environment file found${NC}"
    exit 1
fi

echo -e "${BLUE}Running comprehensive production checks...${NC}"
echo ""

# Section 1: Environment Configuration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Environment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./scripts/verify-env.sh
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Environment configuration verified${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Environment configuration failed${NC}"
    ((ERRORS++))
fi

echo ""

# Section 2: Database Connectivity
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Database Connectivity"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./scripts/test-database.sh > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database connection verified${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Database connection failed${NC}"
    ((ERRORS++))
fi

echo ""

# Section 3: Redis Connectivity
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Redis Connectivity"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./scripts/test-redis.sh > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Redis connection verified${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Redis connection failed${NC}"
    ((ERRORS++))
fi

echo ""

# Section 4: Application Health
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Application Health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -z "$APP_URL" ]; then
    # Test main health endpoint
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/health" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Application health endpoint responding${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Application health endpoint failed (HTTP $HTTP_CODE)${NC}"
        ((ERRORS++))
    fi

    # Test homepage
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Homepage responding${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Homepage failed (HTTP $HTTP_CODE)${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}⚠ APP_URL not set, skipping application tests${NC}"
    ((WARNINGS++))
fi

echo ""

# Section 5: Third-Party Integrations
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Third-Party Integrations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test S3 connectivity
if [ ! -z "$AWS_S3_BUCKET" ]; then
    if aws s3 ls "s3://$AWS_S3_BUCKET" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ S3 bucket accessible${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ S3 bucket not accessible${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}⚠ AWS_S3_BUCKET not configured${NC}"
    ((WARNINGS++))
fi

# Test Stripe connectivity
if [ ! -z "$STRIPE_SECRET_KEY" ]; then
    STRIPE_TEST=$(curl -s -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/balance 2>/dev/null)

    if echo "$STRIPE_TEST" | grep -q "object"; then
        echo -e "${GREEN}✓ Stripe API accessible${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Stripe API not accessible${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}⚠ STRIPE_SECRET_KEY not configured${NC}"
    ((WARNINGS++))
fi

# Test Sentry connectivity
if [ ! -z "$SENTRY_DSN" ]; then
    echo -e "${GREEN}✓ Sentry DSN configured${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Sentry not configured${NC}"
    ((WARNINGS++))
fi

echo ""

# Section 6: Security Checks
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Security Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./scripts/security-audit.sh > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Security audit passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Security audit failed${NC}"
    ((ERRORS++))
fi

echo ""

# Section 7: Backup Systems
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Backup Systems"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./scripts/verify-backups.sh > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup systems verified${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Backup verification had warnings${NC}"
    ((WARNINGS++))
fi

echo ""

# Section 8: Monitoring Systems
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. Monitoring Systems"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./scripts/test-monitoring.sh > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Monitoring systems verified${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Monitoring verification had warnings${NC}"
    ((WARNINGS++))
fi

echo ""

# Section 9: Performance Checks
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "9. Performance Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -z "$APP_URL" ]; then
    # Measure response time
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' "$APP_URL/" 2>/dev/null || echo "999")
    RESPONSE_MS=$(echo "$RESPONSE_TIME * 1000" | bc)

    if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
        echo -e "${GREEN}✓ Homepage response time: ${RESPONSE_MS}ms${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ Homepage response time: ${RESPONSE_MS}ms (slow)${NC}"
        ((WARNINGS++))
    fi
fi

echo ""

# Section 10: Build and Deployment
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "10. Build and Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if build exists
if [ -d ".next" ]; then
    echo -e "${GREEN}✓ Production build exists${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Production build not found${NC}"
    ((WARNINGS++))
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# Check if PM2 is running (if applicable)
if command -v pm2 &> /dev/null; then
    PM2_STATUS=$(pm2 list | grep -c "online" || echo "0")
    if [ "$PM2_STATUS" -gt 0 ]; then
        echo -e "${GREEN}✓ PM2 processes running: $PM2_STATUS${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ No PM2 processes running${NC}"
        ((WARNINGS++))
    fi
fi

echo ""

# Final Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL=$((PASSED + ERRORS + WARNINGS))
PASS_RATE=$(echo "scale=1; $PASSED * 100 / $TOTAL" | bc)

echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo -e "${RED}✗ Errors: $ERRORS${NC}"
echo "Total checks: $TOTAL"
echo "Pass rate: ${PASS_RATE}%"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Production verification passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ Please review $WARNINGS warning(s) before launch${NC}"
    else
        echo -e "${GREEN}🎉 System is ready for production launch!${NC}"
    fi
    exit 0
else
    echo -e "${RED}❌ Production verification failed with $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix all errors before launching to production."
    exit 1
fi
