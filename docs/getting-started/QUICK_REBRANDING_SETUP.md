# Quick Setup After Rebranding to Parichay

## ⚠️ Important: Database Update Required

Since we've rebranded to **Parichay**, you need to update your database.

## Option 1: Create New Database (Recommended)

1. **Create the new database**:
   ```bash
   # Using MySQL command line
   mysql -u root -p
   ```

   Then run:
   ```sql
   CREATE DATABASE parichay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Or use the SQL file**:
   ```bash
   mysql -u root -p < create-database.sql
   ```

3. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

4. **Seed demo data** (optional):
   ```bash
   npm run seed:demo
   ```

## Option 2: Rename Existing Database

If you want to keep your existing data:

```sql
-- MySQL doesn't support direct rename, so we need to dump and restore
mysqldump -u root -p onetouch_bizcard > backup.sql
mysql -u root -p -e "CREATE DATABASE parichay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p parichay < backup.sql
```

## Verify Setup

1. **Check your `.env` file**:
   ```
   DATABASE_URL="mysql://root@localhost:3306/parichay"
   ```

2. **Restart the dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

3. **Visit the app**:
   - Open http://localhost:3001 (or 3000)
   - You should see "Parichay" branding throughout

## Test Login

Default credentials (after seeding):
- Email: `admin@onetouch.local`
- Password: `Admin@123`

## Clear Cache (if needed)

If you see old branding:
```bash
# Delete Next.js cache
rm -rf .next
# Or on Windows
rmdir /s /q .next

# Restart dev server
npm run dev
```

## What Changed?

- ✅ Brand name: **OneTouch BizCard** → **Parichay**
- ✅ Logo initial: **OT** → **P**
- ✅ Database: `onetouch_bizcard` → `parichay`
- ✅ Domain references: `onetouchbizcard.in` → `parichay.com`
- ✅ All UI components updated

## Need Help?

Check `REBRANDING_TO_PARICHAY.md` for complete details of all changes made.
