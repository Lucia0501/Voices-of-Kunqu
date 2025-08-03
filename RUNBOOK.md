# Production Runbook: Voices of Kunqu

**Project:** Voices of Kunqu Cultural Educational Platform  
**Document Type:** Operational Procedures & Incident Response  
**SRE Team:** Site Reliability Engineering  
**Version:** 1.0  
**Date:** 2025-08-03  
**Emergency Contact:** [On-call rotation details in PagerDuty]

---

## Emergency Response Overview

### Critical Contact Information

```yaml
emergency_contacts:
  primary_oncall: "PagerDuty rotation: voices-of-kunqu-primary"
  cultural_expert_emergency: "cultural-experts@voices-of-kunqu.org"
  security_incidents: "security@voices-of-kunqu.org"
  
escalation_path:
  level_1: "On-call SRE (immediate response required)"
  level_2: "Senior SRE + Team Lead (< 30 minutes)"
  level_3: "Engineering Director + Cultural Advisory Board (< 1 hour)"
  level_4: "Executive Team + External Experts (< 2 hours)"

cultural_emergency_contacts:
  kunqu_expert_primary: "Dr. Li Wei (Cambridge) - +44-xxx-xxx-xxxx"
  translation_expert: "Prof. Sarah Thompson (Oxford) - +44-xxx-xxx-xxxx"
  cultural_sensitivity: "Cultural Advisory Board Chair - emergency line"
```

### Incident Classification & Response Times

```typescript
interface IncidentClassification {
  severity1_critical: {
    examples: [
      "Complete system outage",
      "Cultural content corruption or misrepresentation",
      "Data breach or security incident",
      "Accessibility compliance failure"
    ]
    responseTime: "< 15 minutes acknowledgment, < 1 hour resolution start"
    escalation: "Immediate Level 3 escalation"
  }
  
  severity2_high: {
    examples: [
      "Major feature unavailability",
      "TTS service complete failure",
      "Database performance degradation",
      "Expert validation system failure"
    ]
    responseTime: "< 30 minutes acknowledgment, < 2 hours resolution start"
    escalation: "Level 2 escalation if not resolved in 1 hour"
  }
  
  severity3_medium: {
    examples: [
      "Performance degradation",
      "Partial feature failure",
      "Audio quality issues",
      "Search functionality problems"
    ]
    responseTime: "< 1 hour acknowledgment, < 4 hours resolution start"
    escalation: "Standard on-call response"
  }
  
  severity4_low: {
    examples: [
      "Minor UI issues",
      "Non-critical feature bugs",
      "Cosmetic problems",
      "Enhancement requests"
    ]
    responseTime: "< 4 hours acknowledgment, next business day resolution"
    escalation: "Standard development queue"
  }
}
```

---

## System Health Checks

### Daily Health Verification

#### Automated Health Check Script
```bash
#!/bin/bash
# Daily Health Check - Voices of Kunqu Platform
# Run every morning at 06:00 GMT

echo "=== Voices of Kunqu Health Check - $(date) ==="

# 1. Check main application health
echo "1. Checking application health..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://voices-of-kunqu.org/api/health)
if [ $response -eq 200 ]; then
    echo "✅ Application health: OK"
else
    echo "❌ Application health: FAILED (HTTP $response)"
    # Trigger alert
fi

# 2. Check database connectivity
echo "2. Checking database connectivity..."
db_check=$(psql $DATABASE_URL -c "SELECT 1;" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Database connectivity: OK"
else
    echo "❌ Database connectivity: FAILED"
    # Trigger alert
fi

# 3. Check Redis cache
echo "3. Checking Redis cache..."
redis_check=$(redis-cli -u $REDIS_URL ping 2>/dev/null)
if [ "$redis_check" = "PONG" ]; then
    echo "✅ Redis cache: OK"
else
    echo "❌ Redis cache: FAILED"
    # Trigger alert
fi

# 4. Check OpenAI TTS service
echo "4. Checking OpenAI TTS service..."
tts_check=$(curl -s -H "Authorization: Bearer $OPENAI_API_KEY" \
    https://api.openai.com/v1/models/tts-1 -o /dev/null -w "%{http_code}")
if [ $tts_check -eq 200 ]; then
    echo "✅ OpenAI TTS service: OK"
else
    echo "❌ OpenAI TTS service: FAILED (HTTP $tts_check)"
    # Trigger alert
fi

# 5. Check cultural content integrity
echo "5. Checking cultural content integrity..."
content_check=$(curl -s https://voices-of-kunqu.org/api/cultural-content/health)
if echo "$content_check" | grep -q "healthy"; then
    echo "✅ Cultural content: OK"
else
    echo "❌ Cultural content: Integrity check failed"
    # Trigger cultural expert alert
fi

# 6. Check accessibility features
echo "6. Checking accessibility features..."
accessibility_check=$(curl -s https://voices-of-kunqu.org/api/accessibility/health)
if echo "$accessibility_check" | grep -q "wcag_compliant"; then
    echo "✅ Accessibility features: OK"
else
    echo "❌ Accessibility features: Compliance issue detected"
    # Trigger accessibility team alert
fi

echo "=== Health Check Complete ==="
```

