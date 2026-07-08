@echo off
REM =============================================================================
REM Parichay Dev Environment — Hot Reload Containers
REM Run this to start the full stack with file watching
REM =============================================================================

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   Parichay Dev Environment               ║
echo  ║   Next.js + MySQL + Redis (Hot Reload)   ║
echo  ╚══════════════════════════════════════════╝
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Stop XAMPP MySQL if running (port conflict)
echo [1/4] Checking for port conflicts...
netstat -ano | findstr ":5432" >nul 2>&1
if %errorlevel% equ 0 (
    echo  ⚠  Port 5432 is in use. Stop local PostgreSQL first, or Docker will use its own.
)

REM Start containers
echo [2/4] Starting containers (MySQL + Redis + App)...
docker compose -f docker-compose.dev.yml up -d --build

REM Wait for MySQL to be healthy
echo [3/4] Waiting for PostgreSQL to be ready...
:wait_db
docker compose -f docker-compose.dev.yml exec -T db pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto wait_db
)
echo  ✓ PostgreSQL ready

REM Run migrations
echo [4/4] Running database migrations...
docker compose -f docker-compose.dev.yml exec -T app npx prisma db push --skip-generate
if %errorlevel% neq 0 (
    echo  ⚠  Migration had issues. You may need to run: docker compose -f docker-compose.dev.yml exec app npx prisma db push
)

echo.
echo  ════════════════════════════════════════════
echo  ✅ Dev environment running!
echo.
echo  App:      http://localhost:3000
echo  PostgreSQL: localhost:5432 (postgres/postgres)
echo  Redis:    localhost:6379
echo.
echo  Logs:     docker compose -f docker-compose.dev.yml logs -f app
echo  Stop:     docker compose -f docker-compose.dev.yml down
echo  Reset DB: docker compose -f docker-compose.dev.yml down -v
echo  ════════════════════════════════════════════
echo.

REM Show app logs
docker compose -f docker-compose.dev.yml logs -f app
