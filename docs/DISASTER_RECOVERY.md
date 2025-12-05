# Disaster Recovery Runbook

## Overview

This runbook provides step-by-step procedures for recovering the OneTouch BizCard platform from various disaster scenarios.

## Recovery Objectives

- **RTO (Recovery Time Objective)**: 2 hours
- **RPO (Recovery Point Objective)**: 1 hour (based on backup frequency)

## Backup Strategy

### Automated Backups

**Database Backups:**
- Frequency: Every 6 hours
- Retention: 30 days
- Location: AWS S3 + Local storage
- Format: Compressed SQL dumps (.sql.gz)

**File Storage Backups:**
- Frequency: Daily at 2 AM UTC
- Retention: 30 days
- Location: AWS S3 versioning enabled
- Format: Incremental sync

**Configuration Backups:**
- Frequency: On every deployment
- Retention: 90 days
- Location: Git repository + S3
- Format: Environment files (encrypted)

### Backup Verification

Run weekly backup verification:

```bash
./scripts/verify-backups.sh
```

## Disaster Scenarios

### Scenario 1: Database Failure

**Symptoms:**
- Application cannot connect to database
- Database queries timing out
- Data corruption detected

**Recovery Steps:**

1. **Assess the situation**
   ```bash
   # Check database connectivity
   ./scripts/test-database.sh

   # Check database logs
   tail -f /var/log/postgresql/postgresql.log
   ```

2. **Identify latest valid backup**
   ```bash
   # List available backups
   ls -lh ./backups/database/

   # Or from S3
   aws s3 ls s3://onetouch-bizcard-prod-backups/database/
   ```

3. **Download backup (if from S3)**
   ```bash
   aws s3 cp s3://onetouch-bizcard-prod-backups/database/latest.sql.gz ./backups/database/
   ```

4. **Stop application**
   ```bash
   pm2 stop onetouch-bizcard
   ```

5. **Restore database**
   ```bash
   ./scripts/restore-database.sh ./backups/database/onetouch_bizcard_YYYYMMDD_HHMMSS.sql.gz
   ```

6. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