#### Cultural Content Integrity Verification
```sql
-- Daily Cultural Content Integrity Check
-- Run against production database daily

-- 1. Check for performances without expert validation
SELECT 
    id, 
    title_english, 
    status, 
    created_at
FROM performances 
WHERE status = 'PUBLISHED' 
  AND reviewed_by IS NULL;

-- 2. Verify cultural validation completeness
SELECT 
    p.id,
    p.title_english,
    COUNT(cv.id) as validation_count
FROM performances p
LEFT JOIN cultural_validations cv ON p.id = cv.performance_id
WHERE p.status = 'PUBLISHED'
GROUP BY p.id, p.title_english
HAVING COUNT(cv.id) = 0;

-- 3. Check for broken audio-text mappings
SELECT 
    id,
    title_english,
    jsonb_array_length(audio_segments) as audio_count,
    jsonb_array_length(acts) as act_count
FROM performances
WHERE status = 'PUBLISHED'
  AND (audio_segments IS NULL OR jsonb_array_length(audio_segments) = 0);

-- 4. Verify glossary term pronunciation coverage
SELECT 
    id,
    term_english,
    term_chinese
FROM glossary_terms
WHERE pronunciation_audio_url IS NULL
  AND difficulty != 'BEGINNER';
```

---

## Incident Response Procedures

### Critical System Outage Response

#### Complete System Down Procedure
```bash
# CRITICAL: Complete System Outage Response
# Execute immediately upon detection

# 1. Incident Declaration (< 5 minutes)
echo "Step 1: Incident Declaration"
# - Create incident in PagerDuty
# - Notify on-call team
# - Update status page: https://status.voices-of-kunqu.org
# - Notify cultural expert team if content-related

# 2. Immediate Assessment (< 10 minutes)
echo "Step 2: Immediate Assessment"

# Check Vercel deployment status
vercel deployments --team voices-of-kunqu

# Check database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Check external service dependencies
curl -I https://api.openai.com/v1/models
curl -I https://voices-of-kunqu.s3.amazonaws.com

# 3. Traffic Routing (< 15 minutes)
echo "Step 3: Traffic Routing"
# Enable maintenance mode if needed
# Activate backup systems if available
# Redirect to status page with cultural context

# 4. Root Cause Investigation (parallel to recovery)
echo "Step 4: Root Cause Investigation"
# Check application logs
vercel logs --team voices-of-kunqu

# Check database logs
# Check infrastructure monitoring
# Document findings for post-incident review

# 5. Recovery Actions
echo "Step 5: Recovery Actions"
# Follow specific recovery procedures based on root cause
# Test recovery before full traffic restoration
# Validate cultural content integrity post-recovery

# 6. Post-Recovery Verification
echo "Step 6: Post-Recovery Verification"
# Run health checks
# Verify cultural content accessibility
# Test critical user journeys
# Monitor for secondary issues
```

#### Database Emergency Procedures
```sql
-- Database Emergency Response Procedures

-- 1. Database Health Check
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - pg_stat_activity.query_start > interval '5 minutes'
ORDER BY duration DESC;

-- 2. Kill long-running queries (if safe)
-- CAUTION: Only kill non-critical queries
-- NEVER kill cultural content validation queries
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - pg_stat_activity.query_start > interval '10 minutes'
  AND query NOT LIKE '%cultural%'
  AND query NOT LIKE '%validation%'
  AND pid != pg_backend_pid();

-- 3. Check database locks
SELECT 
    t.relname,
    l.locktype,
    l.page,
    l.virtualtransaction,
    l.pid,
    l.mode,
    l.granted
FROM pg_locks l, pg_stat_all_tables t
WHERE l.relation = t.relid
ORDER BY relation ASC;

-- 4. Emergency read-only mode (if needed)
-- Use only for cultural content protection
ALTER DATABASE voices_of_kunqu SET default_transaction_read_only = on;

-- 5. Database recovery verification
-- After recovery, verify cultural content integrity
SELECT COUNT(*) FROM performances WHERE status = 'PUBLISHED';
SELECT COUNT(*) FROM glossary_terms;
SELECT COUNT(*) FROM cultural_validations;
```

### Cultural Content Emergency Response

