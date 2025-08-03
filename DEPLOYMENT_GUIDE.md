# Production Deployment Guide: Voices of Kunqu

**Project:** Voices of Kunqu Cultural Educational Platform  
**Deployment Type:** Production-Ready Infrastructure  
**Target Environment:** Vercel + AWS + PostgreSQL  
**Date:** 2025-08-03  
**DevOps Engineer:** Icarus (zhehongl91@gmail.com)

---

## Executive Summary

This deployment guide provides comprehensive instructions for deploying the Voices of Kunqu cultural educational platform to production. The infrastructure is designed for high availability, cultural content integrity, and cost-effective scaling for a non-profit organization.

**Infrastructure Overview:**
- **Frontend:** Vercel (Next.js 14 with global CDN)
- **Database:** PostgreSQL (AWS RDS or Supabase)
- **Cache:** Redis (AWS ElastiCache or Upstash)
- **Storage:** AWS S3 + CloudFront CDN
- **External APIs:** OpenAI TTS, Authentication providers
- **Monitoring:** Vercel Analytics + Sentry + Uptime monitoring

---

## Prerequisites and Requirements

### Development Environment Setup
```bash
# Required software versions
Node.js >= 20.0.0
npm >= 10.0.0
Git >= 2.34.0
Docker >= 20.10.0 (for local database)
PostgreSQL >= 15.0
Redis >= 7.0
```

### Required API Keys and Accounts
1. **Vercel Account:** Pro tier recommended for production
2. **OpenAI API Key:** With TTS access and billing configured
3. **AWS Account:** For S3, RDS, ElastiCache (or alternatives)
4. **Email Service:** SendGrid, Mailgun, or Resend
5. **Error Tracking:** Sentry account
6. **Domain:** Custom domain for production

### Infrastructure Cost Estimation (Monthly)
```
Vercel Pro:              $20/month
AWS RDS (db.t3.micro):   $15/month
AWS ElastiCache:         $10/month
AWS S3 + CloudFront:     $5-20/month (based on usage)
OpenAI TTS API:          $50-200/month (based on usage)
Domain + SSL:            $15/year
Total Estimated:         $100-265/month
```

---

## Infrastructure Setup Instructions

### 1. Cloud Platform Configuration

#### Vercel Setup (Primary Hosting)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link

# Configure project settings
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
vercel env add OPENAI_API_KEY production
vercel env add NEXTAUTH_SECRET production
vercel env add AWS_ACCESS_KEY_ID production
vercel env add AWS_SECRET_ACCESS_KEY production
vercel env add AWS_REGION production
vercel env add AWS_S3_BUCKET production
```

#### AWS Infrastructure Setup
```yaml
# AWS CloudFormation Template (infrastructure.yml)
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Voices of Kunqu Production Infrastructure'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues: [staging, production]

Resources:
  # PostgreSQL Database
  VoicesDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: !Sub "${Environment}-voices-kunqu-db"
      DBInstanceClass: db.t3.micro
      Engine: postgres
      EngineVersion: 15.3
      MasterUsername: voicesadmin
      MasterUserPassword: !Ref DatabasePassword
      AllocatedStorage: 20
      StorageType: gp2
      StorageEncrypted: true
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup
      BackupRetentionPeriod: 7
      MultiAZ: false  # true for production with higher budget
      DeletionProtection: true

  # Redis Cache
  VoicesRedisCluster:
    Type: AWS::ElastiCache::CacheCluster
    Properties:
      CacheNodeType: cache.t3.micro
      Engine: redis
      NumCacheNodes: 1
      VpcSecurityGroupIds:
        - !Ref RedisSecurityGroup

  # S3 Bucket for Cultural Assets
  VoicesAssetsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "${Environment}-voices-kunqu-assets"
      PublicReadPolicy: false
      VersioningConfiguration:
        Status: Enabled
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      LifecycleConfiguration:
        Rules:
          - Id: ArchiveOldAudio
            Status: Enabled
            Transitions:
              - StorageClass: STANDARD_IA
                TransitionInDays: 30
              - StorageClass: GLACIER
                TransitionInDays: 90

  # CloudFront Distribution
  VoicesCloudFront:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt VoicesAssetsBucket.DomainName
            S3OriginConfig:
              OriginAccessIdentity: !Sub "origin-access-identity/cloudfront/${CloudFrontOAI}"
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad  # Managed-CachingOptimized
        Enabled: true
        Comment: "Voices of Kunqu Cultural Assets CDN"

  # Security Groups
  DatabaseSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for Voices of Kunqu database
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref ApplicationSecurityGroup

  RedisSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for Redis cache
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 6379
          ToPort: 6379
          SourceSecurityGroupId: !Ref ApplicationSecurityGroup

Outputs:
  DatabaseEndpoint:
    Description: RDS PostgreSQL endpoint
    Value: !GetAtt VoicesDatabase.Endpoint.Address
    Export:
      Name: !Sub "${Environment}-database-endpoint"

  RedisEndpoint:
    Description: Redis cluster endpoint
    Value: !GetAtt VoicesRedisCluster.RedisEndpoint.Address
    Export:
      Name: !Sub "${Environment}-redis-endpoint"

  S3BucketName:
    Description: S3 bucket for assets
    Value: !Ref VoicesAssetsBucket
    Export:
      Name: !Sub "${Environment}-s3-bucket"

  CloudFrontDomain:
    Description: CloudFront distribution domain
    Value: !GetAtt VoicesCloudFront.DomainName
    Export:
      Name: !Sub "${Environment}-cloudfront-domain"
```

#### Deploy AWS Infrastructure
```bash
# Deploy AWS infrastructure
aws cloudformation deploy \
  --template-file infrastructure.yml \
  --stack-name voices-kunqu-production \
  --parameter-overrides Environment=production \
  --capabilities CAPABILITY_IAM

# Get infrastructure outputs
aws cloudformation describe-stacks \
  --stack-name voices-kunqu-production \
  --query 'Stacks[0].Outputs'
```

### 2. Database Setup and Migration

#### PostgreSQL Configuration
```bash
# Set up database connection
export DATABASE_URL="postgresql://username:password@endpoint:5432/voices_kunqu_prod"

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed initial cultural content (if available)
npx prisma db seed
```

#### Database Performance Optimization
```sql
-- Cultural content search optimization
CREATE INDEX CONCURRENTLY idx_performances_cultural_search 
ON cultural.performances USING GIN(search_vector);

CREATE INDEX CONCURRENTLY idx_performances_discovery 
ON cultural.performances(complexity_level, historical_period, published_at DESC)
WHERE published_at IS NOT NULL;

-- User experience optimization
CREATE INDEX CONCURRENTLY idx_user_progress_active 
ON users.cultural_progress(user_id, current_pathway, updated_at DESC);

-- Analytics optimization
CREATE INDEX CONCURRENTLY idx_performance_analytics_time_series 
ON system.analytics(timestamp DESC, event_type)
WHERE timestamp > NOW() - INTERVAL '90 days';

-- Enable query performance monitoring
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1s
SELECT pg_reload_conf();
```

#### Redis Configuration
```bash
# Redis configuration for production
redis-cli CONFIG SET maxmemory 256mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli CONFIG SET save "900 1 300 10 60 10000"  # Backup policy
redis-cli CONFIG REWRITE

# Test Redis connection
redis-cli ping
# Expected: PONG
```

### 3. Container Orchestration Setup

#### Docker Configuration
```dockerfile
# Dockerfile.production
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts

# Builder
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose for Local Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/voices_kunqu
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: voices_kunqu
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## CI/CD Pipeline Configuration

### GitHub Actions Workflow

