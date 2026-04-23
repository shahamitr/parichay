# 🚀 Quick Start Guide

## Prerequisites Checklist

Before running the app, ensure you have:

- [ ] Node.js (v18 or higher) installed
- [ ] Database (PostgreSQL or MySQL) installed and running
- [ ] Git installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd parichay
npm install
```

### 2. Choose Your Database

#### Option A: PostgreSQL (Recommended)

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/
   - Run installer and remember the password
   - Keep default port: 5432

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE parichay;

   # Create user (optional)
   CREATE USER parichay_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE parichay TO parichay_user;

   # Exit
   \q
   ```

3. **Update .env**
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/parichay"
   ```

#### Option B: MySQL (Good for XAMPP users)

1. **Start MySQL in XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Wait for it to turn green

2. **Create Database**
   - Click "Admin" next to MySQL (opens phpMyAdmin)
   - Click "New" in left sidebar
   - Database name: `parichay`
   - Click "Create"

3. **Update Prisma Schema**
   - Open `prisma/schema.prisma`
   - Change `provider = "postgresql"` to `provider = "mysql"`

4. **Update .env**
   ```env
   DATABASE_URL="mysql://root@localhost:3306/parichay"
   ```

### 3. Configure Environment Variables

Update your `.env` file:

```env
# Database (choose one)
DATABASE_URL="postgresql://postgres:password@localhost:5432/parichay"
# OR
DATABASE_URL="mysql://root@localhost:3306/parichay"

# Authentication
NEXTAUTH_SECRET="your-super-secret-jwt-key-change-this"
NEXTAUTH_URL="http://localhost:3000"

# Application
NODE_ENV="development"
APP_URL="http://localhost:3000"

# Optional: Email Service
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
AWS_S3_BUCKET="parichay-assets"
```

### 4. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed with sample data
npm run prisma:seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The app should now be running at: **http://localhost:3000**

## Setup Checklist

Use this checklist to verify your setup:

### Database Setup
- [ ] Database service is running
- [ ] Database `parichay` exists
- [ ] DATABASE_URL in .env is correct
- [ ] Prisma client generated
- [ ] Migrations completed

### Application Setup
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Development server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Landing page loads correctly

### Optional Services
- [ ] Email service configured (if needed)
- [ ] SMS service configured (if needed)
- [ ] Payment gateways configured (if needed)
- [ ] File storage configured (if needed)

## First Time Access

After starting the app:

1. Go to http://localhost:3000
2. You should see the Parichay landing page
3. Register a new account or use seeded data
4. Default admin credentials (if seeded):
   - Email: admin@example.com
   - Password: Check the seed script for password

## Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
1. Check if database service is running:
   - PostgreSQL: Check Services (services.msc) for PostgreSQL
   - MySQL: Check XAMPP Control Panel
2. Verify database credentials in `.env`
3. Test connection:
   ```bash
   # PostgreSQL
   psql -U postgres -h localhost -p 5432

   # MySQL
   mysql -u root -p -h localhost -P 3306
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
   -- PostgreSQL
   DROP DATABASE parichay;
   CREATE DATABASE parichay;

   -- MySQL
   DROP DATABASE parichay;
   CREATE DATABASE parichay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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
   - Windows: Use WSL or Docker: `docker run -d -p 6379:6379 redis`

## Minimal Setup (Without Optional Services)

If you want to run the app with minimal configuration:

1. **Required:**
   - Database (PostgreSQL or MySQL)
   - Basic `.env` with DATABASE_URL and NEXTAUTH_SECRET

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
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

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
- Review `/docs` folder for feature-specific guides
- Check installation guide for detailed setup
- Review deployment guide for production setup

---

**Happy coding! 🚀**