#### Cultural Accuracy Incident Procedure
```bash
# CULTURAL EMERGENCY: Content Accuracy Issue
# This procedure has ZERO tolerance for cultural misrepresentation

# 1. Immediate Content Isolation (< 5 minutes)
echo "CULTURAL EMERGENCY: Isolating content immediately"

# Identify affected content
content_id="$1"  # Passed as parameter
echo "Isolating content ID: $content_id"

# Remove from public access immediately
psql $DATABASE_URL -c "
UPDATE performances 
SET status = 'ARCHIVED' 
WHERE id = '$content_id';"

# Clear from all caches
redis-cli -u $REDIS_URL FLUSHDB

# 2. Expert Notification (< 10 minutes)
echo "Notifying cultural experts immediately"
# Send emergency notification to cultural expert team
# Include content details and reported issue
curl -X POST https://api.slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -d channel="#cultural-experts-emergency" \
  -d text="CULTURAL EMERGENCY: Content accuracy issue detected for content ID: $content_id"

# 3. Content Analysis (< 30 minutes)
echo "Beginning content analysis"
# Export affected content for expert review
psql $DATABASE_URL -c "
COPY (
  SELECT 
    id, title_chinese, title_english, 
    cultural_significance, shakespearean_parallels,
    acts, characters
  FROM performances 
  WHERE id = '$content_id'
) TO STDOUT WITH CSV HEADER;" > /tmp/cultural_emergency_$content_id.csv

# 4. Expert Validation Process
echo "Initiating emergency expert validation"
# Create emergency validation ticket
# Assign to senior Kunqu scholars
# Set priority for immediate review

# 5. Communication Plan
echo "Executing communication plan"
# Update status page with cultural sensitivity
# Notify affected users with cultural context
# Prepare public communication if needed

# 6. Recovery Planning
echo "Planning content recovery"
# Work with experts to determine:
# - Content revision requirements
# - Re-validation process
# - Publication timeline
# - Community communication strategy
```

#### Expert Validation System Failure
```bash
# Expert Validation System Emergency

# 1. System Status Check
echo "Checking expert validation system status"

# Check validation service health
curl -f https://voices-of-kunqu.org/api/admin/validation/health || echo "Validation service DOWN"

# Check expert access
psql $DATABASE_URL -c "
SELECT 
    u.id, u.name, u.email, u.role,
    COUNT(cv.id) as recent_validations
FROM users u
LEFT JOIN cultural_validations cv ON u.id = cv.validator_id 
    AND cv.created_at > NOW() - INTERVAL '24 hours'
WHERE u.role = 'CULTURAL_EXPERT'
GROUP BY u.id, u.name, u.email, u.role;"

# 2. Emergency Validation Process
echo "Activating emergency validation process"

# Halt all new content publication
psql $DATABASE_URL -c "
UPDATE performances 
SET status = 'CULTURAL_REVIEW' 
WHERE status = 'EXPERT_VALIDATION';"

# 3. Expert Communication
echo "Notifying expert community"
# Send emergency communication to all cultural experts
# Explain situation and alternative validation process
# Provide manual validation procedures if needed

# 4. Manual Validation Procedures
echo "Implementing manual validation procedures"
# Create manual validation checklist
# Set up alternative communication channels
# Document all manual validations for system restoration

# 5. System Recovery
echo "Planning system recovery"
# Identify root cause of validation system failure
# Implement fixes with expert testing
# Restore automated validation with backlog processing
```

---

## Performance Issue Troubleshooting

### High Response Time Investigation

#### Performance Diagnostics Script
```bash
#!/bin/bash
# Performance Issue Investigation - Voices of Kunqu

echo "=== Performance Investigation Started ==="

# 1. Application Performance Check
echo "1. Checking application performance..."
curl -w "@curl-format.txt" -s -o /dev/null https://voices-of-kunqu.org/api/performances

# 2. Database Performance Analysis
echo "2. Analyzing database performance..."
psql $DATABASE_URL -c "
SELECT 
    calls,
    total_time,
    mean_time,
    stddev_time,
    substring(query, 1, 80) as query_preview
FROM pg_stat_statements 
WHERE mean_time > 100
ORDER BY mean_time DESC 
LIMIT 10;"

# 3. Redis Performance Check
echo "3. Checking Redis performance..."
redis-cli -u $REDIS_URL --latency-history -i 1

# 4. TTS Service Performance
echo "4. Checking TTS service performance..."
start_time=$(date +%s%N)
curl -s -X POST https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"tts-1","input":"Test","voice":"nova"}' \
  -o /tmp/tts_test.mp3
end_time=$(date +%s%N)
tts_duration=$(( (end_time - start_time) / 1000000 ))
echo "TTS generation time: ${tts_duration}ms"

# 5. CDN Performance Check
echo "5. Checking CDN performance..."
curl -w "@curl-format.txt" -s -o /dev/null https://d1234567890.cloudfront.net/test-asset.jpg

# 6. Cultural Content Specific Performance
echo "6. Checking cultural content performance..."
psql $DATABASE_URL -c "
SELECT 
    'performances' as table_name,
    pg_size_pretty(pg_total_relation_size('performances')) as size,
    COUNT(*) as record_count
FROM performances
UNION ALL
SELECT 
    'glossary_terms' as table_name,
    pg_size_pretty(pg_total_relation_size('glossary_terms')) as size,
    COUNT(*) as record_count
FROM glossary_terms;"

echo "=== Performance Investigation Complete ==="
```

