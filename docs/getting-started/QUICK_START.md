# OneTouch BizCard - Quick Start Guide

## Prerequisites Checklist

Before running the app, ensure you have:

- [ ] Node.js (v18 or higher) installed
- [ ] PostgreSQL database installed and running
- [ ] Redis installed and running (optional, for caching)
- [ ] Git installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd onetouch-bizcard
npm install
```

### 2. Set Up PostgreSQL Database

#### Option A: Using XAMPP (if you have it)
1. Start XAMPP Control Panel
2. Start PostgreSQL service
3. Open pgAdmin or use command line

#### Option B: Using PostgreSQL directly
1. Start PostgreSQL service:
   ```bash
   # Windows (if installed as service)
   net start postgresql-x64-14

   # Or check services.msc and start PostgreSQL
   ```

2. Create the database:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE onetouch_bizcard;

   # Create user (optional)
   CREATE USER onetouch_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE onetouch_bizcard TO onetouch_user;

   # Exit
   \q
   ```

### 3. Configure Environment Variables

Update your `.env` file with correct database credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/onetouch_bizcard"

# JWT
JWT_SECRET="your-jwt-secret-key-change-this-in-production"

# Application
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"

# Optional: Email Service (for testing)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Optional: SMS Service (Twilio)
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Optional: Payment Gateways
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Optional: Redis (for caching)
REDIS_URL="redis://localhost:6379"

# Optional: AWS S3 (for file storage)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="onetouch-bizcard-assets"
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Run Database Migrations

```bash
npm run prisma:migrate
```

If you get an error about the database not being accessible, make sure PostgreSQL is running.

### 6. (Optional) Seed the Database

```bash
npm run prisma:seed
```

This will create sample data for testing.

### 7. Start the Development Server

```bash
npm run dev
```

The app should now be running at: **http://localhost:3000**

## Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
1. Check if PostgreSQL is running:
   - Windows: Open Services (services.msc) and look for PostgreSQL
   - Or check Task Manager → Services tab
2. Verify database credentials in `.env`
3. Test connection:
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

### Issue: "Port 3000 is already in use"

**Solution:**
1. Kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```
2. Or use a different port:
   ```bash
   npm run dev -- -p 3001
   ```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Prisma migration fails

**Solution:**
1. Reset the database (WARNING: This deletes all data):
   ```bash
   npx prisma migrate reset
   ```
2. Or manually drop and recreate:
   ```sql
   DROP DATABASE onetouch_bizcard;
   CREATE DATABASE onetouch_bizcard;
   ```
3. Then run migrations again:
   ```bash
   npm run prisma:migrate
   ```

### Issue: Redis connection errors

**Solution:**
Redis is optional. If you don't have it installed:
1. Comment out Redis-related code, or
2. Install Redis:
   - Windows: Use WSL or download from https://github.com/microsoftarchive/redis/releases
   - Or use Docker: `docker run -d -p 6379:6379 redis`

## Minimal Setup (Without Optional Services)

If you want to run the app with minimal configuration:

1. **Required:**
   - PostgreSQL database
   - Basic `.env` with DATABASE_URL and JWT_SECRET

2. **Optional (can skip for now):**
   - Email service (SMTP)
   - SMS service (Twilio)
   - Payment gateways (Stripe/Razorpay)
   - Redis caching
   - AWS S3 storage

The app will work without optional services, but some features will be disabled.

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
- **Redis**: localhost:6379

## First Time Access

After starting the app:

1. Go to http://localhost:3000
2. You should see the landing page
3. Register a new account or use seeded data (if you ran seed script)
4. Default admin credentials (if seeded):
   - Email: admin@example.com
   - Password: Check the seed script for password

## Next Steps

1. ✅ Get the app running
2. Create your first brand
3. Add branches
4. Create microsites
5. Generate QR codes
6. Test lead capture
7. Configure optional services (Email, SMS, Payments)

## Need Help?

- Check the main README.md for detailed documentation
- Review `docs/` folder for feature-specific guides
- Check `SMS_SETUP_GUIDE.md` for SMS configuration
- Review `docs/SMS_NOTIFICATIONS.md` for SMS features

---

**Happy coding! 🚀**
