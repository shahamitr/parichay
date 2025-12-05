# Setup Checklist - OneTouch BizCard

Follow these steps to get the app running:

## ☐ Step 1: Choose Your Database

### Option A: Use MySQL (Easier - You have XAMPP)

1. **Start MySQL in XAMPP**
   - [ ] Open XAMPP Control Panel
   - [ ] Click "Start" next to MySQL
   - [ ] Wait for it to turn green

2. **Create Database**
   - [ ] Click "Admin" next to MySQL (opens phpMyAdmin)
   - [ ] Click "New" in left sidebar
   - [ ] Database name: `onetouch_bizcard`
   - [ ] Click "Create"

3. **Update Prisma Schema**
   - [ ] Open `prisma/schema.prisma`
   - [ ] Change `provider = "postgresql"` to `provider = "mysql"`

4. **Update .env**
   - [ ] Open `.env` file
   - [ ] Change DATABASE_URL to:
   ```
   DATABASE_URL="mysql://root@localhost:3306/onetouch_bizcard"
   ```

### Option B: Use PostgreSQL (Recommended)

1. **Install PostgreSQL**
   - [ ] Download from: https://www.postgresql.org/download/windows/
   - [ ] Run installer
   - [ ] Remember the password you set!
   - [ ] Keep default port: 5432

2. **Create Database**
   - [ ] Open pgAdmin or command line
   - [ ] Create database: `onetouch_bizcard`

3. **Update .env**
   - [ ] Open `.env` file
   - [ ] Update DATABASE_URL:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/onetouch_bizcard"
   ```

## ☐ Step 2: Install Dependencies

Open PowerShell or Command Prompt in the `onetouch-bizcard` folder:

```bash
npm install
```

**Or double-click:** `setup.bat`

## ☐ Step 3: Configure Environment

Edit `.env` file with your settings:

```env
# Database (choose one)
DATABASE_URL="mysql://root@localhost:3306/onetouch_bizcard"
# OR
DATABASE_URL="postgresql://postgres:password@localhost:5432/onetouch_bizcard"

# JWT Secret (change this!)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Application
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
```

## ☐ Step 4: Set Up Database

Run these commands:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed with sample data
npm run prisma:seed
```

**Or double-click:** `setup.bat` (does all of this)

## ☐ Step 5: Start the App

```bash
npm run dev
```

**Or double-click:** `start.bat`

The app will be available at: **http://localhost:3000**

## ☐ Step 6: Verify It's Working

- [ ] Open browser to http://localhost:3000
- [ ] You should see the landing page
- [ ] Try registering a new account
- [ ] Check if you can log in

## Optional: Configure Additional Services

### Email Service (for notifications)
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### SMS Service (Twilio)
```env
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Payment Gateways
```env
# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Razorpay
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-secret"
```

## Troubleshooting

### ❌ "Can't reach database server"
- Check if database is running (MySQL in XAMPP or PostgreSQL service)
- Verify DATABASE_URL in .env is correct
- Test database connection

### ❌ "Port 3000 already in use"
- Kill the process: `netstat -ano | findstr :3000`
- Or use different port: `npm run dev -- -p 3001`

### ❌ "Module not found"
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

### ❌ Migration errors
- Make sure database exists
- Check database credentials
- Try: `npx prisma migrate reset` (WARNING: deletes data)

## Quick Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start dev server
npm run dev

# Build for production
npm run build

# Start production
npm start
```

## Files to Check

- [ ] `.env` - Environment variables configured
- [ ] `prisma/schema.prisma` - Database provider set correctly
- [ ] Database is running and accessible
- [ ] Port 3000 is available

## Need Help?

Check these guides:
- `QUICK_START.md` - Detailed setup guide
- `SETUP_POSTGRESQL.md` - PostgreSQL installation
- `SETUP_WITH_MYSQL.md` - MySQL configuration
- `SMS_SETUP_GUIDE.md` - SMS feature setup

---

**Ready to start?** Run `setup.bat` or follow the steps above!
