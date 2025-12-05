# Executive Role - Quick Reference

## 🚀 Quick Setup

```bash
# Windows
scripts\setup-executive-role.bat

# Linux/Mac
bash scripts/setup-executive-role.sh
```

## 📊 API Endpoints

### Get All Executive Stats
```bash
GET /api/executives/stats
```

### Get Specific Executive Stats
```bash
GET /api/executives/stats?executiveId=exec_123
```

### Assign Executive to Branch
```bash
POST /api/branches/{branchId}/assign-executive
Content-Type: application/json

{
  "executiveId": "exec_123"
}
```

### Remove Executive Assignment
```bash
DELETE /api/branches/{branchId}/assign-executive
```

### Get All Executives
```bash
GET /api/users?role=EXECUTIVE
```

## 💻 Component Usage

### Executive Stats Dashboard
```tsx
import ExecutiveStatsCard from '@/components/dashboard/ExecutiveStatsCard';

<ExecutiveStatsCard />
```

### Assign Executive Modal
```tsx
import AssignExecutiveModal from '@/components/branches/AssignExecutiveModal';

<AssignExecutiveModal
  branchId="branch_123"
  branchName="Branch Name"
  currentExecutiveId={branch.onboardedBy}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={handleSuccess}
/>
```

## 🔑 Key Metrics

| Metric | Description |
|--------|-------------|
| Total Onboarded | All-time branches onboarded |
| Active Count | Currently active branches |
| This Month | Branches onboarded this month |
| Trend | Month-over-month change |

## 👥 Permissions

| Role | View Stats | Assign Executive |
|------|-----------|------------------|
| SUPER_ADMIN | ✅ All | ✅ All |
| BRAND_MANAGER | ✅ Own Brand | ✅ Own Brand |
| EXECUTIVE | ✅ Own Only | ❌ No |
| BRANCH_ADMIN | ❌ No | ❌ No |

## 📈 Leaderboard Rankings

1. **Primary**: Total Onboarded
2. **Secondary**: Active Count
3. **Tertiary**: This Month Count

**Top 3 get special badges:** 🥇 🥈 🥉

## 🗄️ Database Fields

### User Model
- `role`: Added `EXECUTIVE` enum value
- `onboardedBranches`: Relation to branches

### Branch Model
- `onboardedBy`: Executive user ID
- `onboardedAt`: Onboarding timestamp
- `onboardingExecutive`: Relation to user

## 🎯 Common Tasks

### Create Executive User
```typescript
POST /api/auth/register
{
  "email": "exec@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "EXECUTIVE",
  "brandId": "brand_123"
}
```

### Fetch Executive Performance
```typescript
const response = await fetch('/api/executives/stats?executiveId=exec_123');
const { data } = await response.json();

console.log(data.stats.totalOnboarded);
console.log(data.stats.thisMonthCount);
```

### Assign During Branch Creation
```typescript
const branch = await prisma.branch.create({
  data: {
    // ... branch data
    onboardedBy: executiveId,
    onboardedAt: new Date(),
  }
});
```

## 🔔 Notifications

Executives receive notifications for:
- ✅ New branch assignments
- ✅ Branch activation
- ✅ Performance milestones

## 📖 Full Documentation

- **Complete Guide**: `docs/EXECUTIVE_ROLE_GUIDE.md`
- **Implementation**: `EXECUTIVE_ROLE_IMPLEMENTATION.md`

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Executive not in list | Check role is EXECUTIVE and user is active |
| Can't assign | Verify permissions (SUPER_ADMIN or BRAND_MANAGER) |
| Stats not updating | Refresh page or check onboardedAt is set |
| Migration fails | Check database connection and permissions |

## 📞 Support

For detailed help, see the full documentation in `docs/EXECUTIVE_ROLE_GUIDE.md`

---

**Version:** 1.0.0
**Last Updated:** November 3, 2025
