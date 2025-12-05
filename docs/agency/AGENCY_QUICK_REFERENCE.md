# 🚀 Agency Portal - Quick Reference

## 📁 File Structure

```
src/
├── lib/tenant/
│   ├── tenant-service.ts          # Core tenant logic
│   └── tenant-context.tsx         # React context
├── app/api/
│   ├── tenant/current/route.ts    # Get current tenant
│   └── agency/
│       ├── onboarding/route.ts    # Create agency
│       ├── dashboard/route.ts     # Dashboard data
│       ├── clients/route.ts       # Client CRUD
│       ├── settings/route.ts      # Agency settings
│       └── billing/route.ts       # Billing data
└── components/agency/
    ├── AgencyOnboarding.tsx       # Onboarding wizard
    ├── AgencyDashboard.tsx        # Main dashboard
    ├── ClientManagement.tsx       # Client management
    ├── BrandingSettings.tsx       # Branding UI
    └── BillingManagement.tsx      # Billing UI
```

---

## 🔌 API Quick Reference

### Create Agency
```typescript
POST /api/agency/onboarding
{
  "name": "Digital Marketing Pro",
  "slug": "dmp",
  "brandName": "DMP Solutions",
  "supportEmail": "support@dmp.com",
  "primaryColor": "#FF6B35",
  "secondaryColor": "#10B981",
  "accentColor": "#8B5CF6",
  "plan": "AGENCY_PRO"
}
```

### Get Dashboard
```typescript
GET /api/agency/dashboard
// Returns: stats, clients, activity, revenue
```

### List Clients
```typescript
GET /api/agency/clients?page=1&limit=10&search=acme&status=ACTIVE
```

### Add Client
```typescript
POST /api/agency/clients
{
  "brandId": "brand_123",
  "clientName": "Acme Corp",
  "clientEmail": "contact@acme.com",
  "monthlyFee": 50.00
}
```

### Update Settings
```typescript
PUT /api/agency/settings
{
  "brandName": "New Name",
  "primaryColor": "#FF0000",
  "logo": "https://example.com/logo.png"
}
```

### Get Billing
```typescript
GET /api/agency/billing?page=1
// Returns: usage, current month, history
```

---

## 🎨 Component Usage

### Tenant Provider
```tsx
// Wrap your app
import { TenantProvider } from '@/lib/tenant/tenant-context';

<TenantProvider>
  {children}
</TenantProvider>
```

### Use Tenant Hook
```tsx
import { useTenant, useTenantStyling } from '@/lib/tenant/tenant-context';

function MyComponent() {
  const { tenant, isLoading } = useTenant();
  const { colors, branding } = useTenantStyling();

  return (
    <div style={{ color: colors.primary }}>
      {branding.name}
    </div>
  );
}
```

### Agency Dashboard
```tsx
import AgencyDashboard from '@/components/agency/AgencyDashboard';

<AgencyDashboard tenantId={tenant?.id} />
```

### Client Management
```tsx
import ClientManagement from '@/components/agency/ClientManagement';

<ClientManagement tenantId={tenant?.id} />
```

### Branding Settings
```tsx
import BrandingSettings from '@/components/agency/BrandingSettings';

<BrandingSettings />
```

### Billing Management
```tsx
import BillingManagement from '@/components/agency/BillingManagement';

<BillingManagement />
```

---

## 🔧 Service Functions

### Create Tenant
```typescript
import { createTenant } from '@/lib/tenant/tenant-service';

const tenant = await createTenant({
  name: 'Agency Name',
  slug: 'agency-slug',
  brandName: 'Brand Name',
  supportEmail: 'support@agency.com',
  primaryColor: '#3B82F6',
  plan: 'AGENCY_PRO',
  clientLimit: 50,
}, ownerId);
```

### Get Tenant by Domain
```typescript
import { getTenantByDomain } from '@/lib/tenant/tenant-service';

const tenant = await getTenantByDomain('agency.parichay.io');
```

### Add Client
```typescript
import { addClientToTenant } from '@/lib/tenant/tenant-service';

const client = await addClientToTenant(tenantId, brandId, {
  clientName: 'Client Name',
  clientEmail: 'client@example.com',
  monthlyFee: 50.00,
});
```

### Get Stats
```typescript
import { getTenantStats } from '@/lib/tenant/tenant-service';

const stats = await getTenantStats(tenantId);
// Returns: totalClients, activeClients, totalBrands, etc.
```

### Generate Billing
```typescript
import { generateMonthlyBilling } from '@/lib/tenant/tenant-service';

const billing = await generateMonthlyBilling(tenantId);
```

---

## 🎯 Common Patterns

### Protect Agency Routes
```typescript
// middleware.ts or in component
const authResult = await verifyAuth(request);
if (!authResult.user?.tenantId || authResult.user.role !== 'TENANT_ADMIN') {
  return redirect('/unauthorized');
}
```

### Get Current Tenant
```typescript
// Client-side
const { tenant } = useTenant();

// Server-side
const host = request.headers.get('host');
const tenant = await getTenantByDomain(host);
```

