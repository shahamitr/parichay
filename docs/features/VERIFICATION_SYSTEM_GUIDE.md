# Business Verification System 🏆

## Overview

The verification system allows admins to verify businesses that have complete and accurate information. Verified businesses display a blue checkmark badge on their microsites, building trust with visitors.

---

## Features

### 1. **Automatic Completion Scoring** ✅
- Calculates profile completion percentage (0-100%)
- Checks all required fields
- Real-time score updates

### 2. **Verification Requirements** 📋
Businesses must have **80% completion** to be verified:

#### Required Information (100 points total):
- **Basic Info (20 points)**
  - Business name ✓
  - Slug ✓
  - Active status ✓
  - Brand logo ✓

- **Contact Info (20 points)**
  - Phone number ✓✓
  - Email address ✓✓
  - WhatsApp (optional) ✓

- **Address (15 points)**
  - Street address ✓
  - City ✓
  - State ✓
  - ZIP code ✓
  - Country ✓

- **Social Media (10 points)**
  - Facebook ✓
  - Instagram ✓
  - LinkedIn ✓
  - Twitter ✓

- **Business Hours (10 points)**
  - Operating hours ✓✓

- **Microsite Content (25 points)**
  - Hero section ✓
  - About content ✓
  - Services/Products ✓
  - Gallery images ✓
  - Contact section ✓

### 3. **Verified Badge Display** 🎖️
- Blue checkmark icon next to business name
- Displays on microsite profile section
- Builds trust and credibility
- Mobile-responsive

### 4. **Admin Verification UI** 🎛️
- Completion score with progress bar
- List of missing fields
- Verification notes
- One-click verification
- Verification history

---

## API Endpoints

### GET /api/branches/[id]/verify
Get verification status and completion score

**Response:**
```json
{
  "isVerified": false,
  "verifiedAt": null,
  "completionScore": 75,
  "requiredScore": 80,
  "canVerify": false,
  "missingFields": [
    "Gallery images",
    "Business hours"
  ]
}
```

### POST /api/branches/[id]/verify
Verify a branch (Admin only)

**Request:**
```json
{
  "notes": "Verified all information is accurate"
}
```

**Response:**
```json
{
  "success": true,
  "branch": { ... },
  "completionScore": 95
}
```

**Error (if incomplete):**
```json
{
  "error": "Branch does not meet verification requirements",
  "completionScore": 75,
  "requiredScore": 80,
  "missingFields": ["Gallery images", "Business hours"]
}
```

---

## Database Schema

### Branches Table
```sql
ALTER TABLE branches ADD COLUMN:
- isVerified BOOLEAN DEFAULT false
- verifiedAt DATETIME
- verifiedBy VARCHAR(191)  -- User ID who verified
- verificationNotes TEXT
- completionScore INT DEFAULT 0
```

### Brands Table
```sql
ALTER TABLE brands ADD COLUMN:
- isVerified BOOLEAN DEFAULT false
- verifiedAt DATETIME
- verificationBadge VARCHAR(50)  -- 'verified', 'premium', 'trusted'
```

---

## Components

### 1. VerifiedBadge Component
```tsx
import VerifiedBadge from '@/components/ui/VerifiedBadge';

// Basic usage
<VerifiedBadge type="verified" size="md" showLabel={true} />

// Types: 'verified', 'premium', 'trusted'
// Sizes: 'sm', 'md', 'lg'
```

### 2. CompletionScoreBadge Component
```tsx
import { CompletionScoreBadge } from '@/components/ui/VerifiedBadge';

<CompletionScoreBadge score={85} size="md" showLabel={true} />

// Colors automatically based on score:
// 80-100%: Green
// 60-79%: Yellow
// 0-59%: Red
```

### 3. BranchVerificationCard Component
```tsx
import BranchVerificationCard from '@/components/dashboard/BranchVerificationCard';

<BranchVerificationCard
  branchId="branch_123"
  branchName="TechVision Mumbai"
  onVerificationChange={() => {
    // Refresh data after verification
  }}
/>
```

---

## Usage in Admin Dashboard

### Step 1: Add to Branch Edit Page

```tsx
// src/app/dashboard/brands/[id]/branches/[branchId]/page.tsx

import BranchVerificationCard from '@/components/dashboard/BranchVerificationCard';

export default function BranchEditPage({ params }) {
  return (
    <div className="space-y-6">
      {/* Existing branch edit form */}
      <BranchForm branchId={params.branchId} />

      {/* Add verification card */}
      <BranchVerificationCard
        branchId={params.branchId}
        branchName="Branch Name"
        onVerificationChange={() => {
          // Optionally refresh data
        }}
      />
    </div>
  );
}
```

