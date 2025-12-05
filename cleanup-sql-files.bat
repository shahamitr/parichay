@echo off
REM ============================================================================
REM PARICHAY.IO - SQL Files Cleanup
REM ============================================================================
REM This script organizes SQL files and removes redundant ones
REM ============================================================================

echo.
echo ============================================================================
echo PARICHAY.IO - SQL Files Cleanup
echo ============================================================================
echo.

REM Create setup/sql folder if not exists
mkdir setup\sql 2>nul
mkdir setup\sql\demo 2>nul
mkdir setup\sql\archive 2>nul

echo [1/4] Moving essential SQL files to setup/sql/...

REM Essential files - keep in setup/sql
move /Y create-database.sql setup\sql\ 2>nul
move /Y seed-subscription-plans.sql setup\sql\ 2>nul

echo [2/4] Moving demo data files to setup/sql/demo/...

REM Demo data files - move to demo folder
move /Y add-comprehensive-demo-data.sql setup\sql\demo\ 2>nul
move /Y add-more-demo.sql setup\sql\demo\ 2>nul
move /Y create-demo-branches.sql setup\sql\demo\ 2>nul
move /Y insert-demo-data.sql setup\sql\demo\ 2>nul
move /Y insert-social-demo-data.sql setup\sql\demo\ 2>nul
move /Y update-demo-with-all-sections.sql setup\sql\demo\ 2>nul
move /Y verify-demo-branches.sql setup\sql\demo\ 2>nul

echo [3/4] Archiving old/redundant SQL files...

REM Old update files - archive
move /Y fix-brand-logos.sql setup\sql\archive\ 2>nul
move /Y update-admin-password.sql setup\sql\archive\ 2>nul
move /Y update-brand-logos.sql setup\sql\archive\ 2>nul
move /Y update-microsite-with-media.sql setup\sql\archive\ 2>nul
move /Y update-subscription-plans-ai.sql setup\sql\archive\ 2>nul

echo [4/4] Removing empty/redundant files...

REM Remove empty install-complete.sql
del install-complete.sql 2>nul

echo.
echo ============================================================================
echo SQL CLEANUP COMPLETE!
echo ============================================================================
echo.
echo SQL files organized:
echo.
echo setup/sql/
echo   ├── create-database.sql           [Essential - Database creation]
echo   ├── seed-subscription-plans.sql   [Essential - Initial data]
echo   ├── demo/                          [Demo data files]
echo   │   ├── add-comprehensive-demo-data.sql
echo   │   ├── add-more-demo.sql
echo   │   ├── create-demo-branches.sql
echo   │   ├── insert-demo-data.sql
echo   │   ├── insert-social-demo-data.sql
echo   │   ├── update-demo-with-all-sections.sql
echo   │   └── verify-demo-branches.sql
echo   └── archive/                       [Old/redundant files]
echo       ├── fix-brand-logos.sql
echo       ├── update-admin-password.sql
echo       ├── update-brand-logos.sql
echo       ├── update-microsite-with-media.sql
echo       └── update-subscription-plans-ai.sql
echo.
echo Migrations remain in: prisma/migrations/
echo   ├── add_white_label_support.sql
echo   ├── add_mfa_fields.sql
echo   ├── add_performance_indexes.sql
echo   └── [other migration folders]
echo.
echo No SQL files in root directory!
echo.
pause
