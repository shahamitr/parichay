#!/bin/bash

# Security Audit Script
# This script performs basic security checks on the application

set -e

echo "🔒 Security Audit Script"
echo "========================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check 1: HTTPS Enforcement
echo "1️⃣ Checking HTTPS Enforcement..."
if [ ! -z "$APP_URL" ]; then
    if [[ "$APP_URL" == https://* ]]; then
        echo -e "${GREEN}✓ APP_URL uses HTTPS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ APP_URL does not use HTTPS${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}⚠ APP_URL not set${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 2: Environment Variables Security
echo "2️⃣ Checking Environment Variables..."

# Check for strong secrets
if [ ! -z "$JWT_SECRET" ]; then
    JWT_LENGTH=${#JWT_SECRET}
    if [ $JWT_LENGTH -ge 32 ]; then
        echo -e "${GREEN}✓ JWT_SECRET is sufficiently long ($JWT_LENGTH chars)${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ JWT_SECRET is too short ($JWT_LENGTH chars, minimum 32)${NC}"
        ((ERRORS++))
    fi
fi

if [ ! -z "$NEXTAUTH_SECRET" ]; then
    AUTH_LENGTH=${#NEXTAUTH_SECRET}
    if [ $AUTH_LENGTH -ge 32 ]; then
        echo -e "${GREEN}✓ NEXTAUTH_SECRET is sufficiently long ($AUTH_LENGTH chars)${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ NEXTAUTH_SECRET is too short ($AUTH_LENGTH chars, minimum 32)${NC}"
        ((ERRORS++))
    fi
fi

# Check for production keys
if [[ "$STRIPE_SECRET_KEY" == sk_live_* ]]; then
    echo -e "${GREEN}✓ Using Stripe production keys${NC}"
    ((PASSED++))
elif [[ "$STRIPE_SECRET_KEY" == sk_test_* ]]; then
    echo -e "${YELLOW}⚠ Using Stripe test keys (not production)${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 3: Database Security
echo "3️⃣ Checking Database Security..."

if [[ "$DATABASE_URL" == *"sslmode=require"* ]]; then
    echo -e "${GREEN}✓ Database SSL is required${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Database SSL is not enforced${NC}"
    ((ERRORS++))
fi

if [[ "$DATABASE_URL" == *"localhost"* ]] && [ "$NODE_ENV" = "production" ]; then
    echo -e "${YELLOW}⚠ Database is on localhost in production${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 4: Redis Security
echo "4️⃣ Checking Redis Security..."

if [[ "$REDIS_URL" == *"password"* ]] || [[ "$REDIS_URL" == *":"*"@"* ]]; then
    echo -e "${GREEN}✓ Redis has password authentication${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Redis does not have password authentication${NC}"
    ((ERRORS++))
fi

if [ "$REDIS_TLS_ENABLED" = "true" ]; then
    echo -e "${GREEN}✓ Redis TLS is enabled${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Redis TLS is not enabled${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 5: Cookie Security
echo "5️⃣ Checking Cookie Security..."

if [ "$COOKIE_SECURE" = "true" ]; then
    echo -e "${GREEN}✓ Secure cookies are enabled${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Secure cookies are not enabled${NC}"
    ((ERRORS++))
fi

if [ "$COOKIE_SAME_SITE" = "strict" ] || [ "$COOKIE_SAME_SITE" = "lax" ]; then
    echo -e "${GREEN}✓ SameSite cookie policy is set${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ SameSite cookie policy not set${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 6: CORS Configuration
echo "6️⃣ Checking CORS Configuration..."

if [ ! -z "$CORS_ORIGIN" ]; then
    if [ "$CORS_ORIGIN" = "*" ]; then
        echo -e "${RED}✗ CORS allows all origins (security risk)${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✓ CORS is properly configured${NC}"
        ((PASSED++))
    fi
else
    echo -e "${YELLOW}⚠ CORS_ORIGIN not set${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 7: Rate Limiting
echo "7️⃣ Checking Rate Limiting Configuration..."

if [ ! -z "$RATE_LIMIT_MAX_REQUESTS" ]; then
    echo -e "${GREEN}✓ Rate limiting is configured${NC}"
    echo "  Max requests: $RATE_LIMIT_MAX_REQUESTS"
    echo "  Window: $RATE_LIMIT_WINDOW_MS ms"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Rate limiting not configured${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 8: Dependency Vulnerabilities
echo "8️⃣ Checking for Dependency Vulnerabilities..."

if command -v npm &> /dev/null; then
    echo "Running npm audit..."
    AUDIT_OUTPUT=$(npm audit --json 2>/dev/null || echo '{"error": true}')

    if echo "$AUDIT_OUTPUT" | grep -q '"error": true'; then
        echo -e "${YELLOW}⚠ Could not run npm audit${NC}"
        ((WARNINGS++))
    else
        CRITICAL=$(echo "$AUDIT_OUTPUT" | grep -o '"critical":[0-9]*' | cut -d: -f2 || echo "0")
        HIGH=$(echo "$AUDIT_OUTPUT" | grep -o '"high":[0-9]*' | cut -d: -f2 || echo "0")

        if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
            echo -e "${RED}✗ Found $CRITICAL critical and $HIGH high severity vulnerabilities${NC}"
            echo "  Run 'npm audit fix' to resolve"
            ((ERRORS++))
        else
            echo -e "${GREEN}✓ No critical or high severity vulnerabilities found${NC}"
            ((PASSED++))
        fi
    fi
fi

echo ""

# Check 9: File Permissions
echo "9️⃣ Checking File Permissions..."

if [ -f ".env.production" ]; then
    PERMS=$(stat -f "%A" .env.production 2>/dev/null || stat -c "%a" .env.production 2>/dev/null)

    if [ "$PERMS" = "600" ] || [ "$PERMS" = "400" ]; then
        echo -e "${GREEN}✓ .env.production has secure permissions ($PERMS)${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ .env.production permissions are $PERMS (should be 600 or 400)${NC}"
        ((WARNINGS++))
    fi
fi

echo ""

# Check 10: Sentry Configuration
echo "🔟 Checking Error Tracking..."

if [ ! -z "$SENTRY_DSN" ]; then
    echo -e "${GREEN}✓ Sentry is configured${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Sentry is not configured${NC}"
    ((WARNINGS++))
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Summary
TOTAL=$((PASSED + ERRORS + WARNINGS))
echo "Security Audit Summary:"
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo -e "${RED}✗ Errors: $ERRORS${NC}"
echo "Total checks: $TOTAL"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Security audit passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ Please review warnings${NC}"
    fi
    exit 0
else
    echo -e "${RED}❌ Security audit failed with $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix the errors before deploying to production."
    exit 1
fi
