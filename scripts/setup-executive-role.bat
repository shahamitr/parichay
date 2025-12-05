@echo off
REM Setup Executive Role and Onboarding Tracking
REM This script helps set up the executive role feature

echo.
echo 🚀 Setting up Executive Role and Onboarding Tracking...
echo.

REM Step 1: Run database migration
echo 📊 Step 1: Running database migration...
call npx prisma migrate deploy

if %errorlevel% neq 0 (
    echo ❌ Migration failed. Please check your database connection.
    exit /b 1
)

echo ✅ Migration completed successfully
echo.

REM Step 2: Generate Prisma client
echo 🔧 Step 2: Generating Prisma client...
call npx prisma generate

if %errorlevel% neq 0 (
    echo ❌ Prisma client generation failed.
    exit /b 1
)

echo ✅ Prisma client generated successfully
echo.

REM Step 3: Verify schema
echo 🔍 Step 3: Verifying schema...
call npx prisma validate

if %errorlevel% neq 0 (
    echo ⚠️  Schema validation warnings detected
) else (
    echo ✅ Schema validated successfully
)

echo.
echo ✨ Setup completed successfully!
echo.
echo 📝 Next steps:
echo 1. Create executive users via admin panel or API
echo 2. Assign executives to branches
echo 3. View executive stats in the dashboard
echo.
echo 📖 For more information, see:
echo    - docs/EXECUTIVE_ROLE_GUIDE.md
echo    - EXECUTIVE_ROLE_IMPLEMENTATION.md
echo.

pause
