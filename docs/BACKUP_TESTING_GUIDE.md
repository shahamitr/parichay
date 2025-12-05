# Backup and Disaster Recovery Testing Guide

## Overview

This guide provides step-by-step instructions for testing and validating the backup and disaster recovery procedures for OneTouch BizCard. All tests should be performed in a staging environment before production deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Test Environment Setup](#test-environment-setup)
3. [Database Backup Testing](#database-backup-testing)
4. [File Storage Backup Testing](#file-storage-backup-testing)
5. [Disaster Recovery Drill](#disaster-recovery-drill)
6. [Validation Checklist](#validation-checklist)
7. [Test Results Documentation](#test-results-documentation)

---

## Prerequisites

### Required Access

- [ ] SSH access to production/staging servers
- [ ] AWS CLI configured with appropriate credentials
- [ ] PostgreSQL client tools installed (`psql`, `pg_dump`)
- [ ] Access to AWS S3 backup buckets
- [ ] Database connection credentials

### Environment Variables

Ensure the following environment variables are set:

```bash
export DATABASE_URL="postgresql://user:password@host:5432/database"
export AWS_S3_BUCKET="onetouch-bizcard-production"
export AWS_S3_BACKUP_BUCKET="onetouch-bizcard-backups"
export BACKUP_DIR="/var/backups/onetouch-bizcard"
export RETENTION_DAYS="30"
```

### Tools Installation

```bash
# Install PostgreSQL client tools
sudo apt-get install postgresql-client

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installations
psql --version
aws --version
```

---

## Test Environment Setup

### 1. Create Staging Database

```bash
# Create staging database
createdb onetouch_bizcard_staging

# Set staging database URL
export STAGING_DATABASE_URL="postgresql://user:password@host:5432/onetouch_bizcard_staging"
```

### 2. Populate Test Data

```bash
# Clone production schema to staging
pg_dump "$DATABASE_URL" --schema-only | psql "$STAGING_DATABASE_URL"

# Or use seed data
cd onetouch-bizcard
npx prisma db seed
```

### 3. Create Test S3 Buckets

```bash
# Create staging backup bucket
aws s3 mb s3://onetouch-bizcard-backups-staging --region ap-south-1

# Set staging bucket
export AWS_S3_BACKUP_BUCKET="onetouch-bizcard-backups-staging"
```

---

## Database Backup Testing

### Test 1: Manual Backup Creation

**Objective**: Verify that the backup script creates a valid database backup.

**Steps**:

1. Run the backup script:
   ```bash
   cd onetouch-bizcard/scripts
   chmod +x backup-database.sh
   ./backup-database.sh
   ```

2. Verify backup file creation:
   ```bash
   ls -lh /var/backups/onetouch-bizcard/
   ```

3. Check backup file integrity:
   ```bash
   gunzip -t /var/backups/onetouch-bizcard/onetouch_bizcard_backup_*.sql.gz
   echo $?  # Should return 0 for success
   ```

4. Verify S3 upload:
   ```bash
   aws s3 ls s3://onetouch-bizcard-backups/database/
   ```

**Expected Results**:
- ✅ Backup file created in local directory
- ✅ Backup file is valid gzip format
- ✅ Backup uploaded to S3 successfully
- ✅ Backup size is reasonable (> 1KB)

**Test Status**: [ ] Pass [ ] Fail

**Notes**:
```
Backup file: _______________
File size: _______________
S3 upload time: _______________
Issues encountered: _______________
```

---

### Test 2: Automated Backup Schedule

**Objective**: Verify that automated backups run on schedule.

**Steps**:

1. Set up cron job for testing (every 5 minutes):
   ```bash
   crontab -e
   # Add: */5 * * * * /path/to/scripts/backup-database.sh >> /var/log/backup-database.log 2>&1
   ```

2. Wait for 10 minutes and check logs:
   ```bash
   tail -f /var/log/backup-database.log
   ```

3. Verify multiple backups were created:
   ```bash
   ls -lt /var/backups/onetouch-bizcard/ | head -5
   ```

4. Remove test cron job:
   ```bash
   crontab -e
   # Remove the test entry
   ```

**Expected Results**:
- ✅ Cron job executes successfully
- ✅ Multiple backup files created
- ✅ No errors in log file
- ✅ Each backup has unique timestamp

**Test Status**: [ ] Pass [ ] Fail

**Notes**:
```
Number of backups created: _______________
Cron execution time: _______________
Issues encountered: _______________
```

---

### Test 3: Backup Restoration

**Objective**: Verify that backups can be successfully restored.

**Steps**:

1. Create a test backup:
   ```bash
   ./backup-database.sh
   BACKUP_FILE=$(ls -t /var/backups/onetouch-bizcard/onetouch_bizcard_backup_*.sql.gz | head -1)
   echo "Testing with: $BACKUP_FILE"
   ```

2. Record current database state:
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM brands;" > /tmp/before_restore.txt
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM branches;" >> /tmp/before_restore.txt
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;" >> /tmp/before_restore.txt
   ```

3. Restore the backup:
   ```bash
   ./restore-database.sh $(basename $BACKUP_FILE)
   ```

4. Verify restored data:
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM brands;" > /tmp/after_restore.txt
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM branches;" >> /tmp/after_restore.txt
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;" >> /tmp/after_restore.txt

   diff /tmp/before_restore.txt /tmp/after_restore.txt
   ```

5. Test application functionality:
   ```bash
   curl http://localhost:3000/api/health
   ```

**Expected Results**:
- ✅ Restore completes without errors
- ✅ Record counts match before and after
- ✅ Application starts successfully
- ✅ Pre-restore backup is created

**Test Status**: [ ] Pass [ ] Fail

**Notes**:
```
Restore duration: _______________
Data integrity: _______________
Issues encountered: _______________
```

---

### Test 4: S3 Backup Download and Restore

**Objective**: Verify that backups can be downloaded from S3 and restored.

**Steps**:

1. Delete local backup files:
   ```bash
   rm /var/backups/onetouch-bizcard/onetouch_bizcard_backup_*.sql.gz
   ```

2. List S3 backups:
   ```bash
   aws s3 ls s3://onetouch-bizcard-backups/database/
   ```

3. Restore from S3 (script should auto-download):
   ```bash
   ./restore-database.sh onetouch_bizcard_backup_YYYYMMDD_HHMMSS.sql.gz
   ```

4. Verify restoration:
   ```bash
   psql "$DATABASE_URL" -c "SELECT version();"
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM brands;"
   ```

**Expected Results**:
- ✅ Backup downloaded from S3 successfully
- ✅ Restore completes without errors
- ✅ Data is intact after restoration

**Test Status**: [ ] Pass [ ] Fail

**Notes**:
```
Download time: _______________
Restore duration: _______________
Issues encountered: _______________
```

---

### Test 5: Backup Retention Policy

**Objective**: Verify that old backups are automatically deleted.

**Steps**:

1. Create multiple test backups with old timestamps:
   ```bash
   # Create backups with old dates (for testing)
   for i in {35..40}; do
     touch -d "$i days ago" /var/backups/onetouch-bizcard/onetouch_bizcard_backup_test_$i.sql.gz
   done
   ```

2. List backups before cleanup:
   ```bash
   ls -lt /var/backups/onetouch-bizcard/
   ```

3. Run backup script (which includes clean
   ```bash
   ./backup-database.sh
   ```

4. Verify old backups were removed:
   ```bash
   ls -lt /var/backups/onetouch-bizcard/
   # Should not see files older than RETENTION_DAYS
   ```

**Expected Results**:
- ✅ Backups older than retention period are deleted
- ✅ Recent backups are preserved
- ✅ Cleanup runs without errors

**Test Status**: [ ] Pass [ ] Fail

**Notes**:
```
Retention days: _______________
Files deleted: _______________
Issues encountered: _______________
```

---

## File Storage Backup Testing

### Test 6: File Storage Backup

**Objective**: Verify that S3 files are backed up correctly.

**Steps**:

1. Upload test files to source bucket:
   ```bash
   echo "Test file 1" > test1.txt
   echo "Test file 2" > test2.txt
   aws s3 cp test1.txt s3://onetouch-bizcard-production/test/
   aws s3 cp test2.txt s3://onetouch-bizcard-production/test/
   ```

2. Run file backup script:
   ```bash
   cd onetouch-bizcard/scripts
   chmod +x backup-files.sh
   ./backup-files.sh
   ```

3. Verify backup in S3:
   ```bash
   aws s3 ls s3://onetouch-bizcard-backups/files/ --recursive
   ```

4. Check manifest file:
   ```bash
   aws s3 cp s3://onetouch-bizcard-backups/manifests/manifest_*.txt - | head -20
   ```

**Expected Results**:
- ✅ Files synced to backup bucket
- ✅ Manifest file created
- ✅ File count matches source bucket
- ✅ Backup stored in Glacier storage class

**Test Status**: [ ] Pass [ ] Fail

**Notes**:
```
Files backed up: _______________
Backup duration: _______________
Issues encountered: _______________
```

---

### Test 7: File Storage Restoration

**Objective**: Verify that files can be restored from backup.

**Steps**:

1. Delete test files from source bucket:
   ```bash
   aws s3 rm s3://onetouch-bizcard-production/test/ --recursive
   ```

2. Verify files are deleted:
   ```bash
   aws s3 ls s3://onetouch-bizcard-production/test/
   ```

3. Restore from backup:
   ```bash
   BACKUP_TIMESTAMP="YYYYMMDD_HHMMSS"  # Use actual timestamp
   aws s3 sync s3://onetouch-bizcard-backups/files/$BACKUP_TIMESTAMP/ \
     s3://onetouch-bizcard-production/
   ```

4. Verify files are restored:
   ```bash
   aws s3 ls s3://onetouch-bizcard-production/test/
   aws s3 cp s3://onetouch-bizcard-production/test/test1.txt -
   ```

**Expected Results**:
- ✅ Files restored successfully
- ✅ File content is intact
- ✅ All files from backup are present

**Test Status**: [ ] Pass [ ] Fail

**Notes**:
```
Files restored: _______________
Restore duration: _______________
Issues encountered: _______________
```

---

## Disaster Recovery Drill

### Test 8: Complete System Recovery Simulation

**Objective**: Simulate a complete disaster and perform full system recovery.

**Scenario**: Database server failure with complete data loss.

**Steps**:

1. **Document Current State**:
   ```bash
   # Record current metrics
   psql "$DATABASE_URL" -c "SELECT COUNT(*) as brands FROM brands;" > /tmp/dr_before.txt
   psql "$DATABASE_URL" -c "SELECT COUNT(*) as branches FROM branches;" >> /tmp/dr_before.txt
   psql "$DATABASE_URL" -c "SELECT COUNT(*) as users FROM users;" >> /tmp/dr_before.txt
   aws s3 ls s3://onetouch-bizcard-production/ --recursive | wc -l >> /tmp/dr_before.txt
   ```

2. **Simulate Disaster** (in staging only!):
   ```bash
   # Drop staging database
   dropdb onetouch_bizcard_staging

   # Create new empty database
   createdb onetouch_bizcard_staging
   ```

3. **Start Recovery Timer**:
   ```bash
   START_TIME=$(date +%s)
   echo "Recovery started at: $(date)"
   ```

4. **Restore Database**:
   ```bash
   # Get latest backup
   LATEST_BACKUP=$(aws s3 ls s3://onetouch-bizcard-backups/database/ | sort | tail -1 | awk '{print $4}')

   # Restore
   ./restore-database.sh $LATEST_BACKUP
   ```

5. **Restore File Storage**:
   ```bash
   # Get latest file backup
   LATEST_FILES=$(aws s3 ls s3://onetouch-bizcard-backups/files/ | sort | tail -1 | awk '{print $2}' | tr -d '/')

   # Restore files
   aws s3 sync s3://onetouch-bizcard-backups/files/$LATEST_FILES/ \
     s3://onetouch-bizcard-production/
   ```

6. **Restart Application**:
   ```bash
   # Restart application services
   pm2 restart onetouch-bizcard
   # Or docker-compose restart
   ```

7. **Verify System Functionality**:
   ```bash
   # Health check
   curl http://localhost:3000/api/health

   # Test authentication
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'

   # Test microsite rendering
   curl http://localhost:3000/test-brand/test-branch
   ```

8. **Verify Data Integrity**:
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) as brands FROM brands;" > /tmp/dr_after.txt
   psql "$DATABASE_URL" -c "SELECT COUNT(*) as branches FROM branches;" >> /tmp/dr_after.txt
   psql "$DATABASE_URL" -c "SELECT COUNT(*) as users F users;" >> /tmp/dr_after.txt
   aws s3 ls s3://onetouch-bizcard-production/ --recursive | wc -l >> /tmp/dr_after.txt

   diff /tmp/dr_before.txt /tmp/dr_after.txt
   ```

9. **Calculate Recovery Time**:
   ```bash
   END_TIME=$(date +%s)
   RECOVERY_TIME=$((END_TIME - START_TIME))
   echo "Total recovery time: $((RECOVERY_TIME / 60)) minutes $((RECOVERY_TIME % 60)) seconds"
   ```

**Expected Results**:
- ✅ Database restored successfully
- ✅ Files restored successfully
- ✅ Application starts without errors
- ✅ All services are functional
- ✅ Data integrity verified
- ✅ Recovery time < 4 hours (RTO target)
- ✅ Data loss < 15 minutes (RPO target)

**Test Status**: [ ] Pass [ ] Fail

**Recovery Metrics**:
```
Start time: _______________
End time: _______________
Total recovery time: _______________
Database restore time: _______________
File restore time: _______________
Application restart time: _______________
Data loss (minutes): _______________
Issues encountered: _______________
```

---

## Validation Checklist

### Pre-Production Validation

- [ ] All backup scripts execute without errors
- [ ] Backups are created on schedule
- [ ] Backups are uploaded to S3 successfully
- [ ] Backup files are valid and not corrupted
- [ ] Restoration procedures work correctly
- [ ] Retention policies are enforced
- [ ] Disaster recovery drill completed successfully
- [ ] Recovery time meets RTO objectives (< 4 hours)
- [ ] Data loss meets RPO objectives (< 15 minutes)
- [ ] Documentation is complete and accurate

### Production Deployment Checklist

- [ ] Backup scripts deployed to production servers
- [ ] Cron jobs configured for automated backups
- [ ] AWS S3 backup buckets created and configured
- [ ] IAM permissions configured correctly
- [ ] Backup monitoring and alerting configured
- [ ] Team trained on recovery procedures
- [ ] Emergency contact list updated
- [ ] Disaster recovery runbook accessible to team

---

## Test Results Documentation

### Test Summary

| Test # | Test Name | Status | Duration | Issues | Notes |
|--------|-----------|--------|----------|--------|-------|
| 1 | Manual Backup Creation | | | | |
| 2 | Automated Backup Schedule | | | | |
| 3 | Backup Restoration | | | | |
| 4 | S3 Backup Download | | | | |
| 5 | Retention Policy | | | | |
| 6 | File Storage Backup | | | | |
| 7 | File Storage Restoration | | | | |
| 8 | Complete DR Drill | | | | |

### Overall Assessment

**Test Date**: _______________
**Tested By**: _______________
**Environment**: [ ] Staging [ ] Production

**Results**:
- Tests Passed: ___ / 8
- Tests Failed: ___ / 8
- Critical Issues: _______________

**RTO/RPO Compliance**:
- Database RTO (target: 2 hours): _______________
- File Storage RTO (target: 4 hours): _______________
- RPO (target: 15 minutes): _______________

**Recommendations**:
```
1. _______________
2. _______________
3. _______________
```

**Sign-off**:
- Tester: _______________ Date: _______________
- Reviewer: _______________ Date: _______________
- Approver: _______________ Date: _______________

---

## Next Steps

After successful testing:

1. **Update Documentation**:
   - Update disaster recovery runbook with actual recovery times
   - Document any issues encountered and resolutions
   - Update procedures based on lessons learned

2. **Production Deployment**:
eploy backup scripts to production
   - Configure automated backup schedule
   - Set up monitoring and alerting

3. **Ongoing Maintenance**:
   - Schedule monthly DR drills
   - Review and update procedures quarterly
   - Test backups regularly

4. **Team Training**:
   - Train team on recovery procedures
   - Conduct tabletop exercises
   - Update emergency contact list

---

## Support

For questions or issues:
- Email: devops@onetouchbizcard.in
- Documentation: /docs/disaster-recovery.md
- Emergency: [On-call phone number]

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Next Review**: [Date + 3 months]