#### Main Deployment Pipeline
```yaml
# .github/workflows/production-deploy.yml
name: Production Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  POSTGRES_VERSION: '15'

jobs:
  quality-assurance:
    name: Quality Assurance
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: voices_kunqu_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript type checking
        run: npm run type-check

      - name: Code linting
        run: npm run lint

      - name: Code formatting check
        run: npm run format:check

      - name: Security vulnerability scan
        run: npm audit --audit-level high

      - name: Setup test database
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/voices_kunqu_test
        run: |
          npx prisma migrate deploy
          npx prisma generate

      - name: Unit tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/voices_kunqu_test
          REDIS_URL: redis://localhost:6379
        run: npm run test

      - name: Test coverage report
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/voices_kunqu_test
          REDIS_URL: redis://localhost:6379
        run: npm run test:coverage

      - name: Accessibility testing
        run: npm run test:a11y

      - name: Build application
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/voices_kunqu_test
        run: npm run build

      - name: Lighthouse CI performance testing
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun

  cultural-validation:
    name: Cultural Content Validation
    runs-on: ubuntu-latest
    needs: quality-assurance
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Validate cultural content structure
        run: |
          # Validate Chinese character encoding
          file --mime-encoding **/*.md | grep -v utf-8 && exit 1 || echo "All files UTF-8 encoded"
          
          # Check for cultural content placeholders
          grep -r "TODO\|FIXME\|XXX" --include="*.md" . && exit 1 || echo "No cultural content placeholders found"

      - name: Cultural terminology validation
        run: |
          # Validate Chinese terminology consistency
          python3 .github/scripts/validate-cultural-terms.py

      - name: Translation quality check
        run: |
          # Check for Shakespearean style consistency
          python3 .github/scripts/check-translation-style.py

  security-scan:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: quality-assurance
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'voices-of-kunqu'
          path: '.'
          format: 'HTML'

      - name: Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          languages: typescript

  performance-testing:
    name: Performance Testing
    runs-on: ubuntu-latest
    needs: quality-assurance
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build for performance testing
        run: npm run build

      - name: Load testing with Artillery
        run: |
          npm install -g artillery@latest
          artillery run .github/artillery/load-test.yml

      - name: Bundle size analysis
        run: |
          npm install -g bundle-analyzer
          npx bundle-analyzer

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [quality-assurance, cultural-validation, security-scan, performance-testing]
    if: github.event_name == 'pull_request'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [quality-assurance, cultural-validation, security-scan, performance-testing]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    environment:
      name: production
      url: https://voices-of-kunqu.org
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Run database migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          npx prisma migrate deploy

      - name: Warm up production cache
        run: |
          curl -f https://voices-of-kunqu.org/api/health
          curl -f https://voices-of-kunqu.org/

      - name: Notify deployment success
        uses: 8398a7/action-slack@v3
        with:
          status: success
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  post-deployment-tests:
    name: Post-Deployment Testing
    runs-on: ubuntu-latest
    needs: deploy-production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: E2E testing against production
        run: |
          npm install -g playwright
          npx playwright install
          npm run test:e2e:production

      - name: Production health checks
        run: |
          curl -f https://voices-of-kunqu.org/api/health
          curl -f https://voices-of-kunqu.org/api/cultural-content/health

      - name: Performance regression testing
        run: |
          npm install -g lighthouse
          lighthouse https://voices-of-kunqu.org --output json --output-path lighthouse-prod.json
          python3 .github/scripts/check-performance-regression.py
```

#### Secondary Workflows

```yaml
# .github/workflows/cultural-content-validation.yml
name: Cultural Content Validation

on:
  push:
    paths:
      - '**/*.md'
      - 'cultural-content/**'
  pull_request:
    paths:
      - '**/*.md'
      - 'cultural-content/**'

jobs:
  validate-cultural-content:
    name: Validate Cultural Content
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install cultural validation tools
        run: |
          pip install jieba hanziconv opencc-python-reimplemented
          pip install -r .github/requirements.txt

      - name: Validate Chinese character encoding
        run: python3 .github/scripts/validate-chinese-encoding.py

      - name: Check cultural terminology consistency
        run: python3 .github/scripts/validate-cultural-terms.py

      - name: Validate pronunciation guides
        run: python3 .github/scripts/validate-pronunciation.py

      - name: Check Shakespearean style consistency
        run: python3 .github/scripts/validate-shakespeare-style.py

      - name: Cultural sensitivity scan
        run: python3 .github/scripts/cultural-sensitivity-check.py
```

### Deployment Automation Scripts

#### Health Check Endpoints
```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const healthChecks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    status: 'healthy',
    checks: {
      database: false,
      redis: false,
      openai: false,
      s3: false
    }
  }

  try {
    // Database health check
    await prisma.$queryRaw`SELECT 1`
    healthChecks.checks.database = true
  } catch (error) {
    console.error('Database health check failed:', error)
  }

  try {
    // Redis health check
    await redis.ping()
    healthChecks.checks.redis = true
  } catch (error) {
    console.error('Redis health check failed:', error)
  }

  try {
    // OpenAI API health check
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    })
    healthChecks.checks.openai = response.ok
  } catch (error) {
    console.error('OpenAI health check failed:', error)
  }

  try {
    // S3 health check
    const AWS = require('aws-sdk')
    const s3 = new AWS.S3()
    await s3.headBucket({ Bucket: process.env.AWS_S3_BUCKET }).promise()
    healthChecks.checks.s3 = true
  } catch (error) {
    console.error('S3 health check failed:', error)
  }

  const allHealthy = Object.values(healthChecks.checks).every(check => check)
  
  if (!allHealthy) {
    healthChecks.status = 'degraded'
    return res.status(503).json(healthChecks)
  }

  res.status(200).json(healthChecks)
}
```

#### Deployment Verification Script
```bash
#!/bin/bash
# scripts/verify-deployment.sh

set -e

ENVIRONMENT=${1:-production}
BASE_URL=${2:-https://voices-of-kunqu.org}

echo "🚀 Verifying deployment for $ENVIRONMENT environment..."

# Health check
echo "📊 Running health checks..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health")
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status')

if [ "$HEALTH_STATUS" != "healthy" ]; then
    echo "❌ Health check failed"
    echo "$HEALTH_RESPONSE" | jq
    exit 1
fi

echo "✅ Health checks passed"

# Performance check
echo "🚀 Running performance checks..."
LIGHTHOUSE_SCORE=$(lighthouse "$BASE_URL" --output json --quiet | jq '.categories.performance.score')
LIGHTHOUSE_THRESHOLD=0.9

if (( $(echo "$LIGHTHOUSE_SCORE < $LIGHTHOUSE_THRESHOLD" | bc -l) )); then
    echo "❌ Performance check failed: Score $LIGHTHOUSE_SCORE < $LIGHTHOUSE_THRESHOLD"
    exit 1
fi

echo "✅ Performance checks passed: Score $LIGHTHOUSE_SCORE"

# Cultural content accessibility
echo "🎭 Verifying cultural content accessibility..."
CULTURAL_RESPONSE=$(curl -s "$BASE_URL/api/cultural-content/health")
CULTURAL_STATUS=$(echo "$CULTURAL_RESPONSE" | jq -r '.status')

if [ "$CULTURAL_STATUS" != "healthy" ]; then
    echo "❌ Cultural content check failed"
    exit 1
fi

echo "✅ Cultural content checks passed"

# Database connectivity
echo "💾 Verifying database connectivity..."
DB_RESPONSE=$(curl -s "$BASE_URL/api/db-health")
DB_STATUS=$(echo "$DB_RESPONSE" | jq -r '.status')

if [ "$DB_STATUS" != "connected" ]; then
    echo "❌ Database connectivity check failed"
    exit 1
fi

echo "✅ Database connectivity verified"

echo "🎉 Deployment verification completed successfully!"
```

---

## Production Deployment Procedures

### Step-by-Step Deployment Instructions

#### Pre-Deployment Checklist
```bash
# 1. Verify all environment variables are set
./scripts/check-env-vars.sh production

# 2. Run full test suite
npm run test:all

# 3. Cultural content validation
npm run validate:cultural

# 4. Security scan
npm run security:scan

# 5. Performance baseline
npm run performance:baseline

# 6. Database backup
./scripts/backup-database.sh production
```

#### Production Deployment Process
```bash
# Step 1: Deploy infrastructure (if first deployment)
aws cloudformation deploy \
  --template-file infrastructure.yml \
  --stack-name voices-kunqu-production \
  --parameter-overrides Environment=production \
  --capabilities CAPABILITY_IAM

# Step 2: Configure Vercel environment
vercel env add DATABASE_URL production "$(aws ssm get-parameter --name /voices-kunqu/prod/database-url --query Parameter.Value --output text)"
vercel env add REDIS_URL production "$(aws ssm get-parameter --name /voices-kunqu/prod/redis-url --query Parameter.Value --output text)"
vercel env add OPENAI_API_KEY production "$(aws ssm get-parameter --name /voices-kunqu/prod/openai-key --query Parameter.Value --output text)"

# Step 3: Deploy to production
git push origin main

# Step 4: Run database migrations
DATABASE_URL=$(aws ssm get-parameter --name /voices-kunqu/prod/database-url --query Parameter.Value --output text)
npx prisma migrate deploy

# Step 5: Verify deployment
./scripts/verify-deployment.sh production https://voices-of-kunqu.org

# Step 6: Cultural content validation
./scripts/validate-cultural-production.sh

# Step 7: Performance verification
./scripts/performance-check.sh https://voices-of-kunqu.org
```