#### Slow Query Optimization
```sql
-- Slow Query Investigation and Optimization

-- 1. Find slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    (total_time / calls) as avg_time_ms
FROM pg_stat_statements 
WHERE mean_time > 100
ORDER BY total_time DESC
LIMIT 20;

-- 2. Check missing indexes for cultural content
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation,
    most_common_vals
FROM pg_stats 
WHERE tablename IN ('performances', 'glossary_terms', 'user_progress', 'audio_cache')
  AND (n_distinct > 100 OR correlation < 0.1)
ORDER BY tablename, correlation;

-- 3. Analyze cultural search performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM performances 
WHERE search_vector @@ plainto_tsquery('english', 'kunqu opera');

-- 4. Check for table bloat
SELECT 
    schemaname,
    tablename,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_dead_tup,
    CASE 
        WHEN n_tup_ins + n_tup_upd + n_tup_del > 0 
        THEN (n_dead_tup::float / (n_tup_ins + n_tup_upd + n_tup_del)) * 100 
        ELSE 0 
    END as bloat_percentage
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY bloat_percentage DESC;

-- 5. Emergency index creation for performance issues
-- Cultural content search optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performances_search_complex 
ON performances USING GIN (
    to_tsvector('english', 
        title_english || ' ' || 
        description || ' ' || 
        cultural_significance
    )
);

-- User progress optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_progress_performance 
ON user_progress (user_id, performance_id, last_accessed DESC);

-- Audio cache optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audio_cache_access_pattern 
ON audio_cache (text_hash, last_accessed DESC)
WHERE access_count > 0;
```

### Memory & Resource Issues

#### Memory Leak Investigation
```bash
#!/bin/bash
# Memory Leak Investigation

echo "=== Memory Investigation Started ==="

# 1. Check Vercel function memory usage
echo "1. Checking Vercel function memory usage..."
vercel logs --team voices-of-kunqu | grep -i "memory\|timeout\|out of memory"

# 2. Database memory usage
echo "2. Checking database memory usage..."
psql $DATABASE_URL -c "
SELECT 
    name,
    setting,
    unit,
    context
FROM pg_settings 
WHERE name IN (
    'shared_buffers',
    'work_mem',
    'maintenance_work_mem',
    'max_connections'
);"

# 3. Redis memory usage
echo "3. Checking Redis memory usage..."
redis-cli -u $REDIS_URL INFO memory

# 4. Audio cache size analysis
echo "4. Analyzing audio cache size..."
psql $DATABASE_URL -c "
SELECT 
    COUNT(*) as total_audio_files,
    SUM(file_size_bytes) as total_size_bytes,
    pg_size_pretty(SUM(file_size_bytes)) as total_size_pretty,
    AVG(file_size_bytes) as avg_file_size,
    MAX(last_accessed) as most_recent_access,
    MIN(last_accessed) as oldest_access
FROM audio_cache;"

# 5. Large cultural content analysis
echo "5. Analyzing large cultural content..."
psql $DATABASE_URL -c "
SELECT 
    id,
    title_english,
    pg_column_size(acts) as acts_size,
    pg_column_size(characters) as characters_size,
    pg_column_size(audio_segments) as audio_segments_size,
    pg_column_size(acts) + pg_column_size(characters) + pg_column_size(audio_segments) as total_size
FROM performances
ORDER BY total_size DESC
LIMIT 10;"

echo "=== Memory Investigation Complete ==="
```

---

## Backup & Recovery Procedures

### Emergency Recovery Procedures

#### Database Recovery Process
```bash
#!/bin/bash
# Database Emergency Recovery

echo "=== Database Recovery Process Started ==="

# 1. Assess database state
echo "1. Assessing current database state..."
psql $DATABASE_URL -c "SELECT version();" || echo "Database connection failed"

# 2. Identify latest backup
echo "2. Identifying latest backup..."
aws s3 ls s3://voices-of-kunqu-backups/database/ --recursive | sort | tail -5

# 3. Cultural content integrity verification
echo "3. Verifying cultural content integrity before recovery..."
backup_date=$(date +%Y%m%d_%H%M%S)
psql $DATABASE_URL -c "
COPY (
    SELECT 
        id, title_english, status, version,
        updated_at, reviewed_by
    FROM performances 
    WHERE status = 'PUBLISHED'
) TO STDOUT WITH CSV HEADER;" > /tmp/pre_recovery_performances_$backup_date.csv

# 4. Create recovery point
echo "4. Creating recovery point before restoration..."
pg_dump $DATABASE_URL > /tmp/pre_recovery_backup_$backup_date.sql

# 5. Recovery execution
echo "5. Executing database recovery..."
# Download latest backup
latest_backup=$(aws s3 ls s3://voices-of-kunqu-backups/database/ --recursive | sort | tail -1 | awk '{print $4}')
aws s3 cp s3://voices-of-kunqu-backups/$latest_backup /tmp/recovery_backup.sql

# Restore database (use with extreme caution)
# psql $DATABASE_URL < /tmp/recovery_backup.sql

# 6. Post-recovery validation
echo "6. Validating recovery..."
psql $DATABASE_URL -c "
SELECT 
    'performances' as table_name,
    COUNT(*) as record_count,
    MAX(updated_at) as latest_update
FROM performances
UNION ALL
SELECT 
    'cultural_validations' as table_name,
    COUNT(*) as record_count,
    MAX(updated_at) as latest_update
FROM cultural_validations;"

# 7. Cultural expert notification
echo "7. Notifying cultural experts of recovery..."
# Send notification to cultural expert team
# Request post-recovery content validation
# Provide recovery summary and validation requirements

echo "=== Database Recovery Process Complete ==="
```