### Apply Tenant Branding
```typescript
const { colors, branding } = useTenantStyling();

<button style={{ backgroundColor: colors.primary }}>
  {branding.name}
</button>
```

### Check Client Limit
```typescript
import { canAddClient } from '@/lib/tenant/tenant-service';

const canAdd = await canAddClient(tenantId);
if (!canAdd) {
  toast.error('Client limit reached');
}
```

---

## 💾 Database Queries

### Get Tenant with Clients
```typescript
const tenant = await prisma.tenant.findUnique({
  where: { id: tenantId },
  include: {
    clients: {
      include: {
        brand: true,
      },
    },
  },
});
```

### Get Active Clients
```typescript
const clients = await prisma.tenantClient.findMany({
  where: {
    tenantId,
    status: 'ACTIVE',
  },
  include: {
    brand: {
      include: {
        branches: true,
      },
    },
  },
});
```

### Get Billing History
```typescript
const billing = await prisma.tenantBilling.findMany({
  where: { tenantId },
  orderBy: { periodStart: 'desc' },
  take: 12,
});
```

---

## 🎨 Styling with Tenant Colors

### Inline Styles
```tsx
<div style={{
  backgroundColor: colors.primary,
  color: 'white'
}}>
  Content
</div>
```

### CSS Variables
```tsx
// Set CSS variables
useEffect(() => {
  document.documentElement.style.setProperty('--primary', colors.primary);
  document.documentElement.style.setProperty('--secondary', colors.secondary);
}, [colors]);

// Use in CSS
.button {
  background-color: var(--primary);
}
```

### Tailwind (Dynamic)
```tsx
<div className="bg-blue-600" style={{ backgroundColor: colors.primary }}>
  Content
</div>
```

---

## 🔐 Access Control

### Role Checks
```typescript
// TENANT_ADMIN only
if (user.role !== 'TENANT_ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// Check tenant ownership
if (user.tenantId !== tenantId) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Data Scoping
```typescript
// Always scope by tenantId
const clients = await prisma.tenantClient.findMany({
  where: {
    tenantId: user.tenantId, // Always include this
    status: 'ACTIVE',
  },
});
```

---

## 📊 Billing Calculations

### Monthly Total
```typescript
const baseFee = planPricing[tenant.plan]; // 99, 299, or 999
const clientFees = activeClients * tenant.pricePerClient; // clients × $10
const total = baseFee + clientFees;
```

### Usage Percentage
```typescript
const utilizationPercent = Math.round(
  (activeClients / tenant.clientLimit) * 100
);
```

### Year-to-Date
```typescript
const ytd = await prisma.tenantBilling.aggregate({
  where: {
    tenantId,
    periodStart: { gte: new Date(new Date().getFullYear(), 0, 1) },
    status: 'PAID',
  },
  _sum: { total: true },
});
```

---

## 🚨 Error Handling

### API Errors
```typescript
try {
  const response = await fetch('/api/agency/clients');
  const data = await response.json();

  if (!response.ok) {
    toast.error(data.error || 'Something went wrong');
    return;
  }

  // Success
  setClients(data.clients);
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to load clients');
}
```

### Validation Errors
```typescript
import { z } from 'zod';

try {
  const validatedData = schema.parse(body);
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Invalid data', details: error.errors },
      { status: 400 }
    );
  }
}
```

---

## 🧪 Testing

### Test Onboarding
```bash
# 1. Create account
# 2. Go to /agency/onboarding
# 3. Fill in all 4 steps
# 4. Submit
# 5. Should redirect to /agency/dashboard
```

### Test Client Management
```bash
# 1. Go to /agency/clients
# 2. Click "Add Client"
# 3. Fill in form
# 4. Submit
# 5. Should see new client in table
```

### Test Branding
```bash
# 1. Go to /agency/settings
# 2. Change colors
# 3. Click "Save Changes"
# 4. Refresh page
# 5. Should see new colors
```

---

## 📚 Resources

- **Full Documentation**: `WHITE_LABEL_PLATFORM_IMPLEMENTATION.md`
- **Complete Guide**: `AGENCY_PORTAL_COMPLETE.md`
- **Database Schema**: `prisma/migrations/add_white_label_support.sql`
- **Service Layer**: `src/lib/tenant/tenant-service.ts`

---

## 💡 Tips

1. **Always scope by tenantId** in queries
2. **Check client limits** before adding clients
3. **Use tenant context** for branding
4. **Validate domains** before saving
5. **Generate billing** at month end
6. **Cache tenant data** for performance
7. **Test with multiple tenants** to ensure isolation

---

## 🎉 Quick Start

```bash
# 1. Run migration
psql -d parichay -f prisma/migrations/add_white_label_support.sql

# 2. Start dev server
npm run dev

# 3. Create agency
# Go to /agency/onboarding

# 4. Add clients
# Go to /agency/clients

# 5. Customize branding
# Go to /agency/settings

# 6. View billing
# Go to /agency/billing
```

**That's it! You're ready to go!** 🚀