### Step 2: Show Verification Status in Branch List

```tsx
// In branch list component
{branch.isVerified && (
  <VerifiedBadge type="verified" size="sm" showLabel={false} />
)}

<CompletionScoreBadge score={branch.completionScore} size="sm" />
```

---

## Verification Workflow

### For Admins:

1. **Navigate to Branch**
   - Go to Dashboard → Brands → Select Brand → Branches
   - Click on a branch to edit

2. **Check Completion Score**
   - View the verification card
   - See completion percentage
   - Review missing fields

3. **Complete Missing Information**
   - Fill in any missing required fields
   - Add gallery images
   - Set business hours
   - Add social media links

4. **Verify Business**
   - Once score reaches 80%+
   - Add optional verification notes
   - Click "Verify Business" button
   - Badge appears on microsite immediately

### For Visitors:

1. **Visit Microsite**
   - See verified badge next to business name
   - Blue checkmark icon
   - Builds trust and credibility

---

## Completion Score Calculation

### Scoring Breakdown:

```typescript
Basic Info (20 points):
- Name: 5 points
- Slug: 5 points
- Active: 5 points
- Logo: 5 points

Contact (20 points):
- Phone: 7 points
- Email: 7 points
- WhatsApp: 6 points

Address (15 points):
- Street: 3 points
- City: 3 points
- State: 3 points
- ZIP: 3 points
- Country: 3 points

Social Media (10 points):
- Facebook: 2.5 points
- Instagram: 2.5 points
- LinkedIn: 2.5 points
- Twitter: 2.5 points

Business Hours (10 points):
- Hours set: 10 points

Microsite Content (25 points):
- Hero section: 5 points
- About content: 5 points
- Services: 5 points
- Gallery: 5 points
- Contact: 5 points

Total: 100 points
Minimum for verification: 80 points
```

---

## Badge Types

### 1. Verified (Blue)
- Standard verification
- All information complete
- Default badge type

### 2. Premium (Purple)
- Premium subscription
- Enhanced features
- Future implementation

### 3. Trusted (Green)
- Long-standing verified business
- High customer ratings
- Future implementation

---

## Testing

### Test Verification Status:
```bash
curl http://localhost:3001/api/branches/BRANCH_ID/verify
```

### Test Verification (Admin):
```bash
curl -X POST http://localhost:3001/api/branches/BRANCH_ID/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "notes": "Verified all information"
  }'
```

### Check on Microsite:
1. Visit: http://localhost:3001/demo-techvision/mumbai-hq
2. Look for blue checkmark next to "TechVision Solutions"
3. Should appear if branch is verified

---

## Benefits

### For Businesses:
- ✅ Builds trust and credibility
- ✅ Stands out from competitors
- ✅ Professional appearance
- ✅ Higher conversion rates

### For Platform:
- ✅ Ensures data quality
- ✅ Reduces incomplete profiles
- ✅ Premium feature potential
- ✅ Better user experience

### For Visitors:
- ✅ Trust indicator
- ✅ Complete information guaranteed
- ✅ Professional businesses
- ✅ Confidence in contact

---

## Future Enhancements

### Phase 2 (Optional):
1. **Automated Verification**
   - Auto-verify when score reaches 100%
   - Email notification to business owner

2. **Verification Levels**
   - Basic (80%+)
   - Complete (90%+)
   - Premium (100% + paid plan)

3. **Verification Analytics**
   - Track verification rates
   - Completion time metrics
   - Impact on engagement

4. **Bulk Verification**
   - Verify multiple branches at once
   - CSV import/export
   - Batch operations

5. **Verification Expiry**
   - Re-verify annually
   - Update reminders
   - Expired badge handling

---

## Files Created

1. `src/app/api/branches/[id]/verify/route.ts` - Verification API
2. `src/components/ui/VerifiedBadge.tsx` - Badge components
3. `src/components/dashboard/BranchVerificationCard.tsx` - Admin UI
4. `prisma/migrations/add_verification_system/migration.sql` - Database
5. Updated `src/components/microsites/sections/ProfileSection.tsx` - Badge display

---

## Status: ✅ COMPLETE

**What's Working:**
- ✅ Completion score calculation
- ✅ Verification API
- ✅ Verified badge on microsites
- ✅ Admin verification UI component
- ✅ Database schema updated

**What's Needed:**
- Integration into existing dashboard pages
- Testing with real data
- UI polish and refinements

**Time to Integrate:** 1-2 hours

---

**Last Updated:** November 26, 2025