#### Cultural Content Recovery
```bash
#!/bin/bash
# Cultural Content Emergency Recovery

echo "=== Cultural Content Recovery Started ==="

# 1. Assess cultural content integrity
echo "1. Assessing cultural content integrity..."
psql $DATABASE_URL -c "
SELECT 
    status,
    COUNT(*) as count,
    COUNT(CASE WHEN reviewed_by IS NOT NULL THEN 1 END) as validated_count
FROM performances
GROUP BY status;"

# 2. Identify corrupted or missing content
echo "2. Identifying integrity issues..."
psql $DATABASE_URL -c "
SELECT 
    id,
    title_english,
    status,
    CASE 
        WHEN acts IS NULL THEN 'Missing acts'
        WHEN characters IS NULL THEN 'Missing characters'
        WHEN cultural_significance = '' THEN 'Missing cultural context'
        WHEN reviewed_by IS NULL AND status = 'PUBLISHED' THEN 'Missing expert validation'
        ELSE 'OK'
    END as issue
FROM performances
WHERE acts IS NULL 
   OR characters IS NULL 
   OR cultural_significance = ''
   OR (reviewed_by IS NULL AND status = 'PUBLISHED');"

# 3. Emergency content restoration
echo "3. Restoring cultural content from backup..."
# Restore from Git repository (cultural content is version controlled)
cd /tmp
git clone https://github.com/voices-of-kunqu/cultural-content-backup.git
cd cultural-content-backup

# 4. Validate restored content with experts
echo "4. Initiating expert validation for restored content..."
# Create emergency validation tickets
# Assign to senior cultural experts
# Mark all restored content for re-validation

# 5. Update content status appropriately
echo "5. Updating content status post-recovery..."
psql $DATABASE_URL -c "
UPDATE performances 
SET status = 'CULTURAL_REVIEW'
WHERE status = 'PUBLISHED' 
  AND updated_at > NOW() - INTERVAL '1 hour';"

echo "=== Cultural Content Recovery Complete ==="
```

### System Recovery Validation

#### Post-Recovery Health Check
```bash
#!/bin/bash
# Post-Recovery System Validation

echo "=== Post-Recovery Validation Started ==="

# 1. Core system functionality
echo "1. Validating core system functionality..."

# Test authentication
auth_test=$(curl -s -X POST https://voices-of-kunqu.org/api/auth/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}' | jq -r '.status')
echo "Authentication test: $auth_test"

# Test cultural content access
content_test=$(curl -s https://voices-of-kunqu.org/api/performances?limit=1 | jq -r '.data[0].id // "FAILED"')
echo "Cultural content access: $content_test"

# Test TTS generation
tts_test=$(curl -s -X POST https://voices-of-kunqu.org/api/tts/test \
  -H "Content-Type: application/json" \
  -d '{"text": "Test recovery", "options": {"voice": "nova"}}' | jq -r '.status // "FAILED"')
echo "TTS generation test: $tts_test"

# 2. Cultural content integrity verification
echo "2. Verifying cultural content integrity..."
psql $DATABASE_URL -c "
SELECT 
    COUNT(*) as total_performances,
    COUNT(CASE WHEN status = 'PUBLISHED' THEN 1 END) as published_count,
    COUNT(CASE WHEN reviewed_by IS NOT NULL THEN 1 END) as validated_count,
    COUNT(CASE WHEN acts IS NOT NULL AND characters IS NOT NULL THEN 1 END) as complete_content
FROM performances;"

# 3. User data integrity check
echo "3. Checking user data integrity..."
psql $DATABASE_URL -c "
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'CULTURAL_EXPERT' THEN 1 END) as expert_count,
    COUNT(CASE WHEN last_active > NOW() - INTERVAL '7 days' THEN 1 END) as active_users
FROM users;"

# 4. Performance validation
echo "4. Validating system performance..."
response_time=$(curl -w "%{time_total}" -s -o /dev/null https://voices-of-kunqu.org)
echo "Homepage response time: ${response_time}s"

# 5. Accessibility feature validation
echo "5. Validating accessibility features..."
accessibility_test=$(curl -s https://voices-of-kunqu.org/api/accessibility/validate | jq -r '.wcag_compliant // false')
echo "WCAG compliance: $accessibility_test"

# 6. Expert notification and validation request
echo "6. Requesting expert validation..."
# Notify cultural experts of recovery completion
# Request comprehensive content validation
# Provide recovery summary and any identified issues

echo "=== Post-Recovery Validation Complete ==="
```

---

