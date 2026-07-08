# Quick Start Guide

## Option 1: Docker (Recommended — Zero Setup)

### Prerequisites
- Docker Desktop installed and running

### Steps

```bash
# Windows
dev.bat

# Mac/Linux
chmod +x dev.sh
./dev.sh
```

That's it. This:
1. Builds the app container with all dependencies
2. Starts MySQL 8 + Redis 7
3. Creates the database and tables
4. Starts Next.js with hot reload

**Open:** http://localhost:3000

### Stopping

```bash
dev-stop.bat                                    # Windows
docker compose -f docker-compose.dev.yml down   # Any OS
```

### Resetting (wipe database)

```bash
docker compose -f docker-compose.dev.yml down -v
dev.bat   # Starts fresh
```

---

## Option 2: Manual (XAMPP + Local Node)

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- XAMPP (MySQL 8) running
- Redis (optional — app works without it)

### Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Create database
# Open phpMyAdmin (http://localhost/phpmyadmin) and run:
CREATE DATABASE parichay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL=mysql://root@localhost:3306/parichay

# 4. Generate Prisma client and push schema
pnpm prisma:generate
pnpm prisma:push

# 5. (Optional) Seed demo data
pnpm seed:demo

# 6. Start dev server
pnpm dev
```

**Open:** http://localhost:3000

---

## First Login

After setup, create a super admin:

```bash
# Via Docker
docker compose -f docker-compose.dev.yml exec app npx ts-node scripts/create-admin.ts

# Without Docker
npx ts-node scripts/create-admin.ts
```

Or register at http://localhost:3000/register — the first user gets BRAND_MANAGER role.

---

## Common Issues

### "Please make sure your database server is running"
- **Docker:** Run `dev.bat` — it handles everything
- **Manual:** Start MySQL in XAMPP Control Panel, then ensure `parichay` database exists

### Pages show "Service Temporarily Unavailable"
- Database tables haven't been created yet. Run `pnpm prisma:push`

### Port 3306 already in use
- Stop XAMPP MySQL if using Docker (both use port 3306)
- Or change the port in `docker-compose.dev.yml`

### Hot reload not working in Docker
- `WATCHPACK_POLLING=true` is set in docker-compose.dev.yml
- If still not working, restart: `docker compose -f docker-compose.dev.yml restart app`
