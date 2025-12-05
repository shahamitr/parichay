# MySQL Setup for Windows

This guide explains how to set up the application with MySQL using XAMPP.

## Steps to Set Up MySQL

### 1. Start MySQL in XAMPP

1.  Open XAMPP Control Panel
2.  Click "Start" next to MySQL
3.  Wait for it to turn green

### 2. Create Database

**Option A: Using phpMyAdmin**
1.  Click "Admin" next to MySQL in XAMPP
2.  Click "New" in the left sidebar
3.  Database name: `onetouch_bizcard`
4.  Collation: `utf8mb4_unicode_ci`
5.  Click "Create"

**Option B: Using Command Line**
```bash
# Navigate to XAMPP MySQL bin
cd D:\xampp\mysql\bin

# Connect to MySQL
.\mysql.exe -u root -p

# Create database
CREATE DATABASE onetouch_bizcard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify
SHOW DATABASES;

# Exit
exit;
```

### 3. Update .env File

Update your `onetouch-bizcard/.env`:

```env
# For MySQL with XAMPP (default no password)
DATABASE_URL="mysql://root@localhost:3306/onetouch_bizcard"

# Or if you set a password:
DATABASE_URL="mysql://root:your_password@localhost:3306/onetouch_bizcard"
```

### 4. Install MySQL Client (if needed)

```bash
cd onetouch-bizcard
npm install @prisma/client
```

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Run Migrations

```bash
npm run prisma:migrate
```

### 7. Start the App

```bash
npm run dev
```

## Troubleshooting

### Issue: "Can't reach database server at localhost:3306"

**Solution**:
1.  Make sure MySQL is running in XAMPP
2.  Check if port 3306 is not blocked
3.  Verify credentials in .env

### Issue: Migration errors

**Solution**:
If you have issues with migrations, you might need to reset and recreate them:
```bash
# Delete migrations folder
rm -rf prisma/migrations

# Create new migration
npx prisma migrate dev --name init
```

### Issue: JSON field errors

**Solution**:
MySQL handles JSON differently. If you get JSON errors:
1.  Make sure you're using MySQL 5.7+ or 8.0+
2.  JSON fields should work, but syntax might differ slightly

## Next Steps

After MySQL is set up:

1.  ✅ XAMPP MySQL running
2.  ✅ Database created
3.  ✅ .env updated with MySQL connection
4.  Run: `npm run prisma:generate`
5.  Run: `npm run prisma:migrate`
6.  Run: `npm run dev`