## Maintenance Procedures

### Scheduled Maintenance Windows

#### Monthly Maintenance Checklist
```bash
#!/bin/bash
# Monthly Maintenance - Voices of Kunqu Platform

echo "=== Monthly Maintenance Started - $(date) ==="

# 1. System Updates
echo "1. Performing system updates..."

# Update dependencies (in staging first)
npm audit fix
npm update

# Database maintenance
psql $DATABASE_URL -c "VACUUM ANALYZE;"
psql $DATABASE_URL -c "REINDEX DATABASE voices_of_kunqu;"

# 2. Cultural Content Audit
echo "2. Performing cultural content audit..."

# Check for content requiring validation
psql $DATABASE_URL -c "
SELECT 
    id, title_english, status, updated_at
FROM performances 
WHERE status IN ('CULTURAL_REVIEW', 'TRANSLATION_REVIEW')
  AND updated_at < NOW() - INTERVAL '30 days';"

# Verify expert validation coverage
psql $DATABASE_URL -c "
SELECT 
    p.id, p.title_english,
    COUNT(cv.id) as validation_count,
    MAX(cv.updated_at) as last_validation
FROM performances p
LEFT JOIN cultural_validations cv ON p.id = cv.performance_id
WHERE p.status = 'PUBLISHED'
GROUP BY p.id, p.title_english
HAVING COUNT(cv.id) < 2 OR MAX(cv.updated_at) < NOW() - INTERVAL '90 days';"

# 3. Audio Cache Optimization
echo "3. Optimizing audio cache..."

# Clean up old, unused audio files
psql $DATABASE_URL -c "
DELETE FROM audio_cache 
WHERE last_accessed < NOW() - INTERVAL '90 days'
  AND access_count < 5;"

# Update cache statistics
psql $DATABASE_URL -c "
UPDATE audio_cache 
SET last_accessed = NOW() 
WHERE text_hash IN (
    SELECT DISTINCT audio_segments->>'textHash' 
    FROM performances, jsonb_array_elements(audio_segments) 
    WHERE status = 'PUBLISHED'
);"

# 4. Performance Optimization
echo "4. Performing performance optimization..."

# Update database statistics
psql $DATABASE_URL -c "ANALYZE;"

# Check for missing indexes
psql $DATABASE_URL -c "
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename IN ('performances', 'user_progress', 'glossary_terms')
  AND n_distinct > 100 
  AND correlation < 0.1;"

# 5. Security Audit
echo "5. Performing security audit..."

# Check for inactive expert accounts
psql $DATABASE_URL -c "
SELECT 
    id, name, email, last_active
FROM users 
WHERE role = 'CULTURAL_EXPERT'
  AND last_active < NOW() - INTERVAL '90 days';"

# Audit API key usage
echo "Checking API key rotation schedule..."
# Verify OpenAI API key rotation
# Check AWS access key age
# Review authentication token security

# 6. Backup Verification
echo "6. Verifying backup integrity..."

# Test database backup restoration
latest_backup=$(aws s3 ls s3://voices-of-kunqu-backups/database/ | sort | tail -1 | awk '{print $4}')
echo "Latest backup: $latest_backup"

# Verify cultural content backup
git -C /backup/cultural-content fetch origin
git -C /backup/cultural-content status

# 7. Monitoring and Alerting Review
echo "7. Reviewing monitoring and alerting..."

# Check alert fatigue metrics
# Review SLO achievement
# Update monitoring thresholds if needed
# Test critical alert paths

echo "=== Monthly Maintenance Complete - $(date) ==="
```

#### Database Maintenance
```sql
-- Monthly Database Maintenance

-- 1. Performance optimization
VACUUM (ANALYZE, VERBOSE) performances;
VACUUM (ANALYZE, VERBOSE) user_progress;
VACUUM (ANALYZE, VERBOSE) audio_cache;
VACUUM (ANALYZE, VERBOSE) cultural_validations;

-- 2. Index maintenance
REINDEX INDEX CONCURRENTLY idx_performances_search;
REINDEX INDEX CONCURRENTLY idx_user_progress_user_id;
REINDEX INDEX CONCURRENTLY idx_audio_cache_text_hash;

-- 3. Statistics update
ANALYZE performances;
ANALYZE user_progress;
ANALYZE audio_cache;
ANALYZE glossary_terms;

-- 4. Storage optimization
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 5. Cultural content integrity check
SELECT 
    'Performances without expert validation' as check_type,
    COUNT(*) as count
FROM performances 
WHERE status = 'PUBLISHED' AND reviewed_by IS NULL

UNION ALL

SELECT 
    'Glossary terms without pronunciation' as check_type,
    COUNT(*) as count
FROM glossary_terms 
WHERE pronunciation_audio_url IS NULL

UNION ALL

SELECT 
    'Orphaned audio cache entries' as check_type,
    COUNT(*) as count
FROM audio_cache 
WHERE performance_id NOT IN (SELECT id FROM performances);
```

---

## Security Incident Response

### Security Breach Response

