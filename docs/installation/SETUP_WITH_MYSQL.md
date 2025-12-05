# Using MySQL Instead of PostgreSQL

Since you have XAMPP with MySQL, you can configure the app to use MySQL instead.

## Steps to Switch to MySQL

### 1. Update Prisma Schema

Edit `prisma/schema.prisma`:

**Change this:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**To this:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 2. Start MySQL in XAMPP

1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Wait for it to turn green

### 3. Create Database

**Option A: Using phpMyAdmin**
1. Click "Admin" next to MySQL in XAMPP
2. Click "New" in the left sidebar
3. Database name: `onetouch_bizcard`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

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

### 4. Update .env File

Update your `onetouch-bizcard/.env`:

```env
# For MySQL with XAMPP (default no password)
DATABASE_URL="mysql://root@localhost:3306/onetouch_bizcard"

# Or if you set a password:
DATABASE_URL="mysql://root:your_password@localhost:3306/onetouch_bizcard"
```

### 5. Install MySQL Client (if needed)

```bash
cd onetouch-bizcard
npm install @prisma/client
```

### 6. Generate Prisma Client

```bash
npm run prisma:generate
```

### 7. Run Migrations

```bash
npm run prisma:migrate
```

### 8. Start the App

```bash
npm run dev
```

## MySQL vs PostgreSQL Differences

### Advantages of MySQL
- ✅ Already installed with XAMPP
- ✅ Familiar phpMyAdmin interface
- ✅ No additional installation needed

### Advantages of PostgreSQL (Original)
- ✅ Better JSON support
- ✅ More advanced features
- ✅ Better for production

## Recommendation

**For Development**: MySQL is fine and easier since you have XAMPP

**For Production**: Consider PostgreSQL for better features and performance

## Troubleshooting

### Issue: "Can't reach database server at localhost:3306"

**Solution**:
1. Make sure MySQL is running in XAMPP
2. Check if port 3306 is not blocked
3. Verify credentials in .env

### Issue: Migration errors

**Solution**:
Some PostgreSQL-specific features might need adjustment:
1. Check migration files in `prisma/migrations`
2. You might need to reset and recreate migrations:
   ```bash
   # Delete migrations folder
   rm -rf prisma/migrations

   # Create new migration
   npx prisma migrate dev --name init
   ```

### Issue: JSON field errors

**Solution**:
MySQL handles JSON differently. If you get JSON errors:
1. Make sure you're using MySQL 5.7+ or 8.0+
2. JSON fields should work, but syntax might differ slightly

## Next Steps

After MySQL is set up:

1. ✅ XAMPP MySQL running
2. ✅ Database created
3. ✅ Prisma schema updated to use MySQL
4. ✅ .env updated with MySQL connection
5. Run: `npm run prisma:generate`
6. Run: `npm run prisma:migrate`
7. Run: `npm run dev`

---

**Note**: If you encounter issues with MySQL, I recommend installing PostgreSQL instead (see SETUP_POSTGRESQL.md).