### Database Migration and Rollback Procedures

#### Migration Execution
```bash
# Production migration process
export DATABASE_URL="your_production_database_url"

# 1. Create database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Preview migration
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource $DATABASE_URL \
  --script

# 3. Apply migration
npx prisma migrate deploy

# 4. Verify migration
npx prisma migrate status

# 5. Generate new Prisma client
npx prisma generate
```

#### Rollback Procedures
```bash
# Emergency rollback process
#!/bin/bash
# scripts/emergency-rollback.sh

BACKUP_FILE=$1
VERCEL_DEPLOYMENT_ID=$2

if [ -z "$BACKUP_FILE" ] || [ -z "$VERCEL_DEPLOYMENT_ID" ]; then
    echo "Usage: $0 <backup_file> <vercel_deployment_id>"
    exit 1
fi

echo "🚨 Starting emergency rollback..."

# 1. Rollback database
echo "📊 Rolling back database..."
psql $DATABASE_URL < $BACKUP_FILE

# 2. Rollback Vercel deployment
echo "🔄 Rolling back Vercel deployment..."
vercel rollback $VERCEL_DEPLOYMENT_ID

# 3. Verify rollback
echo "✅ Verifying rollback..."
./scripts/verify-deployment.sh production

echo "🎉 Rollback completed successfully"
```

### Load Balancer and DNS Configuration

#### CloudFlare Setup (Recommended)
```yaml
# cloudflare-config.yml
zones:
  - name: voices-of-kunqu.org
    settings:
      ssl: full_strict
      security_level: medium
      browser_cache_ttl: 14400  # 4 hours
      challenge_ttl: 1800       # 30 minutes
      development_mode: false
      ipv6: true
      
    dns_records:
      - type: CNAME
        name: "@"
        content: "cname.vercel-dns.com"
        proxied: true
        
      - type: CNAME
        name: "www"
        content: "cname.vercel-dns.com"
        proxied: true
        
      - type: CNAME
        name: "cdn"
        content: "d1234567890.cloudfront.net"
        proxied: true

    page_rules:
      - url: "voices-of-kunqu.org/api/*"
        settings:
          cache_level: bypass
          
      - url: "voices-of-kunqu.org/audio/*"
        settings:
          cache_level: cache_everything
          edge_cache_ttl: 2592000  # 30 days
          browser_cache_ttl: 86400  # 1 day

    security_settings:
      - type: waf
        rules:
          - description: "Block non-cultural content attacks"
            expression: "(http.request.uri.path contains \"/admin\" and ip.geoip.country ne \"GB\" and ip.geoip.country ne \"CN\")"
            action: block
```

---

## Monitoring and Observability

### Application Performance Monitoring (APM) Setup

#### Vercel Analytics Configuration
```typescript
// lib/analytics.ts
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export function AnalyticsProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  )
}

// Track cultural engagement metrics
export function trackCulturalEvent(eventName: string, properties: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'cultural_engagement',
      event_label: properties.performanceId || 'unknown',
      value: properties.duration || 0,
      custom_map: {
        cultural_category: properties.culturalCategory,
        learning_level: properties.learningLevel,
        user_progress: properties.userProgress
      }
    })
  }
}
```

#### Sentry Error Tracking
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Cultural content specific configuration
  beforeSend(event, hint) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = hint.originalException
      if (error instanceof Error && error.message.includes('ResizeObserver')) {
        return null // Filter out ResizeObserver errors
      }
    }
    
    // Add cultural context to errors
    if (event.tags) {
      event.tags.cultural_content = 'true'
    }
    
    return event
  },
  
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.nextRouterInstrumentation,
      tracingOrigins: ['localhost', 'voices-of-kunqu.org', /^\//]
    }),
    new Sentry.Replay({
      maskAllText: true,  // Privacy protection
      blockAllMedia: true  // Protect cultural content
    })
  ]
})
```

### Log Aggregation and Analysis System

#### Structured Logging Configuration
```typescript
// lib/logger.ts
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
    log: (object) => ({
      ...object,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      service: 'voices-of-kunqu',
      version: process.env.npm_package_version
    })
  },
  redact: [
    'password',
    'token',
    'authorization',
    'cookie',
    'apiKey',
    'email'
  ]
})

// Cultural content specific logging
export function logCulturalEvent(event: string, data: any) {
  logger.info({
    event,
    type: 'cultural_event',
    cultural_category: data.category,
    performance_id: data.performanceId,
    user_id: data.userId ? hashUserId(data.userId) : null,
    duration: data.duration,
    engagement_level: data.engagementLevel
  }, `Cultural event: ${event}`)
}

export function logPerformanceMetric(metric: string, value: number, context: any) {
  logger.info({
    metric,
    value,
    type: 'performance_metric',
    context: {
      route: context.route,
      cultural_content: context.culturalContent,
      user_type: context.userType
    }
  }, `Performance metric: ${metric}`)
}

export default logger
```

### Alert Definitions and Incident Response

#### CloudWatch Alarms (AWS)
```yaml
# cloudwatch-alarms.yml
alarms:
  # Database performance
  - name: "VoicesKunqu-DatabaseConnections"
    metric: "AWS/RDS/DatabaseConnections"
    threshold: 80
    comparison: "GreaterThanThreshold"
    evaluation_periods: 2
    action: "arn:aws:sns:region:account:voices-kunqu-alerts"
    
  - name: "VoicesKunqu-DatabaseCPU"
    metric: "AWS/RDS/CPUUtilization"
    threshold: 80
    comparison: "GreaterThanThreshold"
    evaluation_periods: 3
    action: "arn:aws:sns:region:account:voices-kunqu-alerts"

  # Redis performance
  - name: "VoicesKunqu-RedisCPU"
    metric: "AWS/ElastiCache/CPUUtilization"
    threshold: 80
    comparison: "GreaterThanThreshold"
    evaluation_periods: 2
    action: "arn:aws:sns:region:account:voices-kunqu-alerts"

  # S3 costs (important for non-profit budget)
  - name: "VoicesKunqu-S3Costs"
    metric: "AWS/Billing/EstimatedCharges"
    threshold: 100  # $100 monthly threshold
    comparison: "GreaterThanThreshold"
    evaluation_periods: 1
    action: "arn:aws:sns:region:account:voices-kunqu-budget-alerts"

  # OpenAI API costs
  - name: "VoicesKunqu-OpenAICosts"
    metric: "Custom/OpenAI/MonthlyCosts"
    threshold: 200  # $200 monthly threshold
    comparison: "GreaterThanThreshold"
    evaluation_periods: 1
    action: "arn:aws:sns:region:account:voices-kunqu-budget-alerts"
```

#### Uptime Monitoring
```typescript
// scripts/uptime-monitor.ts
import { fetch } from 'undici'
import { sendSlackAlert } from './lib/notifications'

const ENDPOINTS = [
  'https://voices-of-kunqu.org',
  'https://voices-of-kunqu.org/api/health',
  'https://voices-of-kunqu.org/api/cultural-content/health'
]

async function checkEndpoint(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'GET',
      timeout: 10000 
    })
    return response.ok
  } catch (error) {
    console.error(`Endpoint check failed for ${url}:`, error)
    return false
  }
}