#### Security Incident Procedure
```bash
#!/bin/bash
# Security Incident Response - Voices of Kunqu

echo "=== SECURITY INCIDENT RESPONSE ACTIVATED ==="

# 1. Immediate Containment (< 15 minutes)
echo "1. IMMEDIATE CONTAINMENT"

# Block suspicious traffic if identified
# iptables rules or cloudflare security rules
echo "Reviewing access logs for suspicious activity..."

# Check for unauthorized access to cultural content
psql $DATABASE_URL -c "
SELECT 
    u.email, u.role, u.last_active,
    COUNT(p.id) as performances_accessed
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN performances p ON up.performance_id = p.id
WHERE u.last_active > NOW() - INTERVAL '24 hours'
  AND u.role NOT IN ('USER', 'CULTURAL_EXPERT')
GROUP BY u.id, u.email, u.role, u.last_active
ORDER BY performances_accessed DESC;"

# 2. Assessment and Investigation (< 30 minutes)
echo "2. ASSESSMENT AND INVESTIGATION"

# Check authentication logs for breaches
psql $DATABASE_URL -c "
SELECT 
    user_id, session_token, expires, 
    created_at, updated_at
FROM sessions 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;"

# Check for unauthorized cultural content modifications
psql $DATABASE_URL -c "
SELECT 
    id, title_english, status, updated_at, reviewed_by
FROM performances 
WHERE updated_at > NOW() - INTERVAL '24 hours'
  AND reviewed_by IS NULL
ORDER BY updated_at DESC;"

# 3. Cultural Content Protection (Immediate)
echo "3. CULTURAL CONTENT PROTECTION"

# Freeze all cultural content modifications
psql $DATABASE_URL -c "
UPDATE performances 
SET status = 'ARCHIVED'
WHERE status IN ('DRAFT', 'CULTURAL_REVIEW', 'TRANSLATION_REVIEW')
  AND updated_at > NOW() - INTERVAL '24 hours';"

# Backup current cultural content state
pg_dump $DATABASE_URL --table=performances > /tmp/security_incident_cultural_backup_$(date +%Y%m%d_%H%M%S).sql

# 4. Expert Notification (< 45 minutes)
echo "4. EXPERT NOTIFICATION"

# Notify cultural expert team of security incident
# Request immediate content validation
# Activate emergency validation procedures

# 5. System Hardening (Immediate)
echo "5. SYSTEM HARDENING"

# Force password reset for all privileged accounts
psql $DATABASE_URL -c "
UPDATE users 
SET password = NULL
WHERE role IN ('CULTURAL_EXPERT', 'MODERATOR', 'ADMIN');"

# Invalidate all active sessions
psql $DATABASE_URL -c "DELETE FROM sessions;"

# Rotate API keys
echo "API key rotation required - manual process"
echo "1. Rotate OpenAI API key"
echo "2. Rotate AWS access keys"
echo "3. Rotate database credentials"
echo "4. Update Vercel environment variables"

# 6. Communication Plan
echo "6. COMMUNICATION PLAN"

# Internal communication
echo "Notifying internal teams..."

# User communication (if needed)
echo "Preparing user communication..."

# Legal and compliance notification
echo "Initiating legal and compliance procedures..."

echo "=== SECURITY INCIDENT RESPONSE PROCEDURES INITIATED ==="
echo "Manual intervention required for:"
echo "- API key rotation"
echo "- Cultural expert validation"
echo "- Legal compliance reporting"
echo "- User communication (if data affected)"
```

#### Cultural Content Security Validation
```sql
-- Cultural Content Security Audit

-- 1. Check for unauthorized content modifications
SELECT 
    p.id,
    p.title_english,
    p.status,
    p.updated_at,
    p.reviewed_by,
    u.email as reviewer_email,
    u.role as reviewer_role
FROM performances p
LEFT JOIN users u ON p.reviewed_by = u.id
WHERE p.updated_at > NOW() - INTERVAL '7 days'
  AND (p.reviewed_by IS NULL OR u.role != 'CULTURAL_EXPERT')
ORDER BY p.updated_at DESC;

-- 2. Verify cultural validation integrity
SELECT 
    cv.performance_id,
    cv.validator_id,
    u.email as validator_email,
    cv.historical_accuracy,
    cv.cultural_authenticity,
    cv.approved,
    cv.created_at
FROM cultural_validations cv
JOIN users u ON cv.validator_id = u.id
WHERE cv.created_at > NOW() - INTERVAL '7 days'
  AND u.role != 'CULTURAL_EXPERT'
ORDER BY cv.created_at DESC;

-- 3. Check for data integrity issues
SELECT 
    'performances' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN acts IS NULL THEN 1 END) as missing_acts,
    COUNT(CASE WHEN characters IS NULL THEN 1 END) as missing_characters,
    COUNT(CASE WHEN cultural_significance = '' THEN 1 END) as missing_cultural_context
FROM performances

UNION ALL

SELECT 
    'glossary_terms' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN definition = '' THEN 1 END) as missing_definitions,
    COUNT(CASE WHEN cultural_significance = '' THEN 1 END) as missing_cultural_context,
    0 as unused_column
FROM glossary_terms;

-- 4. Audit user privilege escalations
SELECT 
    id, email, role, created_at, updated_at, last_active
FROM users 
WHERE role IN ('CULTURAL_EXPERT', 'MODERATOR', 'ADMIN')
  AND (updated_at > NOW() - INTERVAL '30 days' OR created_at > NOW() - INTERVAL '30 days')
ORDER BY updated_at DESC;
```

