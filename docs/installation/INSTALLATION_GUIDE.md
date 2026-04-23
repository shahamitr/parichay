# 🚀 Complete Installation Guide

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

## Database Setup Options

### Option A: PostgreSQL (Recommended for Production)

#### Install PostgreSQL
```bash
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql
```

#### Create Database
```sql
CREATE DATABASE parichay;
CREATE USER parichay_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE parichay TO parichay_user;
```

#### Environment Variables
```env
DATABASE_URL="postgresql://parichay_user:your_password@localhost:5432/parichay"
```

### Option B: MySQL (Good for Development with XAMPP)

#### Using XAMPP
1. Open XAMPP Control Panel
2. Start MySQL service
3. Click "Admin" to open phpMyAdmin
4. Create database: `onetouch_bizcard`

#### Update Prisma Schema
Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"  // Change from "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Environment Variables
```env
# For XAMPP (default no password)
DATABASE_URL="mysql://root@localhost:3306/onetouch_bizcard"

# Or with password
DATABASE_URL="mysql://root:your_password@localhost:3306/onetouch_bizcard"
```

#### Command Line Setup
```bash
# Navigate to XAMPP MySQL bin
cd D:\xampp\mysql\bin

# Connect to MySQL
.\mysql.exe -u root -p

# Create database
CREATE DATABASE onetouch_bizcard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Environment Variables

Create a `.env` file with:

```env
# Database (choose one)
DATABASE_URL="postgresql://user:password@localhost:5432/parichay"
# OR
DATABASE_URL="mysql://root@localhost:3306/onetouch_bizcard"

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

## Database Migrations Included

### 1. White-Label Multi-Tenant Support
Creates:
- `Tenant` table - Agency management
- `TenantClient` table - Client relationships
- `TenantBilling` table - Monthly billing
- `TenantInvitation` table - Client invitations

### 2. Multi-Factor Authentication
Adds to User table:
- `mfaEnabled` - MFA status
- `mfaSecret` - TOTP secret
- `backupCodes` - Recovery codes

### 3. Verification System
Adds verification status and completion scoring

### 4. Short Links & Privacy
Creates URL shortener and privacy controls

### 5. Social & Premium Features
Creates video testimonials, social proof badges, portfolio items

### 6. Performance Indexes
Optimizes database queries with proper indexing

## Post-Installation Steps

### 1. Create Admin User
```bash
node scripts/create-admin.js
```

### 2. Seed Demo Data (Optional)
```bash
npm run prisma:seed
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## Troubleshooting

### Database Connection Issues

**PostgreSQL:**
```bash
# Test connection
psql -U postgres -d parichay -c "SELECT version();"

# Check if database exists
psql -U postgres -l | grep parichay
```

**MySQL:**
```bash
# Test connection
mysql -u root -p -e "SHOW DATABASES;"

# Check if database exists
mysql -u root -p -e "SHOW DATABASES;" | grep onetouch_bizcard
```

### Migration Errors

If you encounter errors:

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or manually drop and recreate
# PostgreSQL:
psql -U postgres -c "DROP DATABASE parichay;"
psql -U postgres -c "CREATE DATABASE parichay;"

# MySQL:
mysql -u root -p -e "DROP DATABASE onetouch_bizcard;"
mysql -u root -p -e "CREATE DATABASE onetouch_bizcard;"

# Then run migrations again
npx prisma db push
```

### Port Issues

**Issue: "Port 3000 is already in use"**
```bash
# Windows - Kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
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

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Default Ports

- **Next.js App**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## Next Steps

1. **Read Documentation**
   - Check `/docs` folder for feature guides
   - Review API documentation
   - Test all features

2. **Deploy to Production**
   - Set up production database
   - Configure environment variables
   - Deploy to Vercel/Railway/Render

## Support

For issues or questions:
- Check documentation in `/docs`
- Contact: support@parichay.io

---

**Installation complete! 🎉**

Your Parichay platform is ready to use.