async function runUptimeCheck() {
  const results = await Promise.all(
    ENDPOINTS.map(async (endpoint) => ({
      endpoint,
      isUp: await checkEndpoint(endpoint),
      timestamp: new Date().toISOString()
    }))
  )

  const failedEndpoints = results.filter(result => !result.isUp)
  
  if (failedEndpoints.length > 0) {
    await sendSlackAlert({
      channel: '#incidents',
      text: `🚨 Uptime check failed for ${failedEndpoints.length} endpoint(s)`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Failed Endpoints:*\n${failedEndpoints.map(f => `• ${f.endpoint}`).join('\n')}`
          }
        }
      ]
    })
  }

  return results
}

// Run every 5 minutes
setInterval(runUptimeCheck, 5 * 60 * 1000)
```

### Health Check Endpoints and Monitoring Dashboards

#### Comprehensive Health Check API
```typescript
// pages/api/health/comprehensive.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { checkOpenAIHealth } from '@/lib/openai'
import { checkS3Health } from '@/lib/aws'

interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  details?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const startTime = Date.now()
  const checks: HealthCheck[] = []

  // Database health check
  const dbStart = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    const dbEnd = Date.now()
    checks.push({
      service: 'database',
      status: 'healthy',
      responseTime: dbEnd - dbStart
    })
  } catch (error) {
    checks.push({
      service: 'database',
      status: 'unhealthy',
      responseTime: Date.now() - dbStart,
      details: { error: error.message }
    })
  }

  // Redis health check
  const redisStart = Date.now()
  try {
    await redis.ping()
    const redisEnd = Date.now()
    checks.push({
      service: 'redis',
      status: 'healthy',
      responseTime: redisEnd - redisStart
    })
  } catch (error) {
    checks.push({
      service: 'redis',
      status: 'unhealthy',
      responseTime: Date.now() - redisStart,
      details: { error: error.message }
    })
  }

  // OpenAI API health check
  const openaiStart = Date.now()
  try {
    const isHealthy = await checkOpenAIHealth()
    const openaiEnd = Date.now()
    checks.push({
      service: 'openai',
      status: isHealthy ? 'healthy' : 'degraded',
      responseTime: openaiEnd - openaiStart
    })
  } catch (error) {
    checks.push({
      service: 'openai',
      status: 'unhealthy',
      responseTime: Date.now() - openaiStart,
      details: { error: error.message }
    })
  }

  // S3 health check
  const s3Start = Date.now()
  try {
    const isHealthy = await checkS3Health()
    const s3End = Date.now()
    checks.push({
      service: 's3',
      status: isHealthy ? 'healthy' : 'degraded',
      responseTime: s3End - s3Start
    })
  } catch (error) {
    checks.push({
      service: 's3',
      status: 'unhealthy',
      responseTime: Date.now() - s3Start,
      details: { error: error.message }
    })
  }

  const overallStatus = checks.every(check => check.status === 'healthy') 
    ? 'healthy' 
    : checks.some(check => check.status === 'unhealthy') 
    ? 'unhealthy' 
    : 'degraded'

  const response = {
    timestamp: new Date().toISOString(),
    status: overallStatus,
    responseTime: Date.now() - startTime,
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    checks
  }

  const statusCode = overallStatus === 'healthy' ? 200 : 503
  res.status(statusCode).json(response)
}
```

---

## Operational Procedures

### Backup Schedules and Recovery Procedures

#### Automated Backup Strategy
```bash
#!/bin/bash
# scripts/backup-production.sh

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/voices-kunqu"
S3_BACKUP_BUCKET="voices-kunqu-backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "📊 Creating database backup..."
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/database_$TIMESTAMP.sql.gz"

# Redis backup
echo "🔄 Creating Redis backup..."
redis-cli --rdb "$BACKUP_DIR/redis_$TIMESTAMP.rdb"

# Upload to S3
echo "☁️ Uploading backups to S3..."
aws s3 cp "$BACKUP_DIR/database_$TIMESTAMP.sql.gz" "s3://$S3_BACKUP_BUCKET/database/"
aws s3 cp "$BACKUP_DIR/redis_$TIMESTAMP.rdb" "s3://$S3_BACKUP_BUCKET/redis/"

# Cultural content backup
echo "🎭 Backing up cultural content..."
tar -czf "$BACKUP_DIR/cultural-content_$TIMESTAMP.tar.gz" cultural-content/
aws s3 cp "$BACKUP_DIR/cultural-content_$TIMESTAMP.tar.gz" "s3://$S3_BACKUP_BUCKET/cultural-content/"

# Cleanup old local backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completed successfully"

# Send notification
curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"✅ Production backup completed successfully for $TIMESTAMP\"}" \
  $SLACK_WEBHOOK_URL
```

#### Backup Verification Script
```bash
#!/bin/bash
# scripts/verify-backup.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

echo "🔍 Verifying backup: $BACKUP_FILE"

# Test database backup restoration
if [[ $BACKUP_FILE == *"database"* ]]; then
    # Create test database
    TEST_DB="voices_kunqu_backup_test_$(date +%s)"
    createdb $TEST_DB
    
    # Restore backup
    if [[ $BACKUP_FILE == *.gz ]]; then
        gunzip -c $BACKUP_FILE | psql $TEST_DB
    else
        psql $TEST_DB < $BACKUP_FILE
    fi
    
    # Verify data integrity
    ROW_COUNT=$(psql $TEST_DB -t -c "SELECT COUNT(*) FROM cultural.performances")
    
    if [ "$ROW_COUNT" -gt 0 ]; then
        echo "✅ Database backup verification successful ($ROW_COUNT performances found)"
    else
        echo "❌ Database backup verification failed (no performances found)"
        exit 1
    fi
    
    # Cleanup test database
    dropdb $TEST_DB
fi

echo "✅ Backup verification completed"
```

#### Recovery Procedures
```bash
#!/bin/bash
# scripts/disaster-recovery.sh

RECOVERY_TYPE=$1  # full|database|redis|cultural-content
BACKUP_DATE=$2    # YYYYMMDD_HHMMSS

if [ -z "$RECOVERY_TYPE" ] || [ -z "$BACKUP_DATE" ]; then
    echo "Usage: $0 <recovery_type> <backup_date>"
    echo "Recovery types: full, database, redis, cultural-content"
    exit 1
fi

S3_BACKUP_BUCKET="voices-kunqu-backups"
RECOVERY_DIR="/tmp/recovery"
mkdir -p $RECOVERY_DIR

echo "🚨 Starting disaster recovery: $RECOVERY_TYPE for $BACKUP_DATE"

case $RECOVERY_TYPE in
    "database"|"full")
        echo "📊 Recovering database..."
        aws s3 cp "s3://$S3_BACKUP_BUCKET/database/database_$BACKUP_DATE.sql.gz" "$RECOVERY_DIR/"
        
        # Stop application
        vercel scale 0
        
        # Restore database
        gunzip -c "$RECOVERY_DIR/database_$BACKUP_DATE.sql.gz" | psql $DATABASE_URL
        
        # Verify recovery
        ./scripts/verify-backup.sh "$RECOVERY_DIR/database_$BACKUP_DATE.sql.gz"
        ;;
        
    "redis"|"full")
        echo "🔄 Recovering Redis..."
        aws s3 cp "s3://$S3_BACKUP_BUCKET/redis/redis_$BACKUP_DATE.rdb" "$RECOVERY_DIR/"
        
        # Stop Redis
        redis-cli shutdown
        
        # Restore Redis data
        cp "$RECOVERY_DIR/redis_$BACKUP_DATE.rdb" /var/lib/redis/dump.rdb
        
        # Start Redis
        systemctl start redis
        ;;
        
    "cultural-content"|"full")
        echo "🎭 Recovering cultural content..."
        aws s3 cp "s3://$S3_BACKUP_BUCKET/cultural-content/cultural-content_$BACKUP_DATE.tar.gz" "$RECOVERY_DIR/"
        
        # Backup current content
        mv cultural-content cultural-content.backup.$(date +%s)
        
        # Restore content
        tar -xzf "$RECOVERY_DIR/cultural-content_$BACKUP_DATE.tar.gz" -C .
        ;;
esac

if [ "$RECOVERY_TYPE" == "full" ] || [ "$RECOVERY_TYPE" == "database" ]; then
    # Restart application
    vercel scale 1
    
    # Verify deployment
    sleep 30
    ./scripts/verify-deployment.sh production
fi

echo "✅ Disaster recovery completed for $RECOVERY_TYPE"

# Send notification
curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"🚨 Disaster recovery completed: $RECOVERY_TYPE for $BACKUP_DATE\"}" \
  $SLACK_WEBHOOK_URL
```

### Scaling Procedures for Traffic Spikes

#### Auto-scaling Configuration
```typescript
// lib/auto-scaling.ts
interface ScalingMetrics {
  cpuUtilization: number
  memoryUtilization: number
  responseTime: number
  errorRate: number
  concurrentUsers: number
}

class AutoScaler {
  private readonly thresholds = {
    scaleUp: {
      cpuUtilization: 70,
      memoryUtilization: 80,
      responseTime: 2000,
      errorRate: 0.05,
      concurrentUsers: 500
    },
    scaleDown: {
      cpuUtilization: 30,
      memoryUtilization: 40,
      responseTime: 500,
      errorRate: 0.01,
      concurrentUsers: 100
    }
  }

  async checkScalingNeed(metrics: ScalingMetrics): Promise<'up' | 'down' | 'none'> {
    const { scaleUp, scaleDown } = this.thresholds

    // Check scale up conditions
    if (
      metrics.cpuUtilization > scaleUp.cpuUtilization ||
      metrics.memoryUtilization > scaleUp.memoryUtilization ||
      metrics.responseTime > scaleUp.responseTime ||
      metrics.errorRate > scaleUp.errorRate ||
      metrics.concurrentUsers > scaleUp.concurrentUsers
    ) {
      return 'up'
    }

    // Check scale down conditions (all must be low)
    if (
      metrics.cpuUtilization < scaleDown.cpuUtilization &&
      metrics.memoryUtilization < scaleDown.memoryUtilization &&
      metrics.responseTime < scaleDown.responseTime &&
      metrics.errorRate < scaleDown.errorRate &&
      metrics.concurrentUsers < scaleDown.concurrentUsers
    ) {
      return 'down'
    }

    return 'none'
  }

  async scaleInfrastructure(direction: 'up' | 'down'): Promise<void> {
    // Vercel automatically handles frontend scaling
    // Scale database connections and Redis if needed
    
    if (direction === 'up') {
      await this.scaleDatabase('up')
      await this.scaleRedis('up')
      await this.enableCDNCache()
    } else {
      await this.scaleDatabase('down')
      await this.scaleRedis('down')
    }
  }

  private async scaleDatabase(direction: 'up' | 'down'): Promise<void> {
    // Adjust connection pool size
    const newPoolSize = direction === 'up' ? 20 : 10
    process.env.DATABASE_CONNECTION_LIMIT = newPoolSize.toString()
  }

  private async scaleRedis(direction: 'up' | 'down'): Promise<void> {
    // Adjust Redis memory and connections
    const newMaxMemory = direction === 'up' ? '512mb' : '256mb'
    // This would typically be handled by AWS ElastiCache scaling
  }

  private async enableCDNCache(): Promise<void> {
    // Increase CDN cache aggressiveness during high traffic
    // This would be handled by CloudFront configuration
  }
}

export const autoScaler = new AutoScaler()
```

#### Traffic Spike Response Plan
```bash
#!/bin/bash
# scripts/handle-traffic-spike.sh

SPIKE_LEVEL=${1:-"moderate"}  # low|moderate|high|extreme

echo "🚀 Handling traffic spike: $SPIKE_LEVEL"

case $SPIKE_LEVEL in
    "low")
        echo "📈 Low traffic spike detected"
        # Enable more aggressive caching
        curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/cache_level" \
          -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
          -H "Content-Type: application/json" \
          --data '{"value":"aggressive"}'
        ;;
        
    "moderate")
        echo "📈 Moderate traffic spike detected"
        # Scale database connections
        aws rds modify-db-instance \
          --db-instance-identifier voices-kunqu-production \
          --db-parameter-group-name high-traffic-params \
          --apply-immediately
        
        # Increase Redis memory
        aws elasticache modify-cache-cluster \
          --cache-cluster-id voices-kunqu-redis \
          --cache-node-type cache.t3.small \
          --apply-immediately
        ;;
        
    "high")
        echo "📈 High traffic spike detected"
        # Enable read replicas
        aws rds create-db-instance-read-replica \
          --db-instance-identifier voices-kunqu-read-replica \
          --source-db-instance-identifier voices-kunqu-production \
          --db-instance-class db.t3.small
        
        # Scale Redis cluster
        aws elasticache modify-replication-group \
          --replication-group-id voices-kunqu-redis-cluster \
          --num-cache-clusters 3 \
          --apply-immediately
        ;;
        
    "extreme")
        echo "🚨 Extreme traffic spike detected"
        # Enable maintenance mode with cached content
        vercel env add MAINTENANCE_MODE production "true"
        
        # Deploy emergency static version
        vercel deploy --prod --build-env MAINTENANCE_MODE=true
        
        # Send emergency notifications
        curl -X POST -H 'Content-type: application/json' \
          --data '{"text":"🚨 EXTREME traffic spike - maintenance mode enabled","channel":"#incidents"}' \
          $SLACK_WEBHOOK_URL
        ;;
esac

echo "✅ Traffic spike response completed"
```

### Security Scanning and Vulnerability Management

#### Automated Security Scanning
```yaml
# .github/workflows/security-scan.yml
name: Security Scanning

on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM
  workflow_dispatch:

jobs:
  dependency-scan:
    name: Dependency Vulnerability Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Audit npm dependencies
        run: npm audit --audit-level high

      - name: Snyk vulnerability scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --file=package.json

      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'voices-of-kunqu'
          path: '.'
          format: 'JSON'
          out: 'reports'

      - name: Upload security reports
        uses: actions/upload-artifact@v3
        with:
          name: security-reports
          path: reports/

  infrastructure-scan:
    name: Infrastructure Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Terraform security scan
        uses: aquasecurity/tfsec-action@v1.0.3
        with:
          working_directory: infrastructure/

      - name: Docker image vulnerability scan
        run: |
          docker build -t voices-kunqu:security-test .
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image voices-kunqu:security-test

  web-security-scan:
    name: Web Application Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'https://voices-of-kunqu.org'
          rules_file_name: '.zap/rules.tsv'

      - name: SSL Labs scan
        run: |
          curl "https://api.ssllabs.com/api/v3/analyze?host=voices-of-kunqu.org&publish=off&all=done"

  cultural-content-security:
    name: Cultural Content Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Scan for sensitive cultural data
        run: |
          grep -r "password\|secret\|key\|token" --include="*.md" cultural-content/ || true
          
      - name: Check for cultural appropriation risks
        run: python3 .github/scripts/cultural-sensitivity-scan.py

      - name: Validate cultural expert signatures
        run: python3 .github/scripts/validate-expert-signatures.py
```

#### Vulnerability Response Procedures
```bash
#!/bin/bash
# scripts/handle-vulnerability.sh

SEVERITY=${1:-"medium"}  # low|medium|high|critical
COMPONENT=$2             # dependency|infrastructure|application
CVE_ID=$3

echo "🔒 Handling $SEVERITY vulnerability in $COMPONENT: $CVE_ID"

case $SEVERITY in
    "critical")
        echo "🚨 CRITICAL vulnerability detected"
        
        # Immediate response
        # 1. Enable maintenance mode
        vercel env add MAINTENANCE_MODE production "true"
        vercel deploy --prod
        
        # 2. Create emergency patch branch
        git checkout -b "emergency/fix-$CVE_ID"
        
        # 3. Send immediate notifications
        curl -X POST -H 'Content-type: application/json' \
          --data "{\"text\":\"🚨 CRITICAL vulnerability $CVE_ID detected in $COMPONENT - maintenance mode enabled\",\"channel\":\"#security-incidents\"}" \
          $SLACK_WEBHOOK_URL
        
        # 4. Start incident response
        echo "$(date): Critical vulnerability $CVE_ID detected" >> security-incidents.log
        ;;
        
    "high")
        echo "⚠️ HIGH severity vulnerability detected"
        
        # Schedule immediate patching
        git checkout -b "security/fix-$CVE_ID"
        
        # Send notifications
        curl -X POST -H 'Content-type: application/json' \
          --data "{\"text\":\"⚠️ HIGH severity vulnerability $CVE_ID in $COMPONENT - patching in progress\",\"channel\":\"#security\"}" \
          $SLACK_WEBHOOK_URL
        ;;
        
    "medium")
        echo "📋 MEDIUM severity vulnerability detected"
        
        # Schedule patching in next release cycle
        echo "TODO: Fix $CVE_ID in $COMPONENT" >> security-backlog.md
        
        # Create tracking issue
        gh issue create \
          --title "Security: Fix $CVE_ID in $COMPONENT" \
          --body "Medium severity vulnerability detected. CVE: $CVE_ID" \
          --label "security,bug"
        ;;
        
    "low")
        echo "ℹ️ LOW severity vulnerability detected"
        
        # Add to security backlog
        echo "- [ ] Fix $CVE_ID in $COMPONENT (Low priority)" >> security-backlog.md
        ;;
esac

echo "✅ Vulnerability response initiated for $CVE_ID"
```

### Maintenance Windows and Update Procedures

#### Scheduled Maintenance Script
```bash
#!/bin/bash
# scripts/scheduled-maintenance.sh

MAINTENANCE_TYPE=${1:-"standard"}  # standard|emergency|cultural-content
DURATION=${2:-"30"}               # minutes

echo "🔧 Starting $MAINTENANCE_TYPE maintenance (estimated $DURATION minutes)"

# Pre-maintenance checks
echo "📋 Running pre-maintenance checks..."
./scripts/verify-deployment.sh production

# Create maintenance backup
echo "💾 Creating maintenance backup..."
./scripts/backup-production.sh

# Enable maintenance mode
echo "🚧 Enabling maintenance mode..."
vercel env add MAINTENANCE_MODE production "true"
vercel env add MAINTENANCE_MESSAGE production "Scheduled maintenance in progress. Cultural content will be available shortly."
vercel deploy --prod

# Wait for deployment
sleep 60

# Verify maintenance mode
MAINTENANCE_STATUS=$(curl -s https://voices-of-kunqu.org/api/health | jq -r '.maintenance')
if [ "$MAINTENANCE_STATUS" != "true" ]; then
    echo "❌ Failed to enable maintenance mode"
    exit 1
fi

echo "✅ Maintenance mode enabled successfully"

# Send start notification
curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"🔧 Scheduled maintenance started for $DURATION minutes\",\"channel\":\"#deployments\"}" \
  $SLACK_WEBHOOK_URL

case $MAINTENANCE_TYPE in
    "standard")
        echo "🔄 Running standard maintenance..."
        
        # Database maintenance
        psql $DATABASE_URL -c "VACUUM ANALYZE;"
        psql $DATABASE_URL -c "REINDEX DATABASE voices_kunqu_prod;"
        
        # Redis maintenance
        redis-cli BGREWRITEAOF
        
        # Clear old cache
        redis-cli FLUSHDB
        
        # Update dependencies
        npm update
        npm audit fix
        ;;
        
    "emergency")
        echo "🚨 Running emergency maintenance..."
        
        # Apply critical patches
        npm audit fix --force
        
        # Restart services
        # (Vercel handles this automatically)
        ;;
        
    "cultural-content")
        echo "🎭 Running cultural content maintenance..."
        
        # Update cultural content
        git pull origin main --rebase
        
        # Validate cultural content
        npm run validate:cultural
        
        # Regenerate search indexes
        psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW cultural.search_index;"
        ;;
esac

# Post-maintenance verification
echo "✅ Running post-maintenance verification..."
sleep 30

# Disable maintenance mode
echo "🔓 Disabling maintenance mode..."
vercel env rm MAINTENANCE_MODE production
vercel env rm MAINTENANCE_MESSAGE production
vercel deploy --prod

# Wait for normal deployment
sleep 60

# Verify everything is working
./scripts/verify-deployment.sh production

if [ $? -eq 0 ]; then
    echo "✅ Maintenance completed successfully"
    
    # Send completion notification
    curl -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"✅ Scheduled maintenance completed successfully\",\"channel\":\"#deployments\"}" \
      $SLACK_WEBHOOK_URL
else
    echo "❌ Post-maintenance verification failed"
    
    # Send failure notification
    curl -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"❌ Maintenance verification failed - manual intervention required\",\"channel\":\"#incidents\"}" \
      $SLACK_WEBHOOK_URL
    
    exit 1
fi

echo "🎉 Maintenance window completed"
```

---

## Environmental Configuration

### Production Environment Variables

#### Required Environment Variables
```bash
# Production environment variables (.env.production)

# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/voices_kunqu_prod"
DATABASE_CONNECTION_LIMIT="10"

# Redis Configuration
REDIS_URL="redis://host:6379"
REDIS_PASSWORD="your-redis-password"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-32-chars-minimum"
NEXTAUTH_URL="https://voices-of-kunqu.org"

# OpenAI API
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_ORGANIZATION="org-your-organization"

# AWS Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="voices-kunqu-assets-prod"

# External Services
SENTRY_DSN="https://your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="voices-of-kunqu"

# Cultural Content
CULTURAL_EXPERT_EMAIL="expert@voices-of-kunqu.org"
CULTURAL_CONTENT_WEBHOOK="https://your-webhook-url"

# Monitoring
VERCEL_ANALYTICS_ID="your-vercel-analytics-id"
GOOGLE_ANALYTICS_ID="G-your-google-analytics-id"

# Security
ALLOWED_HOSTS="voices-of-kunqu.org,www.voices-of-kunqu.org"
CSRF_TRUSTED_ORIGINS="https://voices-of-kunqu.org"

# Performance
ENABLE_PERFORMANCE_MONITORING="true"
MAX_AUDIO_CACHE_SIZE="1000"
AUDIO_CDN_URL="https://cdn.voices-of-kunqu.org"

# Feature Flags
ENABLE_COMMUNITY_FEATURES="true"
ENABLE_EXPERT_DASHBOARD="true"
ENABLE_ANALYTICS="true"
MAINTENANCE_MODE="false"
```

#### Environment Variable Validation
```typescript
// lib/env-validation.ts
import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_CONNECTION_LIMIT: z.string().transform(Number).default('10'),
  
  // Redis
  REDIS_URL: z.string().url(),
  REDIS_PASSWORD: z.string().optional(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // OpenAI
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  OPENAI_ORGANIZATION: z.string().startsWith('org-').optional(),
  
  // AWS
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  
  // External Services
  SENTRY_DSN: z.string().url().optional(),
  
  // Feature Flags
  ENABLE_COMMUNITY_FEATURES: z.string().transform(Boolean).default('true'),
  ENABLE_EXPERT_DASHBOARD: z.string().transform(Boolean).default('true'),
  ENABLE_ANALYTICS: z.string().transform(Boolean).default('true'),
  MAINTENANCE_MODE: z.string().transform(Boolean).default('false'),
  
  // Performance
  MAX_AUDIO_CACHE_SIZE: z.string().transform(Number).default('1000'),
  AUDIO_CDN_URL: z.string().url().optional()
})

export const env = envSchema.parse(process.env)

// Runtime validation
export function validateEnvironment(): void {
  try {
    envSchema.parse(process.env)
    console.log('✅ Environment variables validated successfully')
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    process.exit(1)
  }
}
```

### Secrets Management

#### AWS Secrets Manager Integration
```typescript
// lib/secrets.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

const client = new SecretsManagerClient({ region: process.env.AWS_REGION })

class SecretsManager {
  private cache = new Map<string, any>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  async getSecret(secretName: string): Promise<any> {
    // Check cache first
    const cached = this.cache.get(secretName)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.value
    }

    try {
      const command = new GetSecretValueCommand({ SecretId: secretName })
      const response = await client.send(command)
      
      const secretValue = JSON.parse(response.SecretString || '{}')
      
      // Cache the secret
      this.cache.set(secretName, {
        value: secretValue,
        timestamp: Date.now()
      })
      
      return secretValue
    } catch (error) {
      console.error(`Failed to retrieve secret ${secretName}:`, error)
      throw new Error(`Secret retrieval failed: ${secretName}`)
    }
  }

  async getDatabaseCredentials(): Promise<{
    username: string
    password: string
    host: string
    port: number
    database: string
  }> {
    return this.getSecret('voices-kunqu/production/database')
  }

  async getOpenAIKey(): Promise<string> {
    const secrets = await this.getSecret('voices-kunqu/production/openai')
    return secrets.apiKey
  }

  async getRedisCredentials(): Promise<{
    host: string
    port: number
    password: string
  }> {
    return this.getSecret('voices-kunqu/production/redis')
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const secretsManager = new SecretsManager()
```

---

## Post-Deployment Operations

### Performance Monitoring and Optimization

#### Performance Metrics Collection
```typescript
// lib/performance-monitoring.ts
interface PerformanceMetrics {
  pageLoadTime: number
  audioGenerationTime: number
  databaseQueryTime: number
  apiResponseTime: number
  userEngagementTime: number
  culturalContentAccessTime: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []

  recordPageLoad(time: number, route: string): void {
    this.sendMetric('page_load_time', time, { route })
  }

  recordAudioGeneration(time: number, textLength: number): void {
    this.sendMetric('audio_generation_time', time, { textLength })
  }

  recordDatabaseQuery(time: number, query: string): void {
    this.sendMetric('database_query_time', time, { 
      query: query.substring(0, 50) // Truncate for privacy
    })
  }

  recordCulturalEngagement(duration: number, contentType: string): void {
    this.sendMetric('cultural_engagement', duration, { contentType })
  }

  private sendMetric(name: string, value: number, tags: Record<string, any>): void {
    // Send to multiple monitoring services
    this.sendToVercelAnalytics(name, value, tags)
    this.sendToSentry(name, value, tags)
    this.sendToCustomAnalytics(name, value, tags)
  }

  private sendToVercelAnalytics(name: string, value: number, tags: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', name, { value, ...tags })
    }
  }

  private sendToSentry(name: string, value: number, tags: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.addBreadcrumb({
        category: 'performance',
        message: name,
        level: 'info',
        data: { value, ...tags }
      })
    }
  }

  private sendToCustomAnalytics(name: string, value: number, tags: Record<string, any>): void {
    // Send to custom analytics endpoint
    fetch('/api/analytics/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value, tags, timestamp: Date.now() })
    }).catch(console.error)
  }

  generatePerformanceReport(): any {
    // Generate comprehensive performance report
    return {
      timestamp: new Date().toISOString(),
      averagePageLoadTime: this.calculateAverage('page_load_time'),
      averageAudioGeneration: this.calculateAverage('audio_generation_time'),
      averageDatabaseQuery: this.calculateAverage('database_query_time'),
      culturalEngagementMetrics: this.calculateCulturalMetrics()
    }
  }

  private calculateAverage(metricName: string): number {
    const relevantMetrics = this.metrics.filter(m => m[metricName as keyof PerformanceMetrics])
    const sum = relevantMetrics.reduce((acc, m) => acc + m[metricName as keyof PerformanceMetrics], 0)
    return relevantMetrics.length > 0 ? sum / relevantMetrics.length : 0
  }

  private calculateCulturalMetrics(): any {
    // Calculate cultural-specific performance metrics
    return {
      averagePerformanceCompletionTime: 0, // Implement based on actual data
      culturalContentAccessPattern: {},
      learningPathwayEffectiveness: {}
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()
```

#### Continuous Optimization

```bash
#!/bin/bash
# scripts/performance-optimization.sh

echo "🚀 Running performance optimization..."

# Database optimization
echo "📊 Optimizing database..."
psql $DATABASE_URL << EOF
-- Update statistics
ANALYZE;

-- Vacuum full for heavily updated tables
VACUUM FULL cultural.performances;
VACUUM FULL users.cultural_progress;

-- Rebuild indexes
REINDEX INDEX CONCURRENTLY idx_performances_cultural_search;
REINDEX INDEX CONCURRENTLY idx_user_progress_active;

-- Optimize slow queries
SET work_mem = '256MB';
SET maintenance_work_mem = '512MB';
EOF

# Redis optimization
echo "🔄 Optimizing Redis..."
redis-cli << EOF
CONFIG SET maxmemory-policy allkeys-lru
CONFIG SET save "900 1 300 10 60 10000"
BGREWRITEAOF
EOF

# CDN cache optimization
echo "☁️ Optimizing CDN cache..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Audio cache optimization
echo "🎵 Optimizing audio cache..."
node scripts/optimize-audio-cache.js

# Cultural content search optimization
echo "🎭 Optimizing cultural content search..."
psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW CONCURRENTLY cultural.search_index;"

echo "✅ Performance optimization completed"

# Generate performance report
node scripts/generate-performance-report.js > performance-report-$(date +%Y%m%d).json

echo "📈 Performance report generated"
```

### Cultural Content Validation Alerts

#### Cultural Content Monitoring
```typescript
// lib/cultural-monitoring.ts
interface CulturalAlert {
  type: 'accuracy' | 'sensitivity' | 'translation' | 'expert_review'
  severity: 'low' | 'medium' | 'high' | 'critical'
  contentId: string
  message: string
  culturalExpert?: string
  timestamp: Date
}

class CulturalContentMonitor {
  private alerts: CulturalAlert[] = []

  async validateCulturalAccuracy(contentId: string, content: any): Promise<void> {
    // Validate Chinese character encoding
    if (!this.isValidChineseEncoding(content.chinese)) {
      this.createAlert({
        type: 'accuracy',
        severity: 'high',
        contentId,
        message: 'Invalid Chinese character encoding detected',
        timestamp: new Date()
      })
    }

    // Validate cultural terminology
    const invalidTerms = this.validateCulturalTerms(content)
    if (invalidTerms.length > 0) {
      this.createAlert({
        type: 'accuracy',
        severity: 'medium',
        contentId,
        message: `Invalid cultural terms detected: ${invalidTerms.join(', ')}`,
        timestamp: new Date()
      })
    }

    // Check for cultural sensitivity issues
    const sensitivityIssues = await this.checkCulturalSensitivity(content)
    if (sensitivityIssues.length > 0) {
      this.createAlert({
        type: 'sensitivity',
        severity: 'critical',
        contentId,
        message: `Cultural sensitivity issues: ${sensitivityIssues.join(', ')}`,
        timestamp: new Date()
      })
    }
  }

  async validateTranslationQuality(contentId: string, original: string, translation: string): Promise<void> {
    // Check Shakespearean style consistency
    if (!this.isShakespeareanStyle(translation)) {
      this.createAlert({
        type: 'translation',
        severity: 'medium',
        contentId,
        message: 'Translation does not maintain Shakespearean style',
        timestamp: new Date()
      })
    }

    // Validate cultural context preservation
    const culturalContext = this.extractCulturalContext(original)
    const preservedContext = this.extractCulturalContext(translation)
    
    if (culturalContext.length !== preservedContext.length) {
      this.createAlert({
        type: 'translation',
        severity: 'high',
        contentId,
        message: 'Cultural context may be lost in translation',
        timestamp: new Date()
      })
    }
  }

  async checkExpertReviewStatus(contentId: string): Promise<void> {
    const content = await this.getContent(contentId)
    const daysSinceLastReview = this.calculateDaysSince(content.lastExpertReview)
    
    if (daysSinceLastReview > 90) {
      this.createAlert({
        type: 'expert_review',
        severity: 'medium',
        contentId,
        message: `Content requires expert review (${daysSinceLastReview} days since last review)`,
        timestamp: new Date()
      })
    }
  }

  private createAlert(alert: CulturalAlert): void {
    this.alerts.push(alert)
    this.sendAlert(alert)
  }

  private async sendAlert(alert: CulturalAlert): Promise<void> {
    // Send to Slack
    const slackMessage = {
      channel: '#cultural-alerts',
      text: `🎭 Cultural Alert: ${alert.message}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Cultural Content Alert*\n*Type:* ${alert.type}\n*Severity:* ${alert.severity}\n*Content:* ${alert.contentId}\n*Message:* ${alert.message}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Review Content' },
              url: `https://voices-of-kunqu.org/admin/cultural-content/${alert.contentId}`
            }
          ]
        }
      ]
    }

    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage)
    })

    // Send email to cultural experts for critical alerts
    if (alert.severity === 'critical') {
      await this.sendEmailAlert(alert)
    }
  }

  private isValidChineseEncoding(text: string): boolean {
    // Check for valid Unicode ranges for Chinese characters
    const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf]/
    return chineseRegex.test(text)
  }

  private validateCulturalTerms(content: any): string[] {
    // Validate against approved cultural terminology database
    const invalidTerms: string[] = []
    // Implementation would check against cultural terms database
    return invalidTerms
  }

  private async checkCulturalSensitivity(content: any): Promise<string[]> {
    // Check for potential cultural sensitivity issues
    const sensitivityIssues: string[] = []
    // Implementation would use AI/ML to detect sensitivity issues
    return sensitivityIssues
  }

  private isShakespeareanStyle(text: string): boolean {
    // Check for Shakespearean style elements
    const shakespeareanElements = [
      /\bthee\b/i, /\bthou\b/i, /\bthy\b/i, /\bthine\b/i,
      /\bhath\b/i, /\bdoth\b/i, /\b'tis\b/i, /\b'twas\b/i
    ]
    
    return shakespeareanElements.some(pattern => pattern.test(text))
  }

  private extractCulturalContext(text: string): string[] {
    // Extract cultural references and context
    const culturalTerms: string[] = []
    // Implementation would identify cultural terms and references
    return culturalTerms
  }

  private async getContent(contentId: string): Promise<any> {
    // Fetch content from database
    return {} // Implementation
  }

  private calculateDaysSince(date: Date): number {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  private async sendEmailAlert(alert: CulturalAlert): Promise<void> {
    // Send email notification for critical alerts
    // Implementation would use email service
  }
}