---

## Cost Management & Optimization

### OpenAI TTS Cost Monitoring

#### Daily Cost Tracking
```bash
#!/bin/bash
# Daily TTS Cost Monitoring

echo "=== TTS Cost Monitoring - $(date) ==="

# 1. Calculate daily TTS costs
echo "1. Calculating daily TTS costs..."
psql $DATABASE_URL -c "
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_generations,
    SUM(generation_cost) as total_cost,
    AVG(generation_cost) as avg_cost,
    SUM(CASE WHEN access_count > 1 THEN generation_cost ELSE 0 END) as reused_cost,
    SUM(CASE WHEN access_count = 1 THEN generation_cost ELSE 0 END) as single_use_cost
FROM audio_cache 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;"

# 2. Identify cost optimization opportunities
echo "2. Identifying cost optimization opportunities..."
psql $DATABASE_URL -c "
SELECT 
    'High-cost, low-reuse' as category,
    COUNT(*) as count,
    SUM(generation_cost) as total_cost
FROM audio_cache 
WHERE generation_cost > 0.01 
  AND access_count < 3
  AND created_at > NOW() - INTERVAL '30 days'

UNION ALL

SELECT 
    'Potential caching failures' as category,
    COUNT(*) as count,
    SUM(generation_cost) as total_cost
FROM audio_cache a1
WHERE EXISTS (
    SELECT 1 FROM audio_cache a2 
    WHERE a1.text_content = a2.text_content 
      AND a1.id != a2.id
      AND a2.created_at > a1.created_at
);"

# 3. Check cache hit rate
echo "3. Checking cache hit rate..."
# This would be implemented in application code
# Track cache hits vs misses for TTS requests

# 4. Budget alerts
echo "4. Checking budget status..."
daily_cost=$(psql $DATABASE_URL -t -c "
SELECT COALESCE(SUM(generation_cost), 0) 
FROM audio_cache 
WHERE created_at >= CURRENT_DATE;")

daily_budget="16.67"  # £500/month = £16.67/day
if (( $(echo "$daily_cost > $daily_budget" | bc -l) )); then
    echo "⚠️  Daily budget exceeded: £$daily_cost > £$daily_budget"
    # Trigger alert
else
    echo "✅ Daily budget on track: £$daily_cost / £$daily_budget"
fi

echo "=== TTS Cost Monitoring Complete ==="
```

#### Cost Optimization Actions
```sql
-- TTS Cost Optimization Queries

-- 1. Identify duplicate audio generations
SELECT 
    text_content,
    COUNT(*) as generation_count,
    SUM(generation_cost) as total_cost,
    MIN(created_at) as first_generation,
    MAX(created_at) as last_generation
FROM audio_cache 
GROUP BY text_content 
HAVING COUNT(*) > 1
ORDER BY total_cost DESC;

-- 2. Find unused expensive audio
SELECT 
    id,
    text_content,
    generation_cost,
    access_count,
    last_accessed,
    EXTRACT(days FROM NOW() - last_accessed) as days_since_access
FROM audio_cache 
WHERE generation_cost > 0.01
  AND access_count < 2
  AND last_accessed < NOW() - INTERVAL '30 days'
ORDER BY generation_cost DESC;

-- 3. Cache hit rate analysis
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_requests,
    SUM(CASE WHEN access_count > 1 THEN 1 ELSE 0 END) as cache_hits,
    SUM(CASE WHEN access_count = 1 THEN 1 ELSE 0 END) as cache_misses,
    ROUND(
        (SUM(CASE WHEN access_count > 1 THEN 1 ELSE 0 END)::float / COUNT(*)) * 100, 2
    ) as hit_rate_percentage
FROM audio_cache 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 4. Performance vs cost optimization
SELECT 
    performance_id,
    p.title_english,
    COUNT(ac.id) as audio_segments,
    SUM(ac.generation_cost) as total_cost,
    SUM(ac.access_count) as total_access,
    AVG(ac.access_count) as avg_reuse
FROM audio_cache ac
JOIN performances p ON ac.performance_id = p.id
WHERE ac.created_at > NOW() - INTERVAL '30 days'
GROUP BY performance_id, p.title_english
ORDER BY total_cost DESC;
```

This comprehensive runbook provides detailed operational procedures for maintaining the reliability, performance, and cultural integrity of the Voices of Kunqu platform. The procedures prioritize cultural content authenticity alongside technical excellence, ensuring that this unique educational platform operates effectively while serving its cultural mission.