# OneTouch BizCard Admin Guide

## Overview

This guide is for administrators and support staff who manage the OneTouch BizCard platform. It covers user management, subscription management, troubleshooting, and system maintenance.

## Table of Contents

1. [Admin Dashboard Access](#admin-dashboard-access)
2. [User Management](#user-management)
3. [Subscription Management](#subscription-management)
4. [Brand and Branch Management](#brand-and-branch-management)
5. [Support and Troubleshooting](#support-and-troubleshooting)
6. [Analytics and Reporting](#analytics-and-reporting)
7. [System Maintenance](#system-maintenance)
8. [Security and Compliance](#security-and-compliance)

---

## Admin Dashboard Access

### Accessing Admin Features

Admin features are available to users with `SUPER_ADMIN` role.

**Login**:
1. Go to https://onetouchbizcard.in/admin
2. Enter admin credentials
3. Access admin dashboard

### Admin Roles

- **SUPER_ADMIN**: Full system access
- **BRAND_MANAGER**: Manage specific brands
- **BRANCH_ADMIN**: Manage specific branches
- **SUPPORT**: View-only access for support purposes

---

## User Management

### Viewing Users

**List All Users**:
```
GET /api/admin/users
```

**Search Users**:
- By email
- By name
- By subscription status
- By registration date

### User Details

View user information:
- Account details
- Subscription status
- Brands and branches
- Activity history
- Payment history

### Managing User Accounts

**Activate/Deactivate User**:
1. Find user in admin dashboard
2. Click "Actions" → "Deactivate"
3. Confirm action
4. User loses access immediately

**Reset User Password**:
1. Find user
2. Click "Reset Password"
3. Temporary password is sent to user's email

**Delete User Account**:
1. Find user
2. Click "Delete Account"
3. Confirm deletion
4. All user data is marked for deletion (30-day grace period)

### User Support

**View User Activity**:
- Login history
- Microsite edits
- QR code generations
- Lead captures

**Impersonate User** (for support):
1. Find user
2. Click "Impersonate"
3. View platform as the user
4. Click "Exit Impersonation" when done

---

## Subscription Management

### Viewing Subscriptions

**Active Subscriptions**:
- List all active subscriptions
- Filter by plan type
- Sort by renewal date

**Expired Subscriptions**:
- View expired subscriptions
- Identify users to contact

### Managing Subscriptions

**Manual Subscription Creation**:
```typescript
// For special cases (discounts, partnerships, etc.)
POST /api/admin/subscriptions
{
  "userId": "user-id",
  "planId": "plan-id",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "price": 0, // For free subscriptions
  "notes": "Partnership agreement"
}
```

**Extend Subscription**:
1. Find subscription
2. Click "Extend"
3. Enter new end date
4. Add reason/notes
5. Confirm

**Cancel Subscription**:
1. Find subscription
2. Click "Cancel"
3. Choose:
   - Immediate cancellation
   - End of billing period
4. Add reason
5. Confirm

**Refund Subscription**:
1. Find payment
2. Click "Refund"
3. Enter refund amount
4. Add reason
5. Process refund through payment gateway

### Subscription Plans

**View Plans**:
```
GET /api/subscription-plans
```

**Create New Plan**:
```typescript
POST /api/admin/subscription-plans
{
  "name": "Custom Plan",
  "price": 49.99,
  "duration": "MONTHLY",
  "features": {
    "maxBranches": 5,
    "customDomain": true,
    "analytics": true,
    "qrCodes": true,
    "leadCapture": true,
    "prioritySupport": true
  }
}
```

**Update Plan**:
- Change pricing
- Modify features
- Update descriptions

**Deactivate Plan**:
- Existing subscribers keep their plan
- New signups cannot select this plan

---

## Brand and Branch Management

### Viewing All Brands

**Admin Brand List**:
- View all brands across all users
- Search by name or slug
- Filter by status (active/inactive)
- Sort by creation date

### Managing Brands

**Edit Brand** (as admin):
1. Find brand
2. Click "Edit"
3. Modify details
4. Save changes

**Deactivate Brand**:
- Brand microsites become inaccessible
- User retains data
- Can be reactivated

**Delete Brand**:
- Permanent deletion
- All branches deleted
- All data removed
- Requires confirmation

### Branch Management

**View All Branches**:
- List all branches across all brands
- Search and filter
- View analytics

**Moderate Content**:
- Review reported content
- Remove inappropriate content
- Suspend branches if needed

---

## Support and Troubleshooting

### Common Support Issues

#### User Can't Log In

**Troubleshooting Steps**:
1. Verify email address is correct
2. Check if account is active
3. Check if email is verified
4. Reset password if needed
5. Check for any account locks

**Resolution**:
```typescript
// Reset password
POST /api/admin/users/{userId}/reset-password

// Unlock account
POST /api/admin/users/{userId}/unlock

// Resend verification email
POST /api/admin/users/{userId}/resend-verification
```

#### Payment Failed

**Check**:
1. View payment attempt logs
2. Check payment gateway status
3. Verify card details (last 4 digits)
4. Check for fraud flags

**Resolution**:
- Retry payment
- Update payment method
- Manual invoice if needed

#### Microsite Not Loading

**Troubleshooting**:
1. Check if branch is active
2. Verify URL is correct
3. Check for any errors in logs
4. Test from different locations
5. Check CDN status

**Resolution**:
- Reactivate branch if needed
- Clear cache
- Regenerate microsite
- Check DNS if custom domain

#### QR Code Not Working

**Check**:
1. Verify QR code data
2. Test QR code with multiple scanners
3. Check target URL
4. Verify branch is active

**Resolution**:
- Regenerate QR code
- Update QR code data
- Provide new QR code to user

### Support Tickets

**View Tickets**:
- All open tickets
- Assigned tickets
- Closed tickets

**Ticket Management**:
1. Assign to support staff
2. Add internal notes
3. Respond to user
4. Escalate if needed
5. Close when resolved

**Ticket Priority**:
- **Critical**: System down, payment issues
- **High**: Feature not working, data loss
- **Medium**: Minor bugs, feature requests
- **Low**: Questions, general inquiries

---

## Analytics and Reporting

### Platform Analytics

**Dashboard Metrics**:
- Total users
- Active subscriptions
- Revenue (MRR, ARR)
- New signups
- Churn rate
- Active microsites
- Total QR scans
- Total leads captured

### User Analytics

**Per User**:
- Subscription status
- Number of brands/branches
- Microsite views
- QR code scans
- Leads captured
- Last login date

### Financial Reports

**Revenue Reports**:
- Monthly recurring revenue (MRR)
- Annual recurring revenue (ARR)
- Revenue by plan
- Revenue by payment method
- Refunds and chargebacks

**Export Reports**:
```typescript
GET /api/admin/reports/revenue?startDate=2024-01-01&endDate=2024-12-31
```

### Usage Reports

**Platform Usage**:
- Total microsites created
- Total QR codes generated
- Total page views
- Total leads captured
- Storage usage
- Bandwidth usage

---

## System Maintenance

### Database Maintenance

**Backup Verification**:
```bash
# Run backup verification
cd /path/to/onetouch-bizcard/scripts
./verify-backup.sh
```

**Database Cleanup**:
```sql
-- Remove old analytics data (older than 1 year)
DELETE FROM analytics_events
WHERE created_at < NOW() - INTERVAL '1 year';

-- Remove deleted users (after 30-day grace period)
DELETE FROM users
WHERE deleted_at < NOW() - INTERVAL '30 days';
```

**Database Optimization**:
```sql
-- Vacuum and analyze
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE onetouch_bizcard_prod;
```

### Cache Management

**Clear Redis Cache**:
```bash
# Clear all cache
redis-cli -u "$REDIS_URL" FLUSHALL

# Clear specific cache
redis-cli -u "$REDIS_URL" DEL "cache:brands:*"
```

**Cache Monitoring**:
```bash
# Check cache hit rate
redis-cli -u "$REDIS_URL" INFO stats | grep hit_rate
```

### Log Management

**View Logs**:
```bash
# Application logs
tail -f /var/log/onetouch-bizcard/application.log

# Error logs
tail -f /var/log/onetouch-bizcard/error.log

# Access logs
tail -f /var/log/onetouch-bizcard/access.log
```

**Log Rotation**:
- Logs are rotated daily
- Kept for 30 days
- Archived to S3 for long-term storage

### Performance Monitoring

**Check System Health**:
```bash
# API health check
curl https://onetouchbizcard.in/api/health

# Database health
psql "$DATABASE_URL" -c "SELECT 1;"

# Redis health
redis-cli -u "$REDIS_URL" PING
```

**Monitor Performance**:
- Response times
- Error rates
- Database query performance
- Cache hit rates
- Server resources (CPU, memory, disk)

---

## Security and Compliance

### Security Monitoring

**Monitor for**:
- Failed login attempts
- Suspicious activity
- Unusual traffic patterns
- Payment fraud
- Data breaches

**Security Alerts**:
- Configured in Sentry
- Sent to security team
- Escalated if critical

### User Data Management

**GDPR Compliance**:

**Data Export Request**:
```typescript
POST /api/admin/users/{userId}/export-data
// Generates ZIP file with all user data
```

**Data Deletion Request**:
```typescript
POST /api/admin/users/{userId}/delete-data
// Marks user for deletion (30-day grace period)
```

**Data Retention**:
- Active users: Indefinite
- Deleted users: 30 days
- Analytics: 1 year (free), unlimited (paid)
- Logs: 30 days
- Backups: 90 days

### Compliance Audits

**Regular Audits**:
- Security audit: Quarterly
- Compliance audit: Annually
- Penetration testing: Annually
- Code review: Continuous

**Audit Logs**:
```typescript
GET /api/admin/audit-logs
// View all sensitive operations
```

### Access Control

**Admin Access**:
- Multi-factor authentication required
- IP whitelist (optional)
- Session timeout: 1 hour
- Activity logging

**API Access**:
- Rate limiting enforced
- API keys rotated regularly
- Webhook signatures verified

---

## Emergency Procedures

### System Outage

**Immediate Actions**:
1. Check status page
2. Verify all services
3. Check error logs
4. Notify team
5. Update status page

**Recovery**:
1. Identify root cause
2. Implement fix
3. Verify services restored
4. Update status page
5. Post-mortem analysis

### Data Breach

**Immediate Actions**:
1. Isolate affected systems
2. Preserve evidence
3. Notify security team
4. Contact legal team
5. Prepare user notification

**Investigation**:
1. Determine scope
2. Identify affected users
3. Assess data exposure
4. Document findings

**Remediation**:
1. Fix vulnerability
2. Notify affected users
3. Offer credit monitoring (if needed)
4. Update security measures
5. File required reports

### Payment Issues

**Payment Gateway Down**:
1. Check gateway status
2. Switch to backup gateway (if available)
3. Notify users
4. Process manual payments if needed

**Fraudulent Transactions**:
1. Flag transaction
2. Refund if confirmed fraud
3. Block user if needed
4. Report to payment gateway
5. Update fraud detection rules

---

## Best Practices

### User Support

1. **Respond Quickly**: Aim for < 24 hour response time
2. **Be Helpful**: Provide clear, actionable solutions
3. **Document Issues**: Track common problems
4. **Follow Up**: Ensure issues are resolved
5. **Gather Feedback**: Learn from user issues

### System Maintenance

1. **Regular Backups**: Verify backups daily
2. **Monitor Performance**: Check metrics daily
3. **Update Dependencies**: Monthly security updates
4. **Test Disaster Recovery**: Quarterly drills
5. **Review Logs**: Weekly log analysis

### Security

1. **Least Privilege**: Grant minimum necessary access
2. **Regular Audits**: Review access logs weekly
3. **Update Passwords**: Rotate admin passwords quarterly
4. **Monitor Alerts**: Respond to security alerts immediately
5. **Stay Informed**: Follow security advisories

---

## Admin Tools and Scripts

### Useful Scripts

**User Statistics**:
```bash
# scripts/user-stats.sh
psql "$DATABASE_URL" -c "
  SELECT
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
    COUNT(*) FILTER (WHERE last_login > NOW() - INTERVAL '7 days') as active_users_7d
  FROM users;
"
```

**Subscription Report**:
```bash
# scripts/subscription-report.sh
psql "$DATABASE_URL" -c "
  SELECT
    sp.name as plan,
    COUNT(*) as subscribers,
    SUM(sp.price) as monthly_revenue
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.status = 'ACTIVE'
  GROUP BY sp.name, sp.price;
"
```

**System Health Check**:
```bash
# scripts/health-check.sh
./scripts/test-monitoring.sh
```

---

## Contact Information

### Internal Team

**DevOps Team**:
- Email: devops@onetouchbizcard.in
- Slack: #devops
- On-call: [Phone]

**Support Team**:
- Email: support@onetouchbizcard.in
- Slack: #support

**Security Team**:
- Email: security@onetouchbizcard.in
- Slack: #security
- Emergency: [Phone]

### External Vendors

**Payment Gateways**:
- Stripe Support: https://support.stripe.com
- Razorpay Support: https://razorpay.com/support

**Infrastructure**:
- AWS Support: [Account-specific]
- Vercel Support: https://vercel.com/support

**Monitoring**:
- Sentry: https://sentry.io/support
- UptimeRobot: https://uptimerobot.com/support

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Next Review**: [Date + 3 months]
