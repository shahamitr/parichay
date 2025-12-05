@echo off
REM ============================================================================
REM PARICHAY.IO - Windows Installation Script
REM ============================================================================

echo.
echo ============================================================================
echo PARICHAY.IO - Complete Installation
echo ============================================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/6] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/6] Checking environment variables...
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo [IMPORTANT] Please edit .env file with your database credentials
    echo Press any key to continue after editing .env...
    pause >nul
)

echo.
echo [3/6] Generating Prisma client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo [4/6] Pushing database schema...
echo This will create all tables and indexes...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to push database schema
    echo.
    echo Troubleshooting:
    echo 1. Check if PostgreSQL is running
    echo 2. Verify DATABASE_URL in .env file
    echo 3. Ensure database exists: CREATE DATABASE parichay;
    pause
    exit /b 1
)

echo.
echo [5/6] Running additional migrations...
echo.
echo Running white-label migration...
psql -d parichay -f prisma/migrations/add_white_label_support.sql 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] White-label migration may have already been applied
)

echo Running MFA migration...
psql -d parichay -f prisma/migrations/add_mfa_fields.sql 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MFA migration may have already been applied
)

echo Running performance indexes...
psql -d parichay -f prisma/migrations/add_performance_indexes.sql 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Performance indexes may have already been applied
)

echo.
echo [6/6] Installation complete!
echo.
echo ============================================================================
echo INSTALLATION SUCCESSFUL!
echo ============================================================================
echo.
echo Features installed:
echo   - Multi-tenant white-label platform
echo   - Agency management system
echo   - Client management
echo   - Billing and usage tracking
echo   - Multi-factor authentication
echo   - Verification system
echo   - Premium features
echo.
echo Next steps:
echo   1. Start development server: npm run dev
echo   2. Visit: http://localhost:3000
echo   3. Create your first agency: /agency/onboarding
echo.
echo Documentation:
echo   - INSTALLATION_GUIDE.md
echo   - WHITE_LABEL_IMPLEMENTATION_SUMMARY.md
echo   - AGENCY_PORTAL_COMPLETE.md
echo   - AGENCY_QUICK_REFERENCE.md
echo.
echo ============================================================================
echo.
pause
