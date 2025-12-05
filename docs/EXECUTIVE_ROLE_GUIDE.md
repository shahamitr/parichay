# Executive Role and Onboarding Tracking Guide

## Overview

The Executive role is designed for team members responsible for onboarding new microsites (branches) to the platform. This feature provides comprehensive tracking and analytics to monitor executive performance and onboarding metrics.

## Table of Contents

1. [Executive Role](#executive-role)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Dashboard Components](#dashboard-components)
5. [Usage Guide](#usage-guide)
6. [Analytics and Reporting](#analytics-and-reporting)

---

## Executive Role

### Role Hierarchy

```
SUPER_ADMIN
├── BRAND_MANAGER
│   ├── EXECUTIVE (New)
│   └── BRANCH_ADMIN
```

### Permissions

**EXECUTIVE Role Can:**
- View assigned branches
- Access branch details
- Update branch information
- View onboarding statistics
- Receive notifications for assignments

**EXECUTIVE Role Cannot:**
- Create or delete brands
- Manage subscriptions
- Access other executives' data (unless SUPER_ADMIN/BRAND_MANAGER)
- Modify system settings

---

## Database Schema

### User Model Updates

```prisma
model User {
  // ... existing fields
  role UserRole @default(BRANCH_ADMIN)

  // New relationship
  onboardedBranches Branch[] @relation("OnboardedBranches")
}

enum UserRole {
  SUPER_ADMIN
  BRAND_MANAGER
  BRANCH_ADMIN
  EXECUTIVE  // New role
}
```

### Branch Model Updates

```prisma
model Branch {
  // ... existing fields

  // New onboarding tracking fields
  onboardedBy String?      // User ID of executive
  onboardedAt DateTime?    // Timestamp of onboarding

  // New relationship
  onboardingExecutive User? @relation("OnboardedBranches", fields: [onboardedBy], references: [id])
}
```

---

## API Endpoints

### 1. Get Executive Statistics

**Endpoint:** `GET /api/executives/stats`

**Query Parameters:**
- `executiveId` (optional): Get stats for specific executive
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)
- `brandId` (optional): Filter by brand

**Response:**

```json
{
  "success": true,
  "data": {
    "overallStats": {
      "totalExecutives": 5,
      "activeExecutives": 4,
      "totalBranchesOnboarded": 150,
      "thisMonthTotal": 25,
      "lastMonthTotal": 20
    },
    "executives": [
      {
        "id": "exec_123",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "isActive": true,
        "joinedAt": "2024-01-15T00:00:00Z",
        "stats": {
          "totalOnboarded": 45,
          "activeCount": 42,
          "inactiveCount": 3,
          "thisMonthCount": 8,
          "lastMonthCount": 6
        }
      }
    ]
  }
}
```

**For Specific Executive:**

```json
{
  "success": true,
  "data": {
    "executive": {
      "id": "exec_123",
      "name": "John Doe",
      "email": "john@example.com",
      "joinedAt": "2024-01-15T00:00:00Z"
    },
    "stats": {
      "totalOnboarded": 45,
      "activeCount": 42,
      "inactiveCount": 3,
      "byMonth": {
        "2024-01": 5,
        "2024-02": 8,
        "2024-03": 10
      }
    },
    "recentBranches": [
      {
        "id": "branch_456",
        "name": "Downtown Location",
        "brandName": "Acme Corp",
        "onboardedAt": "2024-03-15T10:30:00Z",
        "isActive": true
      }
    ]
  }
}
```

### 2. Assign Executive to Branch

**Endpoint:** `POST /api/branches/[id]/assign-executive`

**Request Body:**

```json
{
  "executiveId": "exec_123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Executive assigned successfully",
  "data": {
    "branch": {
      "id": "branch_456",
      "name": "Downtown Location",
      "onboardedAt": "2024-03-20T14:30:00Z",
      "executive": {
        "id": "exec_123",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

### 3. Remove Executive Assignment

**Endpoint:** `DELETE /api/branches/[id]/assign-executive`

**Response:**

```json
{
  "success": true,
  "message": "Executive assignment removed",
  "data": {
    "branch": {
      "id": "branch_456",
      "name": "Downtown Location"
    }
  }
}
```

### 4. Get Users by Role

**Endpoint:** `GET /api/users?role=EXECUTIVE`

**Query Parameters:**
- `role`: Filter by role (EXECUTIVE, BRANCH_ADMIN, etc.)
- `brandId`: Filter by brand
- `isActive`: Filter by active status (true/false)

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "exec_123",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "EXECUTIVE",
        "isActive": true,
        "phone": "+1234567890",
        "createdAt": "2024-01-15T00:00:00Z",
        "lastLoginAt": "2024-03-20T09:00:00Z",
        "brandId": "brand_789",
        "brand": {
          "id": "brand_789",
          "name": "Acme Corp"
        }
      }
    ],
    "count": 1
  }
}
```

---

## Dashboard Components

### 1. ExecutiveStatsCard

**Location:** `src/components/dashboard/ExecutiveStatsCard.tsx`

**Features:**
- Overall statistics cards
- Executive leaderboard
- Performance trends
- Month-over-month comparison
- Real-time refresh

**Usage:**

```tsx
import ExecutiveStatsCard from '@/components/dashboard/ExecutiveStatsCard';

export default function DashboardPage() {
  return (
    <div>
      <ExecutiveStatsCard />
    </div>
  );
}
```

### 2. AssignExecutiveModal

**Location:** `src/components/branches/AssignExecutiveModal.tsx`

**Features:**
- Select executive from list
- View executive details
- Assign/remove executive
- Real-time validation

**Usage:**

```tsx
import AssignExecutiveModal from '@/components/branches/AssignExecutiveModal';

const [isModalOpen, setIsModalOpen] = useState(false);

<AssignExecutiveModal
  branchId="branch_456"
  branchName="Downtown Location"
  currentExecutiveId={branch.onboardedBy}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={() => {
    // Refresh branch data
    fetchBranches();
  }}
/>
```

---

## Usage Guide

### Creating an Executive User

1. **Via Admin Panel:**
   - Navigate to Users Management
   - Click "Create New User"
   - Fill in user details
   - Select role: "EXECUTIVE"
   - Assign to brand (if applicable)
   - Save

2. **Via API:**

```bash
POST /api/auth/register
{
  "email": "executive@example.com",
  "password": "SecurePassword123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "EXECUTIVE",
  "brandId": "brand_789"
}
```

### Assigning Executive to Branch

1. **During Branch Creation:**
   - Create branch as usual
   - In the onboarding section, select executive
   - System automatically records onboardedBy and onboardedAt

2. **For Existing Branch:**
   - Navigate to branch details
   - Click "Assign Executive"
   - Select executive from modal
   - Confirm assignment

3. **Via API:**

```bash
POST /api/branches/branch_456/assign-executive
{
  "executiveId": "exec_123"
}
```

### Viewing Executive Performance

1. **Executive Leaderboard:**
   - Navigate to Dashboard
   - View "Executive Leaderboard" section
   - See rankings, stats, and trends

2. **Individual Executive Stats:**
   - Click on executive name
   - View detailed statistics
   - See onboarded branches list
   - Analyze monthly trends

3. **Via API:**

```bash
GET /api/executives/stats?executiveId=exec_123
```

---

## Analytics and Reporting

### Key Metrics

1. **Total Onboarded**
   - Total number of branches onboarded by executive
   - All-time metric

2. **Active Count**
   - Number of onboarded branches currently active
   - Indicates quality of onboarding

3. **This Month Count**
   - Branches onboarded in current month
   - Performance indicator

4. **Trend**
   - Month-over-month comparison
   - Shows growth or decline

5. **Conversion Rate**
   - Active branches / Total onboarded
   - Quality metric

### Leaderboard Rankings

Executives are ranked by:
1. Total branches onboarded (primary)
2. Active branch count (secondary)
3. This month's performance (tertiary)

Top 3 executives receive special badges:
- 🥇 1st Place: Gold badge
- 🥈 2nd Place: Silver badge
- 🥉 3rd Place: Bronze badge

### Reporting Periods

- **All Time**: Complete history
- **This Month**: Current calendar month
- **Last Month**: Previous calendar month
- **Custom Range**: Specify start and end dates

### Export Options

```typescript
// Export executive stats to CSV
const exportStats = async () => {
  const response = await fetch('/api/executives/stats');
  const data = await response.json();

  // Convert to CSV format
  const csv = convertToCSV(data.data.executives);
  downloadCSV(csv, 'executive-stats.csv');
};
```

---

## Notifications

### Executive Notifications

Executives receive notifications for:

1. **New Assignment**
   - When assigned to a new branch
   - Includes branch and brand details

2. **Branch Activation**
   - When their onboarded branch goes live
   - Milestone achievement

3. **Performance Milestones**
   - 10, 25, 50, 100 branches onboarded
   - Recognition and motivation

### Notification Example

```json
{
  "type": "SYSTEM_ALERT",
  "title": "New Branch Assigned",
  "message": "You have been assigned to onboard Downtown Location for Acme Corp",
  "metadata": {
    "branchId": "branch_456",
    "branchName": "Downtown Location",
    "brandId": "brand_789",
    "brandName": "Acme Corp"
  }
}
```

---

## Migration

### Running the Migration

```bash
# Apply database migration
npx prisma migrate deploy

# Or for development
npx prisma migrate dev --name add_executive_role_and_onboarding_tracking
```

### Migration SQL

The migration adds:
- EXECUTIVE role to UserRole enum
- onboardedBy field to branches table
- onboardedAt field to branches table
- Foreign key constraint
- Index for performance

---

## Best Practices

### For Administrators

1. **Assign Executives Promptly**
   - Assign executives during or immediately after branch creation
   - Ensures accurate tracking from day one

2. **Monitor Performance Regularly**
   - Review leaderboard weekly
   - Identify top performers and those needing support

3. **Set Clear Goals**
   - Define monthly onboarding targets
   - Communicate expectations clearly

4. **Recognize Achievements**
   - Acknowledge top performers
   - Use leaderboard for motivation

### For Executives

1. **Complete Onboarding Thoroughly**
   - Ensure all branch details are accurate
   - Verify microsite configuration
   - Test all features before marking complete

2. **Follow Up**
   - Check on branches after onboarding
   - Ensure clients are satisfied
   - Address any issues promptly

3. **Track Your Progress**
   - Review your stats regularly
   - Set personal goals
   - Strive for quality over quantity

---

## Troubleshooting

### Common Issues

1. **Executive Not Appearing in List**
   - Verify user role is set to EXECUTIVE
   - Check if user is active
   - Ensure user is assigned to correct brand

2. **Assignment Fails**
   - Verify executive exists and is active
   - Check permissions
   - Ensure branch exists

3. **Stats Not Updating**
   - Refresh the page
   - Check if onboardedAt is set
   - Verify database connection

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Executive not found" | Invalid executive ID | Verify executive exists |
| "User is not an executive" | Wrong role | Change user role to EXECUTIVE |
| "Forbidden: Insufficient permissions" | Lack of permissions | Use SUPER_ADMIN or BRAND_MANAGER account |
| "Branch not found" | Invalid branch ID | Verify branch exists |

---

## Security Considerations

1. **Role-Based Access Control**
   - Only SUPER_ADMIN and BRAND_MANAGER can view all executive stats
   - Executives can only view their own stats

2. **Data Privacy**
   - Executive personal information is protected
   - Only authorized users can assign executives

3. **Audit Trail**
   - All assignments are logged
   - Timestamps recorded for accountability

---

## Future Enhancements

Potential improvements:

1. **Gamification**
   - Points system
   - Badges and achievements
   - Monthly competitions

2. **Advanced Analytics**
   - Conversion funnels
   - Time-to-onboard metrics
   - Client satisfaction scores

3. **Team Management**
   - Executive teams
   - Team leaderboards
   - Collaborative onboarding

4. **Automated Assignments**
   - Round-robin assignment
   - Load balancing
   - Territory-based assignment

5. **Performance Reviews**
   - Automated reports
   - Manager feedback
   - Goal tracking

---

## Support

For questions or issues:
- Check this documentation
- Review API documentation
- Contact system administrator
- Submit support ticket

---

**Last Updated:** November 3, 2025
**Version:** 1.0.0
