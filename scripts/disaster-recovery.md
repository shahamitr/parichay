# Disaster Recovery Procedures

## Overview

This document outlines the disaster recovery procedures for OneTouch BizCard platform. It provides step-by-step instructions for recovering from various failure scenarios including database corruption, data loss, infrastructure failures, and complete system outages.

## Table of Contents

1. [Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)](#recovery-time-objectives-rto-and-recovery-point-objectives-rpo)
2. [Backup Strategy](#backup-strategy)
3. [Disaster Scenarios and Recovery Procedures](#disaster-scenarios-and-recovery-procedures)
4. [Database Recovery](#database-recovery)
5. [File Storage Recovery](#file-storage-recovery)
6. [Complete System Recovery](#complete-system-recovery)
7. [Testing and Validation](#testing-and-validation)
8. [Emergency Contacts](#emergency-contacts)

---

## Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)

### Service Level Objectives

| Component | RTO (Recovery Time) | RPO (Data Loss) | Priority |
|-----------|---------------------|-----------------|----------|
| Database | 2 hours | 15 minutes | Critical |
| File Storage | 4 hours | 1 hour | High |
| Application | 1 hour | N/A | Critical |
| Redis Cache | 30 minutes | N/A (can rebuild) | Medium |
| Analytics Data | 24 hours | 24 hours | Low |

### Definitions

- **RTO (Recovery Time Objective)**: Maximum acceptable time to restore service after a disaster
- **RPO (Recovery Point Objective)**: Maximum acceptable amount of data loss measured in time

---

## Backup Strategy

### Automated Backups

#### Database Backups

**Frequency**: Every 6 hours + continuous WAL archiving

**Retention Policy**:
- Hourly backups: 7 days
- Daily backups: 30 days
- Weekly backups: 90 days
- Monthly backups: 1 year

**Storage Locations**:
- Primary: AWS S3 (onetouch-bizcard-backups/database/)
- Secondary: Local backup server (/var/backups/onetouch-bizcard/)

**Backup Script**: `/scripts/backup-database.sh`

```bash
# Manual backup trigger
./scripts/backup-database.sh

# Automated via cron (runs every 6 hours)
0 */6 * * * /path/to/scripts/backup-database.sh >> /var/log/backup-database.log 2>&1
```

#### File Storage Backups

**Frequency**: Daily at 2:00 AM UTC

**Retention Policy**:
- Daily backups: 30 days
- Weekly backups: 90 days

**Storage Locations**:
- Primary: AWS S3 (onetouch-bizcard-backups/files/)
- Secondary: Glacier for long-term retention

**Backup Script**: `/scripts/backup-files.sh`

```bash
# Manual backup trigger
./scripts/backup-files.sh

# Automated via cron (runs daily at 2 AM)
0 2 * * * /path/to/scripts/backup-files.sh >> /var/log/backup-files.log 2>&1
```

### Backup Verification

**Weekly Verification Process**:
1. Restore latest backup to staging environment
2. Run integrity checks
3. Verify data completeness
4. Document results

```bash
# Automated verification script
./scripts/verify-backup.sh
```

---

## Disaster Scenarios and Recovery Procedures

### Scenario 1: Database Corruption

**Symptoms**:
- Database connection errors
- Data inconsistency errors
- Application crashes related to database queries

**Recovery Steps**:

1. **Assess the Damage**
   ```bash
   # Connect to database
   psql "$DATABASE_URL"

   # Check for corruption
   SELECT * FROM pg_stat_database;

   # Identify corrupted tables
   REINDEX DATABASE onetouch_bizcard_prod;
   ```

2. **Stop Application**
   ```bash
   # If using PM2
   pm2 stop onetouch-bizcard

   # If using Docker
   docker-compose down

   # If using Vercel
   # Disable deployment in Vercel dashboard
   ```

3. **Create Emergency Backup**
   ```bash
   # Even if corrupted, backup current state
   pg_dump "$DATABASE_URL" > emergency_backup_$(date +%Y%m%d_%H%M%S).sql
   ```

4. **Restore from Latest Backup**
   ```bash
   # List available backups
   aws s3 ls s3://onetouch-bizcard-backups/database/

   # Download latest backup
   aws s3 cp s3://onetouch-bizcard-backups/database/onetouch_bizcard_backup_YYYYMMDD_HHMMSS.sql.gz ./

   # Restore database
   ./scripts/restore-database.sh onetouch_bizcard_backup_YYYYMMDD_HHMMSS.sql.gz
   ```

5. **Verify Data Integrity**
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM brands;"
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM branches;"
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;"
   ```

6. **Restart Application**
   ```bash
   pm2 start onetouch-bizcard
   pm2 logs onetouch-bizcard
   ```

7. **Monitor for Issues**
   - Check application logs
   - Verify user login functionality
   - Test critical workflows (microsite creation, payment processing)

**Estimated Recovery Time**: 1-2 hours

---

### Scenario 2: Complete Data Loss

**Symptoms**:
- Database server failure
- Storage volume corruption
- Accidental data deletion

**Recovery Steps**:

1. **Activate Incident Response**
   - Notify team via emergency contacts
   - Document incident start time
   - Assess scope of data loss

2. **Provision New Database Instance**
   ```bash
   # If using AWS RDS
   # Create new RDS instance from latest snapshot
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier onetouch-bizcard-recovery \
     --db-snapshot-identifier onetouch-bizcard-snapshot-latest

   # Wait for instance to be available
   aws rds wait db-instance-available \
     --db-instance-identifier onetouch-bizcard-recovery
   ```

3. **Restore Database from Backup**
   ```bash
   # Get new database connection string
   NEW_DATABASE_URL="postgresql://user:pass@new-host:5432/database"

   # Download latest backup
   aws s3 cp s3://onetouch-bizcard-backups/database/onetouch_bizcard_backup_latest.sql.gz ./

   # Restore to new instance
   gunzip -c onetouch_bizcard_backup_latest.sql.gz | psql "$NEW_DATABASE_URL"
   ```

4. **Update Application Configuration**
   ```bash
   # Update DATABASE_URL in environment
   # If using Vercel
   vercel env rm DATABASE_URL production
   vercel env add DATABASE_URL production
   # Enter new database URL

   # If using PM2
   # Update .env.production
   nano .env.production
   # Update DATABASE_URL

   # Restart application
   pm2 restart onetouch-bizcard
   ```

5. **Verify System Functionality**
   - Test user authentication
   - Verify microsite rendering
   - Check payment processing
   - Validate analytics data

6. **Restore File Storage** (if affected)
   ```bash
   # Sync from backup bucket
   aws s3 sync s3://onetouch-bizcard-backups/files/latest/ s3://onetouch-bizcard-production/
   ```

**Estimated Recovery Time**: 2-4 hours

---

### Scenario 3: Infrastructure Failure

**Symptoms**:
- Complete service outage
- Cloud provider regional failure
- Network connectivity issues

**Recovery Steps**:

1. **Activate Disaster Recovery Site**
   - Switch DNS to backup region
   - Activate standby infrastructure

2. **Deploy Application to New Region**
   ```bash
   # Clone repository
   git clone https://github.com/your-org/onetouch-bizcard.git
   cd onetouch-bizcard

   # Install dependencies
   npm ci

   # Generate Prisma client
   npx prisma generate

   # Build application
   npm run build
   ```

3. **Restore Database in New Region**
   ```bash
   # Create new database instance in backup region
   # Restore from S3 backup
   aws s3 cp s3://onetouch-bizcard-backups/database/onetouch_bizcard_backup_latest.sql.gz ./
   gunzip -c onetouch_bizcard_backup_latest.sql.gz | psql "$NEW_DATABASE_URL"
   ```

4. **Configure Redis in New Region**
   ```bash
   # Create new Redis instance
   # Update REDIS_URL in environment
   ```

5. **Sync File Storage**
   ```bash
   # Create new S3 bucket in backup region
   aws s3 mb s3://onetouch-bizcard-production-backup --region us-west-2

   # Sync from backup
   aws s3 sync s3://onetouch-bizcard-backups/files/latest/ \
     s3://onetouch-bizcard-production-backup/
   ```

6. **Update DNS Records**
   ```bash
   # Point domain to new infrastructure
   # Update A/CNAME records to new load balancer/server
   ```

7. **Deploy Application**
   ```bash
   # Deploy to new infrastructure
   vercel --prod
   # Or
   pm2 start npm --name "onetouch-bizcard" -- start
   ```

**Estimated Recovery Time**: 4-8 hours

---

### Scenario 4: Ransomware Attack

**Symptoms**:
- Encrypted files
- Ransom demands
- Unauthorized access detected

**Recovery Steps**:

1. **Immediate Actions**
   - Disconnect affected systems from network
   - Preserve evidence (do not delete anything)
   - Contact law enforcement
   - Notify security team

2. **Isolate Infection**
   ```bash
   # Disable all API keys
   # Revoke all access tokens
   # Change all passwords

   # Terminate compromised instances
   aws ec2 terminate-instances --instance-ids i-xxxxx
   ```

3. **Assess Backup Integrity**
   ```bash
   # Check if backups are encrypted
   aws s3 ls s3://onetouch-bizcard-backups/database/ --recursive

   # Download and verify backup
   aws s3 cp s3://onetouch-bizcard-backups/database/onetouch_bizcard_backup_YYYYMMDD_HHMMSS.sql.gz ./
   gunzip -t onetouch_bizcard_backup_YYYYMMDD_HHMMSS.sql.gz
   ```

4. **Provision Clean Infrastructure**
   - Create new AWS account or isolated VPC
   - Deploy fresh infrastructure
   - Use clean, verified backups only

5. **Restore from Pre-Infection Backup**
   ```bash
   # Identify last known good backup (before infection)
   # Restore database
   ./scripts/restore-database.sh onetouch_bizcard_backup_YYYYMMDD_HHMMSS.sql.gz

   # Restore files
   aws s3 sync s3://onetouch-bizcard-backups/files/YYYYMMDD_HHMMSS/ \
     s3://onetouch-bizcard-production-new/
   ```

6. **Security Hardening**
   - Update all dependencies
   - Patch all vulnerabilities
   - Implement additional security measures
   - Enable MFA on all accounts
   - Review and update access controls

7. **Gradual Service Restoration**
   - Start with read-only mode
   - Verify no malicious code
   - Gradually enable write operations
   - Monitor closely for 48 hours

**Estimated Recovery Time**: 24-48 hours

---

## Database Recovery

### Point-in-Time Recovery (PITR)

If you need to recover to a specific point in time:

```bash
# List available WAL archives
aws s3 ls s3://onetouch-bizcard-backups/wal-archives/

# Restore base backup
gunzip -c onetouch_bizcard_backup_base.sql.gz | psql "$DATABASE_URL"

# Apply WAL files up to desired point
# This requires PostgreSQL WAL archiving to be configured
```

### Partial Data Recovery

If only specific tables are affected:

```bash
# Restore specific table from backup
pg_restore -t brands onetouch_bizcard_backup.dump | psql "$DATABASE_URL"

# Or using SQL dump
psql "$DATABASE_URL" -c "DROP TABLE IF EXISTS brands CASCADE;"
psql "$DATABASE_URL" < brands_backup.sql
```

### Data Validation After Recovery

```sql
-- Check record counts
SELECT 'brands' as table_name, COUNT(*) as count FROM brands
UNION ALL
SELECT 'branches', COUNT(*) FROM branches
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions;

-- Check data integrity
SELECT * FROM brands WHERE logo IS NULL OR name IS NULL;
SELECT * FROM branches WHERE brand_id NOT IN (SELECT id FROM brands);

-- Verify recent data
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 10;
```

---

## File Storage Recovery

### Full S3 Bucket Restoration

```bash
# Restore entire bucket from backup
aws s3 sync s3://onetouch-bizcard-backups/files/YYYYMMDD_HHMMSS/ \
  s3://onetouch-bizcard-production/ \
  --delete

# Verify restoration
aws s3 ls s3://onetouch-bizcard-production/ --recursive | wc -l
```

### Selective File Recovery

```bash
# Restore specific directory
aws s3 sync s3://onetouch-bizcard-backups/files/YYYYMMDD_HHMMSS/logos/ \
  s3://onetouch-bizcard-production/logos/

# Restore single file
aws s3 cp s3://onetouch-bizcard-backups/files/YYYYMMDD_HHMMSS/path/to/file.jpg \
  s3://onetouch-bizcard-production/path/to/file.jpg
```

### Verify File Integrity

```bash
# Compare file counts
echo "Backup files:"
aws s3 ls s3://onetouch-bizcard-backups/files/latest/ --recursive | wc -l
echo "Production files:"
aws s3 ls s3://onetouch-bizcard-production/ --recursive | wc -l

# Generate checksums
aws s3api list-objects-v2 --bucket onetouch-bizcard-production \
  --query 'Contents[].{Key:Key,ETag:ETag}' --output json > production-checksums.json
```

---

## Complete System Recovery

### Full System Rebuild

**Prerequisites**:
- Access to backup storage
- Cloud provider credentials
- Domain DNS access
- SSL certificates

**Step-by-Step Recovery**:

1. **Provision Infrastructure** (30 minutes)
   ```bash
   # Create database instance
   # Create Redis instance
   # Create S3 buckets
   # Set up load balancer
   ```

2. **Restore Database** (1 hour)
   ```bash
   ./scripts/restore-database.sh onetouch_bizcard_backup_latest.sql.gz
   ```

3. **Restore File Storage** (2 hours)
   ```bash
   ./scripts/restore-files.sh
   ```

4. **Deploy Application** (30 minutes)
   ```bash
   git clone https://github.com/your-org/onetouch-bizcard.git
   cd onetouch-bizcard
   npm ci
   npm run build
   npm run db:migrate
   pm2 start npm --name "onetouch-bizcard" -- start
   ```

5. **Configure DNS** (15 minutes + propagation time)
   ```bash
   # Update A records to new infrastructure
   # Wait for DNS propagation (up to 48 hours)
   ```

6. **Verify and Test** (1 hour)
   - Run health checks
   - Test critical workflows
   - Verify data integrity
   - Monitor logs

**Total Estimated Time**: 4-6 hours (excluding DNS propagation)

---

## Testing and Validation

### Monthly Disaster Recovery Drill

**Schedule**: First Sunday of each month at 2:00 AM UTC

**Procedure**:

1. **Preparation**
   - Notify team 48 hours in advance
   - Prepare staging environment
   - Document start time

2. **Execution**
   ```bash
   # Restore latest backup to staging
   ./scripts/dr-drill.sh
   ```

3. **Validation**
   - Verify all services start correctly
   - Test user authentication
   - Test microsite rendering
   - Test payment processing (test mode)
   - Verify analytics data

4. **Documentation**
   - Record recovery time
   - Document any issues encountered
   - Update procedures if needed

5. **Cleanup**
   - Tear down test environment
   - Archive drill results

### Recovery Metrics to Track

| Metric | Target | Last Test | Status |
|--------|--------|-----------|--------|
| Database Recovery Time | < 2 hours | - | Pending |
| File Recovery Time | < 4 hours | - | Pending |
| Full System Recovery | < 6 hours | - | Pending |
| Data Loss (RPO) | < 15 minutes | - | Pending |
| Backup Success Rate | > 99% | - | Pending |

### Backup Verification Script

Create `scripts/verify-backup.sh`:

```bash
#!/bin/bash
# Backup Verification Script
# Tests backup integrity by restoring to staging environment

set -e

STAGING_DB_URL="${STAGING_DATABASE_URL}"
BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

echo "Starting backup verification..."
echo "Backup file: $BACKUP_FILE"
echo "Target: Staging environment"

# Restore to staging
gunzip -c "$BACKUP_FILE" | psql "$STAGING_DB_URL"

# Run integrity checks
psql "$STAGING_DB_URL" -c "SELECT COUNT(*) FROM brands;"
psql "$STAGING_DB_URL" -c "SELECT COUNT(*) FROM branches;"
psql "$STAGING_DB_URL" -c "SELECT COUNT(*) FROM users;"

echo "✅ Backup verification completed successfully"
```

---

## Emergency Contacts

### Internal Team

| Role | Name | Phone | Email | Availability |
|------|------|-------|-------|--------------|
| System Administrator | [Name] | [Phone] | [Email] | 24/7 |
| Database Administrator | [Name] | [Phone] | [Email] | 24/7 |
| DevOps Lead | [Name] | [Phone] | [Email] | 24/7 |
| Security Officer | [Name] | [Phone] | [Email] | 24/7 |
| CTO | [Name] | [Phone] | [Email] | On-call |

### External Vendors

| Service | Contact | Phone | Email | Support Level |
|---------|---------|-------|-------|---------------|
| AWS Support | - | - | - | Enterprise |
| Database Hosting | - | - | - | Premium |
| CDN Provider | - | - | - | Business |
| Security Consultant | - | - | - | On-demand |

### Escalation Path

1. **Level 1**: On-call engineer (responds within 15 minutes)
2. **Level 2**: DevOps lead (responds within 30 minutes)
3. **Level 3**: CTO (responds within 1 hour)
4. **Level 4**: External consultants (responds within 4 hours)

---

## Post-Recovery Procedures

### Immediate Actions (Within 24 hours)

1. **Incident Report**
   - Document what happened
   - Timeline of events
   - Root cause analysis
   - Recovery actions taken

2. **Communication**
   - Notify affected users
   - Update status page
   - Send post-mortem to stakeholders

3. **Verification**
   - Run comprehensive tests
   - Verify data integrity
   - Check all integrations

### Follow-up Actions (Within 1 week)

1. **Post-Mortem Meeting**
   - Review incident response
   - Identify improvements
   - Update procedures

2. **Security Review**
   - Audit access logs
   - Review security measures
   - Implement additional safeguards

3. **Documentation Update**
   - Update runbooks
   - Improve monitoring
   - Enhance alerting

---

## Continuous Improvement

### Quarterly Reviews

- Review and update disaster recovery procedures
- Test new recovery scenarios
- Update contact information
- Review and adjust RTO/RPO targets
- Audit backup integrity

### Annual Audit

- Full disaster recovery simulation
- Third-party security assessment
- Infrastructure review
- Compliance verification
- Budget review for DR resources

---

## Appendix

### Useful Commands

```bash
# Check database size
psql "$DATABASE_URL" -c "SELECT pg_size_pretty(pg_database_size('onetouch_bizcard_prod'));"

# Check S3 bucket size
aws s3 ls s3://onetouch-bizcard-production --recursive --summarize --human-readable

# List recent backups
aws s3 ls s3://onetouch-bizcard-backups/database/ --recursive --human-readable | tail -20

# Test database connection
psql "$DATABASE_URL" -c "SELECT version();"

# Test Redis connection
redis-cli -u "$REDIS_URL" PING

# Check application health
curl https://onetouchbizcard.in/api/health
```

### Recovery Checklist

- [ ] Incident documented with start time
- [ ] Team notified via emergency contacts
- [ ] Affected systems identified
- [ ] Backup integrity verified
- [ ] Recovery procedure selected
- [ ] Pre-recovery backup created
- [ ] Recovery executed
- [ ] Data integrity verified
- [ ] Services restarted
- [ ] Monitoring enabled
- [ ] Users notified
- [ ] Post-mortem scheduled
- [ ] Documentation updated

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Next Review**: [Date + 3 months]
**Owner**: DevOps Team