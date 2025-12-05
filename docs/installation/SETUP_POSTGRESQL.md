# PostgreSQL Setup for Windows

## Quick Install

### Option 1: Download PostgreSQL Installer

1. **Download PostgreSQL**:
   - Go to: https://www.postgresql.org/download/windows/
   - Download the installer (recommended version 14 or 15)
   - Or direct link: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. **Run the Installer**:
   - Double-click the downloaded .exe file
   - Click "Next" through the setup wizard
   - **Important**: Remember the password you set for the postgres user!
   - Default port: 5432 (keep this)
   - Install all components (PostgreSQL Server, pgAdmin, Command Line Tools)

3. **Verify Installation**:
   ```bash
   # Open Command Prompt or PowerShell
   psql --version
   ```

### Option 2: Use Docker (If you have Docker)

```bash
# Pull and run PostgreSQL
docker run --name onetouch-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Verify it's running
docker ps
```

## After Installation

### 1. Start PostgreSQL Service

PostgreSQL should start automatically. If not:

```bash
# Check if service is running
Get-Service postgresql*

# Start the service
net start postgresql-x64-15
```

### 2. Create Database

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to PostgreSQL Server (localhost)
3. Right-click "Databases" → Create → Database
4. Name: `onetouch_bizcard`
5. Click "Save"

**Option B: Using Command Line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted

# Create database
CREATE DATABASE onetouch_bizcard;

# Verify
\l

# Exit
\q
```

### 3. Update .env File

Update your `onetouch-bizcard/.env`:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/onetouch_bizcard"
```

Replace `your_password` with the password you set during installation.

### 4. Test Connection

```bash
cd onetouch-bizcard
npx prisma db push
```

If successful, you're ready to run the app!

## Common Issues

### Issue: "psql: command not found"

**Solution**: Add PostgreSQL to PATH
1. Find PostgreSQL bin folder (usually `C:\Program Files\PostgreSQL\15\bin`)
2. Add to System PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" variable
   - Add PostgreSQL bin folder
   - Restart terminal

### Issue: "Connection refused"

**Solution**:
1. Check if PostgreSQL service is running
2. Verify port 5432 is not blocked by firewall
3. Check if another service is using port 5432

### Issue: "Password authentication failed"

**Solution**:
1. Verify password in .env matches PostgreSQL password
2. Try resetting PostgreSQL password:
   ```bash
   psql -U postgres
   ALTER USER postgres PASSWORD 'new_password';
   ```

## Next Steps

After PostgreSQL is set up:

1. ✅ PostgreSQL installed and running
2. ✅ Database created
3. ✅ .env updated with correct credentials
4. Run: `npm run prisma:generate`
5. Run: `npm run prisma:migrate`
6. Run: `npm run dev`

---

**Need help?** Check the QUICK_START.md guide for complete setup instructions.