7. **Verify data integrity**
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM \"Brand\";"
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM \"Branch\";"
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM \"User\";"
   ```

8. **Start application**
   ```bash
   pm2 start onetouch-bizcard
   ```

9. **Verify application health**
   ```bash
   curl https://onetouchbizcard.in/api/health
   ```

**Estimated Recovery Time:** 30-60 minutes

### Scenario 2: Complete Server Failure

**Symptoms:**
- Server is unreachable
- Hardware failure
- Data center outage

**Recovery Steps:**

1. **Provision new server**
   - Launch new EC2 instance or equivalent
   - Configure security groups and networking
   - Install required software (Node.js, PostgreSQL client, Redis client)

2. **Clone application repository**
   ```bash
   git clone https://github.com/your-org/onetouch-bizcard.git
   cd onetouch-bizcard
   npm install
   ```

3. **Restore environment configuration**
   ```bash
   # Download encrypted .env.production from S3
   aws s3 cp s3://onetouch-bizcard-prod-backups/config/.env.production.enc ./

   # Decrypt (using your encryption key)
   openssl enc -d -aes-256-cbc -in .env.production.enc -out .env.production
   ```

4. **Restore database**
   ```bash
   # Download latest backup
   aws s3 cp s3://onetouch-bizcard-prod-backups/database/latest.sql.gz ./backups/database/

   # Restore
   ./scripts/restore-database.sh ./backups/database/latest.sql.gz
   ```

5. **Restore file storage**
   ```bash
   # Files are already in S3, just verify connectivity
   ./scripts/test-s3.sh
   ```

6. **Build and start application**
   ```bash
   npm run build
   pm2 start npm --name "onetouch-bizcard" -- start
   pm2 save
   ```

7. **Update DNS**
   - Point domain to new server IP
   - Wait for DNS propagation (5-30 minutes)

8. **Verify all services**
   ```bash
   ./scripts/verify-production.sh
   ```

**Estimated Recovery Time:** 1-2 hours

### Scenario 3: Data Corruption

**Symptoms:**
- Incorrect data in database
- Missing records
- Corrupted files

**Recovery Steps:**

1. **Identify corruption scope**
   ```bash
   # Check database integrity
   psql "$DATABASE_URL" -c "SELECT * FROM \"Brand\" WHERE \"updatedAt\" > NOW() - INTERVAL '24 hours';"
   ```

2. **Stop application to prevent further corruption**
   ```bash
   pm2 stop onetouch-bizcard
   ```

3. **Create snapshot of current state**
   ```bash
   ./scripts/backup-database.sh
   ```

4. **Restore from point-in-time backup**
   ```bash
   # Find backup before corruption occurred
   ls -lh ./backups/database/

   # Restore
   ./scripts/restore-database.sh ./backups/database/onetouch_bizcard_YYYYMMDD_HHMMSS.sql.gz
   ```

5. **Verify restored data**
   ```bash
   # Run data validation queries
   psql "$DATABASE_URL" -f ./scripts/validate-data.sql
   ```

6. **Restart application**
   ```bash
   pm2 start onetouch-bizcard
   ```

**Estimated Recovery Time:** 30-45 minutes

### Scenario 4: Redis Cache Failure

**Symptoms:**
- Slow application performance
- Redis connection errors
- Cache misses

**Recovery Steps:**

1. **Verify Redis status**
   ```bash
   ./scripts/test-redis.sh
   ```

2. **Restart Redis service**
   ```bash
   sudo systemctl restart redis
   ```

3. **If Redis is unrecoverable, provision new instance**
   - Launch new Redis instance
   - Update REDIS_URL in .env.production
   - Restart application

4. **Warm up cache**
   ```bash
   # Cache will rebuild automatically as users access the site
   # Or manually warm critical data
   curl https://onetouchbizcard.in/api/cache/warmup
   ```

**Estimated Recovery Time:** 15-30 minutes

### Scenario 5: S3 Storage Issues

**Symptoms:**
- File upload failures
- Missing images
- S3 access denied errors

**Recovery Steps:**

1. **Verify S3 connectivity**
   ```bash
   aws s3 ls s3://onetouch-bizcard-prod-assets/
   ```

2. **Check IAM permissions**
   ```bash
   aws iam get-user-policy --user-name onetouch-bizcard-prod --policy-name S3Access
   ```

3. **If bucket is corrupted, restore from backup**
   ```bash
   # S3 versioning should be enabled
   # Restore deleted objects
   aws s3api list-object-versions --bucket onetouch-bizcard-prod-assets
   ```

4. **Verify CloudFront distribution**
   ```bash
   curl -I https://d1234567890.cloudfront.net/test-image.jpg
   ```

**Estimated Recovery Time:** 20-40 minutes

## Communication Plan

### Internal Communication

**Incident Detected:**
1. Alert on-call engineer via PagerDuty/Slack
2. Create incident channel: #incident-YYYYMMDD
3. Notify engineering team

**During Recovery:**
1. Post updates every 15 minutes in incident channel
2. Update status page
3. Notify stakeholders of ETA

**Post-Recovery:**
1. Conduct post-mortem within 48 hours
2. Document lessons learned
3. Update runbook with improvements

### External Communication

**Status Page Updates:**
- Initial: "We're investigating an issue affecting [service]"
- During: "We're working on restoring [service]. ETA: [time]"
- Resolved: "Service has been restored. We're monitoring for stability."

**Customer Notifications:**
- Email critical customers if downtime > 30 minutes
- Post on social media if downtime > 1 hour
- Provide incident report within 24 hours of resolution

## Testing and Drills

### Quarterly DR Drill

Run full disaster recovery drill:

```bash
./scripts/dr-drill.sh
```

This will:
1. Create fresh backups
2. Simulate disaster (in staging)
3. Restore from backup
4. Verify data integrity
5. Measure RTO/RPO
6. Document results

### Monthly Backup Verification

```bash
./scripts/verify-backups.sh
```

Verify:
- Backups are being created
- Backups are not corrupted
- Restore process works
- Backup retention is correct

## Escalation Procedures

### Level 1: On-Call Engineer
- Initial response
- Follow runbook procedures
- Escalate if needed

### Level 2: Senior Engineer
- Complex issues
- Multiple system failures
- Escalate to Level 3 if needed

### Level 3: Engineering Manager + CTO
- Critical business impact
- Extended outage (> 2 hours)
- Data loss scenarios

## Contact Information

**On-Call Rotation:**
- Check PagerDuty schedule

**Key Contacts:**
- Engineering Manager: [phone]
- CTO: [phone]
- DevOps Lead: [phone]
- Database Admin: [phone]

**External Vendors:**
- AWS Support: [phone/ticket]
- Database Hosting: [phone/ticket]
- CDN Provider: [phone/ticket]

## Post-Incident Checklist

After recovery:

- [ ] Verify all services are operational
- [ ] Check data integrity
- [ ] Review logs for root cause
- [ ] Update monitoring alerts
- [ ] Schedule post-mortem meeting
- [ ] Document incident timeline
- [ ] Update runbook with lessons learned
- [ ] Communicate resolution to stakeholders
- [ ] Review and improve backup procedures
- [ ] Test restored system under load

## Appendix

### Useful Commands

```bash
# Check system status
./scripts/verify-production.sh

# View application logs
pm2 logs onetouch-bizcard

# Check database connections
psql "$DATABASE_URL" -c "SELECT count(*) FROM pg_stat_activity;"

# Check Redis memory
redis-cli -u "$REDIS_URL" INFO memory

# Check S3 bucket size
aws s3 ls s3://onetouch-bizcard-prod-assets --recursive --summarize

# Force cache clear
redis-cli -u "$REDIS_URL" FLUSHALL
```

### Backup Locations

- **Database**: `s3://onetouch-bizcard-prod-backups/database/`
- **Files**: `s3://onetouch-bizcard-prod-assets/` (versioned)
- **Config**: `s3://onetouch-bizcard-prod-backups/config/`
- **Local**: `./backups/`

### Recovery Time Tracking

Document actual recovery times for continuous improvement:

| Date | Scenario | RTO Target | Actual RTO | Notes |
|------|----------|------------|------------|-------|
| | | 2 hours | | |
