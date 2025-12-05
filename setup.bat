@echo off
echo ========================================
echo OneTouch BizCard - Setup Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo Step 2: Generating Prisma Client...
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

echo Step 3: Running database migrations...
echo NOTE: Make sure your database is running and .env is configured!
call npm run prisma:migrate
if %errorlevel% neq 0 (
    echo ERROR: Failed to run migrations
    echo.
    echo Please check:
    echo 1. Database is running (PostgreSQL or MySQL)
    echo 2. DATABASE_URL in .env is correct
    echo 3. Database exists
    pause
    exit /b 1
)
echo ✓ Migrations completed
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo The app will be available at:
echo   http://localhost:3000
echo.
pause
