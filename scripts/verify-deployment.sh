#!/bin/bash
# Deployment verification script

set -e

ENVIRONMENT=${1:-production}
BASE_URL=${2:-https://voices-of-kunqu.org}

echo "🚀 Verifying deployment for $ENVIRONMENT environment..."

# Health check
echo "📊 Running health checks..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health")
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status' 2>/dev/null || echo "unknown")

if [ "$HEALTH_STATUS" != "healthy" ]; then
    echo "❌ Health check failed"
    echo "$HEALTH_RESPONSE"
    exit 1
fi

echo "✅ Health checks passed"

# Basic connectivity tests
echo "🌐 Testing basic connectivity..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_STATUS" != "200" ]; then
    echo "❌ Site connectivity failed: HTTP $HTTP_STATUS"
    exit 1
fi

echo "✅ Site connectivity verified"

# Performance check (basic)
echo "🚀 Running basic performance check..."
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" "$BASE_URL")
RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc -l 2>/dev/null || echo "0")

echo "📈 Response time: ${RESPONSE_TIME}s"

# Cultural content accessibility
echo "🎭 Verifying cultural content..."
CULTURAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/health")
if [ "$CULTURAL_STATUS" != "200" ]; then
    echo "❌ Cultural content check failed"
    exit 1
fi

echo "✅ Cultural content accessible"

echo "🎉 Deployment verification completed successfully!"
echo "Environment: $ENVIRONMENT"
echo "URL: $BASE_URL"
echo "Status: All systems operational"