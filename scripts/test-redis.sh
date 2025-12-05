#!/bin/bash

# Redis Connection Test Script

set -e

echo "🔴 Testing Redis Connection..."
echo ""

# Load environment variables
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ No environment file found"
    exit 1
fi

if [ -z "$REDIS_URL" ]; then
    echo "❌ REDIS_URL is not set"
    exit 1
fi

echo "Testing connection to: $REDIS_URL"
echo ""

# Test basic connection
echo "1. Testing PING command..."
if redis-cli -u "$REDIS_URL" ping > /dev/null 2>&1; then
    echo "✅ PING successful"
else
    echo "❌ PING failed"
    exit 1
fi

# Test SET command
echo "2. Testing SET command..."
if redis-cli -u "$REDIS_URL" SET test_key "test_value" > /dev/null 2>&1; then
    echo "✅ SET successful"
else
    echo "❌ SET failed"
    exit 1
fi

# Test GET command
echo "3. Testing GET command..."
VALUE=$(redis-cli -u "$REDIS_URL" GET test_key)
if [ "$VALUE" = "test_value" ]; then
    echo "✅ GET successful (value: $VALUE)"
else
    echo "❌ GET failed"
    exit 1
fi

# Test DEL command
echo "4. Testing DEL command..."
if redis-cli -u "$REDIS_URL" DEL test_key > /dev/null 2>&1; then
    echo "✅ DEL successful"
else
    echo "❌ DEL failed"
    exit 1
fi

# Get Redis info
echo ""
echo "5. Redis Server Information:"
redis-cli -u "$REDIS_URL" INFO server | grep -E "redis_version|os|tcp_port"

echo ""
echo "✅ All Redis tests passed successfully!"
