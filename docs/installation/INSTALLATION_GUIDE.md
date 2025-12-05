# 🚀 Parichay.io - Complete Installation Guide

## Quick Installation

### Option 1: Using Prisma (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 3. Generate Prisma client
npx prisma generate

# 4. Push schema to database
npx prisma db push

# 5. Start development server
npm run dev
```

### Option 2: Manual SQL Installation

If you prefer to run SQL migrations manually:

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE parichay;"

# 2. Run migrations in order
psql -d parichay -f prisma/migrations/add_white_label_support.sql
psql -d parichay -f prisma/migrations/add_mfa_fields.sql
psql -d parichay -f prisma/migrations/add_verification_system/migration.sql
psql -d parichay -f prisma/migrations/add_shortlinks_and_privacy/migration.sql
psql -d parichay -f prisma/migrations/add_social_premium_features/migration.sql
psql -d parichay -f prisma/migrations/add_performance_indexes.sql
```

## Database Migrations Included

### 1. White-Label Multi-Tenant Support
**File**: `prisma/migrations/add_white_label_support.sql`

Creates:
- `Tenant` table - Agency management
- `TenantClient` table - Client relationships
- `TenantBilling` table - Monthly billing
- `TenantInvitation` table - Client invitations
- Adds `tenantId` to User and Brand tables

### 2. Multi-Factor Authentication
**File**: `prisma/migrations/add_mfa_fields.sql`

Adds to User table:
- `mfaEnabled` - MFA status
- `mfaSecret` - TOTP secret
- `backupCodes` - Recovery codes

### 3. Verification System
**File**: `prisma/migrations/add_verification_system/migration.sql`

Adds to Branch table:
- `isVerified` - Verification status
- `verifiedAt` - Verification timestamp
- `completionScore` - Profile completion

Adds to Brand table:
- `isVerified` - Brand verification
- `verificationBadge` - Badge type

### 4. Short Links & Privacy
**File**: `prisma/migrations/add_shortlinks_and_privacy/migration.sql`

Creates:
- `ShortLink` table - URL shortener

Adds to Branch table:
- `visibility` - Public/private/unlisted
- `accessPassword` - Password protection
- `accessToken` - Token-based access

### 5. Social & Premium Features
**File**: `prisma/migrations/add_social_premium_features/migration.sql`

Creates:
- `VideoTestimonial` - Video testimonials
- `SocialProofBadge` - Trust badges
- `PortfolioItem` - Portfolio showcase
- `Offer` - Promotions and offers
- `VoiceIntro` - Voice introductions
- `WhatsAppCatalogue` - WhatsApp integration
- `WhatsAppCatalogueItem` - Catalogue items

### 6. Performance Indexes
**File**: `prisma/migrations/add_performance_indexes.sql`

Adds indexes for:
- Brand, Branch, User tables
- Subscription, Payment tables
- Lead, Analytics tables
- QR Code, Notification tables

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/parichay"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Payment (optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# AWS S3 (optional)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="parichay-uploads"
```

## Post-Installation Steps

### 1. Create Admin User

```bash
node onetouch-bizcard/create-admin.js
```

### 2. Seed Demo Data (Optional)

```bash
psql -d parichay -f onetouch-bizcard/insert-demo-data.sql
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Create Your First Agency

1. Sign up at `/signup`
2. Go to `/agency/onboarding`
3. Complete the 4-step wizard
4. Start adding clients!

## Verification

### Check Database Tables

```sql
-- List all tables
\dt

-- Check tenant table
SELECT * FROM "Tenant";

-- Check if indexes exist
\di
```

### Test API Endpoints

```bash
# Test tenant API
curl http://localhost:3000/api/tenant/current

# Test agency dashboard
curl http://localhost:3000/api/agency/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U postgres -d parichay -c "SELECT version();"

# Check if database exists
psql -U postgres -l | grep parichay
```

### Migration Errors

If you encounter errors:

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or manually drop and recreate
psql -U postgres -c "DROP DATABASE parichay;"
psql -U postgres -c "CREATE DATABASE parichay;"

# Then run migrations again
npx prisma db push
```

### Permission Issues

```sql
-- Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE parichay TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

## Migration Order

**Important**: Run migrations in this exact order:

1. ✅ `add_white_label_support.sql` - Core multi-tenant tables
2. ✅ `add_mfa_fields.sql` - MFA support
3. ✅ `add_verification_system/migration.sql` - Verification
4. ✅ `add_shortlinks_and_privacy/migration.sql` - Short links
5. ✅ `add_social_premium_features/migration.sql` - Premium features
6. ✅ `add_performance_indexes.sql` - Performance optimization

## Features Enabled

After installation, you'll have:

✅ Multi-tenant white-label platform
✅ Agency onboarding and management
✅ Client management system
✅ Billing and usage tracking
✅ Multi-factor authentication
✅ Verification system
✅ Short links and privacy controls
✅ Video testimonials
✅ Social proof badges
✅ Portfolio showcase
✅ Offers and promotions
✅ Voice introductions
✅ WhatsApp catalogue integration
✅ Performance-optimized queries

## Next Steps

1. **Read Documentation**
   - `WHITE_LABEL_IMPLEMENTATION_SUMMARY.md`
   - `AGENCY_PORTAL_COMPLETE.md`
   - `AGENCY_QUICK_REFERENCE.md`

2. **Test Features**
   - Create an agency
   - Add clients
   - Customize branding
   - View billing

3. **Deploy to Production**
   - Set up production database
   - Configure environment variables
   - Deploy to Vercel/AWS/etc.

## Support

For issues or questions:
- Check documentation in `/docs`
- Review `AGENCY_QUICK_REFERENCE.md`
- Contact: support@parichay.io

---

**Installation complete! 🎉**

Your Parichay white-label platform is ready to use.