export const culturalMonitor = new CulturalContentMonitor()
```

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Database Connection Issues
```bash
# Problem: Database connection timeouts
# Solution: Check connection pool and database health

# Check database status
psql $DATABASE_URL -c "SELECT NOW();"

# Check connection count
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Restart connection pool
kill -HUP $(pgrep -f "node.*server")

# Scale database if needed
aws rds modify-db-instance \
  --db-instance-identifier voices-kunqu-production \
  --db-instance-class db.t3.small \
  --apply-immediately
```

#### Redis Cache Issues
```bash
# Problem: Redis memory or connection issues
# Solution: Clear cache and restart if needed

# Check Redis status
redis-cli ping

# Check memory usage
redis-cli info memory

# Clear cache if needed
redis-cli flushall

# Restart Redis (if using managed service)
aws elasticache reboot-cache-cluster \
  --cache-cluster-id voices-kunqu-redis
```

#### OpenAI API Issues
```bash
# Problem: TTS generation failures
# Solution: Check API status and quotas

# Test OpenAI API connectivity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Check API usage
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/usage

# Fallback to cached audio if available
node scripts/enable-audio-fallback.js
```

#### Performance Issues
```bash
# Problem: Slow page load times
# Solution: Optimize caching and performance

# Clear CDN cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Optimize database
psql $DATABASE_URL -c "VACUUM ANALYZE;"

