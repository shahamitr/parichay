#!/bin/bash

# Monitoring Integration Test Script

set -e

echo "📊 Testing Monitoring Integrations..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Load environment variables
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ No environment file found${NC}"
    exit 1
fi

ERRORS=0

# Test 1: Sentry Integration
echo "1️⃣ Testing Sentry Error Tracking..."
if [ -z "$SENTRY_DSN" ]; then
    echo -e "${RED}✗ SENTRY_DSN is not configured${NC}"
    ((ERRORS++))
else
    echo "   Sentry DSN: ${SENTRY_DSN:0:30}..."

    # Test Sentry by sending a test event
    curl -X POST "$SENTRY_DSN" \
        -H "Content-Type: application/json" \
        -d '{
            "message": "Test event from monitoring script",
            "level": "info",
            "environment": "'"$SENTRY_ENVIRONMENT"'"
        }' > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Sentry connection successful${NC}"
    else
        echo -e "${YELLOW}⚠ Sentry test event may have failed (check Sentry dashboard)${NC}"
    fi
fi

echo ""

# Test 2: Slack Webhook
echo "2️⃣ Testing Slack Webhook..."
if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo -e "${YELLOW}⚠ SLACK_WEBHOOK_URL is not configured (optional)${NC}"
else
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d '{
            "text": "🧪 Test notification from OneTouch BizCard monitoring script",
            "username": "Monitoring Bot",
            "icon_emoji": ":robot_face:"
        }' > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Slack webhook test successful${NC}"
        echo "   Check your Slack channel for the test message"
    else
        echo -e "${RED}✗ Slack webhook test failed${NC}"
        ((ERRORS++))
    fi
fi

echo ""

# Test 3: Email Alerting
echo "3️⃣ Testing Email Configuration..."
if [ -z "$SMTP_HOST" ] || [ -z "$SMTP_USER" ]; then
    echo -e "${RED}✗ SMTP configuration is incomplete${NC}"
    ((ERRORS++))
else
    echo "   SMTP Host: $SMTP_HOST"
    echo "   SMTP Port: $SMTP_PORT"
    echo "   SMTP User: $SMTP_USER"
    echo -e "${GREEN}✓ SMTP configuration present${NC}"
    echo "   Run email test separately with: npm run test:email"
fi

echo ""

# Test 4: Database Monitoring
echo "4️⃣ Testing Database Connection..."
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}✗ DATABASE_URL is not configured${NC}"
    ((ERRORS++))
else
    # Test database connection
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Database connection successful${NC}"

            # Check for slow queries
            echo "   Checking for slow queries..."
            SLOW_QUERIES=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM pg_stat_statements WHERE mean_exec_time > 1000;" 2>/dev/null || echo "0")
            if [ "$SLOW_QUERIES" -gt 0 ]; then
                echo -e "${YELLOW}⚠ Found $SLOW_QUERIES slow queries (>1s)${NC}"
            else
                echo -e "${GREEN}✓ No slow queries detected${NC}"
            fi
        else
            echo -e "${RED}✗ Database connection failed${NC}"
            ((ERRORS++))
        fi
    else
        echo -e "${YELLOW}⚠ psql not installed, skipping database test${NC}"
    fi
fi

echo ""

# Test 5: Application Health Check
echo "5️⃣ Testing Application Health Endpoint..."
if [ -z "$APP_URL" ]; then
    echo -e "${YELLOW}⚠ APP_URL is not configured${NC}"
else
    HEALTH_URL="$APP_URL/api/health"
    echo "   Testing: $HEALTH_URL"

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Health endpoint responding (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${YELLOW}⚠ Health endpoint returned HTTP $HTTP_CODE${NC}"
    fi
fi

echo ""

# Test 6: Redis Monitoring
echo "6️⃣ Testing Redis Connection..."
if [ -z "$REDIS_URL" ]; then
    echo -e "${RED}✗ REDIS_URL is not configured${NC}"
    ((ERRORS++))
else
    if command -v redis-cli &> /dev/null; then
        if redis-cli -u "$REDIS_URL" ping > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Redis connection successful${NC}"

            # Get Redis info
            REDIS_VERSION=$(redis-cli -u "$REDIS_URL" INFO server | grep redis_version | cut -d: -f2 | tr -d '\r')
            REDIS_MEMORY=$(redis-cli -u "$REDIS_URL" INFO memory | grep used_memory_human | cut -d: -f2 | tr -d '\r')
            echo "   Redis version: $REDIS_VERSION"
            echo "   Memory usage: $REDIS_MEMORY"
        else
            echo -e "${RED}✗ Redis connection failed${NC}"
            ((ERRORS++))
        fi
    else
        echo -e "${YELLOW}⚠ redis-cli not installed, skipping Redis test${NC}"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All monitoring tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Check Sentry dashboard for test event"
    echo "2. Check Slack channel for test message"
    echo "3. Set up UptimeRobot/Pingdom for uptime monitoring"
    echo "4. Configure alert thresholds in monitoring services"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s) in monitoring configuration${NC}"
    echo ""
    echo "Please fix the errors before proceeding."
    exit 1
fi