# Check bundle size
npm run build
npx bundle-analyzer .next/static/chunks/*.js

# Enable performance mode
vercel env add ENABLE_PERFORMANCE_MODE production "true"
vercel deploy --prod
```

### Emergency Response Procedures

#### Site Down Emergency
```bash
#!/bin/bash
# scripts/emergency-response.sh

echo "🚨 EMERGENCY: Site down detected"

# Step 1: Verify outage
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://voices-of-kunqu.org)
if [ "$HTTP_STATUS" != "200" ]; then
    echo "❌ Site confirmed down (HTTP $HTTP_STATUS)"
else
    echo "✅ Site appears to be up"
    exit 0
fi

# Step 2: Check Vercel status
VERCEL_STATUS=$(vercel status --json | jq -r '.status')
echo "Vercel status: $VERCEL_STATUS"

# Step 3: Quick diagnostic
echo "🔍 Running diagnostics..."

# Check DNS
dig voices-of-kunqu.org +short

# Check SSL certificate
echo | openssl s_client -servername voices-of-kunqu.org -connect voices-of-kunqu.org:443 2>/dev/null | openssl x509 -noout -dates

# Check database
psql $DATABASE_URL -c "SELECT 1;" 2>/dev/null && echo "✅ Database OK" || echo "❌ Database down"

# Check Redis
redis-cli ping 2>/dev/null && echo "✅ Redis OK" || echo "❌ Redis down"

# Step 4: Emergency actions
echo "🚑 Taking emergency actions..."

# Enable maintenance mode with static content
vercel env add EMERGENCY_MODE production "true"
vercel deploy --prod --build-env EMERGENCY_MODE=true

# Rollback to last known good deployment if needed
LAST_GOOD_DEPLOYMENT=$(vercel list --json | jq -r '.[1].uid')
if [ -n "$LAST_GOOD_DEPLOYMENT" ]; then
    echo "🔄 Rolling back to deployment: $LAST_GOOD_DEPLOYMENT"
    vercel rollback $LAST_GOOD_DEPLOYMENT --timeout 60s
fi

# Send emergency notifications
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🚨 EMERGENCY: Site down - emergency response initiated","channel":"#incidents"}' \
  $SLACK_WEBHOOK_URL

echo "✅ Emergency response completed"
```

#### Data Loss Emergency
```bash
#!/bin/bash
# scripts/data-recovery.sh

RECOVERY_POINT=${1:-"latest"}  # latest|YYYYMMDD_HHMMSS

echo "🚨 EMERGENCY: Data recovery initiated"

# Step 1: Stop all writes
echo "🛑 Stopping write operations..."
vercel env add READ_ONLY_MODE production "true"
vercel deploy --prod

# Step 2: Assess data loss
echo "🔍 Assessing data loss..."
CURRENT_PERFORMANCE_COUNT=$(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM cultural.performances;")
CURRENT_USER_COUNT=$(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM users.profiles;")

echo "Current data: $CURRENT_PERFORMANCE_COUNT performances, $CURRENT_USER_COUNT users"

# Step 3: Identify backup to restore
if [ "$RECOVERY_POINT" == "latest" ]; then
    BACKUP_FILE=$(aws s3 ls s3://voices-kunqu-backups/database/ --recursive | sort | tail -n 1 | awk '{print $4}')
else
    BACKUP_FILE="database/database_$RECOVERY_POINT.sql.gz"
fi

echo "📁 Using backup: $BACKUP_FILE"

# Step 4: Download and verify backup
aws s3 cp "s3://voices-kunqu-backups/$BACKUP_FILE" ./emergency-restore.sql.gz

# Verify backup integrity
gunzip -t ./emergency-restore.sql.gz
if [ $? -ne 0 ]; then
    echo "❌ Backup file is corrupted"
    exit 1
fi

# Step 5: Create current state backup before restore
echo "💾 Creating emergency backup of current state..."
pg_dump $DATABASE_URL | gzip > "emergency-pre-restore-$(date +%Y%m%d_%H%M%S).sql.gz"

# Step 6: Restore from backup
echo "🔄 Restoring from backup..."
gunzip -c ./emergency-restore.sql.gz | psql $DATABASE_URL

# Step 7: Verify restoration
RESTORED_PERFORMANCE_COUNT=$(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM cultural.performances;")
RESTORED_USER_COUNT=$(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM users.profiles;")

echo "Restored data: $RESTORED_PERFORMANCE_COUNT performances, $RESTORED_USER_COUNT users"

# Step 8: Re-enable writes
echo "✅ Re-enabling write operations..."
vercel env rm READ_ONLY_MODE production
vercel deploy --prod

# Step 9: Verify system health
./scripts/verify-deployment.sh production

echo "✅ Data recovery completed"

# Send notification
curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"✅ Data recovery completed - restored $RESTORED_PERFORMANCE_COUNT performances and $RESTORED_USER_COUNT users\",\"channel\":\"#incidents\"}" \
  $SLACK_WEBHOOK_URL
```

---

## Documentation Maintenance

### Deployment Guide Updates

This deployment guide should be updated regularly to reflect:

1. **Infrastructure Changes:** Any modifications to AWS resources, Vercel configuration, or third-party services
2. **Security Updates:** New security requirements, vulnerability responses, or compliance changes
3. **Performance Optimizations:** New caching strategies, database optimizations, or CDN configurations
4. **Cultural Content Processes:** Updates to expert review workflows or content validation procedures
5. **Operational Procedures:** Changes to backup schedules, maintenance windows, or incident response

### Version History

- **v1.0 (2025-08-03):** Initial production deployment guide
- **v1.1 (TBD):** Post-launch optimizations and lessons learned
- **v1.2 (TBD):** Community features deployment updates
- **v2.0 (TBD):** International expansion infrastructure

---

**Production Readiness Status:** ✅ Ready for Deployment  
**Last Updated:** 2025-08-03  
**Next Review:** 2025-09-03  
**Deployment Contact:** Icarus (zhehongl91@gmail.com)

This comprehensive deployment guide ensures the Voices of Kunqu platform can be successfully deployed and maintained in production while preserving cultural authenticity, maintaining high performance, and providing an excellent user experience for cultural learners worldwide.