@echo off
REM ============================================================================
REM PARICHAY.IO - Remove Unused MD Files
REM ============================================================================
REM This script removes all MD files from root that should be in docs/
REM ============================================================================

echo.
echo ============================================================================
echo PARICHAY.IO - Cleaning Up Unused MD Files
echo ============================================================================
echo.

echo This will remove all MD files from root except README.md
echo Files will be moved to docs/ structure or deleted if redundant
echo.
pause

REM Create docs structure if not exists
mkdir docs\installation 2>nul
mkdir docs\getting-started 2>nul
mkdir docs\agency 2>nul
mkdir docs\guides 2>nul
mkdir docs\features 2>nul
mkdir docs\testing 2>nul
mkdir docs\development 2>nul
mkdir docs\business 2>nul
mkdir docs\archive 2>nul

echo [1/4] Moving installation docs...
move /Y QUICK_INSTALL.md docs\installation\ 2>nul
move /Y INSTALL_README.md docs\installation\ 2>nul
move /Y INSTALLATION_GUIDE.md docs\installation\ 2>nul
move /Y INSTALLATION_COMPLETE.md docs\installation\ 2>nul
move /Y MERGED_INSTALLATION_SUMMARY.md docs\installation\ 2>nul
move /Y SETUP_DATABASE.md docs\installation\DATABASE_SETUP.md 2>nul
move /Y SETUP_POSTGRESQL.md docs\installation\ 2>nul
move /Y SETUP_WITH_MYSQL.md docs\installation\ 2>nul

echo [2/4] Moving agency docs...
move /Y AGENCY_PORTAL_COMPLETE.md docs\agency\ 2>nul
move /Y AGENCY_QUICK_REFERENCE.md docs\agency\ 2>nul
move /Y WHITE_LABEL_IMPLEMENTATION_SUMMARY.md docs\agency\WHITE_LABEL_IMPLEMENTATION.md 2>nul

echo [3/4] Moving user guides...
move /Y QUICK_START.md docs\getting-started\ 2>nul
move /Y QUICK_START_AUTH.md docs\getting-started\ 2>nul
move /Y QUICK_START_DASHBOARD.md docs\getting-started\ 2>nul
move /Y QUICK_START_NEW_FEATURES.md docs\getting-started\ 2>nul
move /Y SETUP_CHECKLIST.md docs\getting-started\ 2>nul
move /Y QUICK_ONBOARDING_GUIDE.md docs\getting-started\ 2>nul
move /Y QUICK_REBRANDING_SETUP.md docs\getting-started\ 2>nul

move /Y ADMIN_TOOLS_GUIDE.md docs\guides\ 2>nul
move /Y AUTH_GUIDE.md docs\guides\ 2>nul
move /Y LEAD_MANAGEMENT_GUIDE.md docs\guides\ 2>nul
move /Y LEAD_MANAGEMENT_CRM_IMPLEMENTATION.md docs\guides\ 2>nul
move /Y SYSTEM_SETTINGS_GUIDE.md docs\guides\ 2>nul
move /Y LOGIN_CREDENTIALS.md docs\guides\ 2>nul

move /Y BUILDER_QUICK_START.md docs\features\ 2>nul
move /Y THEME_CUSTOMIZER_GUIDE.md docs\features\ 2>nul
move /Y FESTIVAL_THEMING_GUIDE.md docs\features\ 2>nul
move /Y VERIFICATION_SYSTEM_GUIDE.md docs\features\ 2>nul
move /Y SMS_SETUP_GUIDE.md docs\features\ 2>nul
move /Y TOAST_USAGE_GUIDE.md docs\features\ 2>nul
move /Y NEW_SECTIONS_QUICK_REFERENCE.md docs\features\ 2>nul
move /Y PLACEHOLDER_QUICK_GUIDE.md docs\features\ 2>nul
move /Y PLACEHOLDER_VISUAL_GUIDE.md docs\features\ 2>nul
move /Y SAMPLE_MEDIA_GUIDE.md docs\features\ 2>nul

move /Y TESTING_GUIDE.md docs\testing\ 2>nul
move /Y QUICK_TEST_GUIDE.md docs\testing\ 2>nul
move /Y DEMO_SETUP.md docs\testing\ 2>nul
move /Y DEMO_GUIDE.md docs\testing\ 2>nul
move /Y DEMO_QUICK_START.md docs\testing\ 2>nul
move /Y DEMO_QUICK_REFERENCE.md docs\testing\ 2>nul
move /Y README_DEMO.md docs\testing\ 2>nul

move /Y FOLDER_STRUCTURE.md docs\development\ 2>nul
move /Y PERFORMANCE_OPTIMIZATION.md docs\development\ 2>nul
move /Y ACCESSIBILITY_QUICK_REFERENCE.md docs\development\ACCESSIBILITY_GUIDE.md 2>nul
move /Y COLOR_CONTRAST_COMPLIANCE.md docs\development\ 2>nul
move /Y DESIGN_2_QUICK_REFERENCE.md docs\development\ 2>nul

move /Y PRODUCT_OVERVIEW.md docs\business\ 2>nul
move /Y PRODUCT_DIAGRAMS.md docs\business\ 2>nul
move /Y COMPETITOR_ANALYSIS.md docs\business\ 2>nul
move /Y PARICHAY_ENTERPRISE_FEATURES_ROADMAP.md docs\business\ENTERPRISE_ROADMAP.md 2>nul
move /Y FEATURE_CHECKLIST.md docs\business\ 2>nul
move /Y ROADMAP_VISUAL.md docs\business\ 2>nul
move /Y NEXT_GEN_FEATURES_ANALYSIS.md docs\business\ 2>nul

echo [4/4] Archiving old files...
move /Y CLEANUP_COMPLETE.md docs\archive\ 2>nul
move /Y CLEANUP_SUMMARY.md docs\archive\ 2>nul
move /Y DOCUMENTATION_INDEX.md docs\archive\ 2>nul
move /Y START_HERE.md docs\archive\ 2>nul
move /Y ORGANIZATION_COMPLETE.md docs\archive\ 2>nul
move /Y ORGANIZE_NOW.md docs\archive\ 2>nul
move /Y PROJECT_README.md docs\archive\ 2>nul

echo.
echo ============================================================================
echo CLEANUP COMPLETE!
echo ============================================================================
echo.
echo Remaining MD files in root:
dir /B *.md 2>nul
echo.
echo All other MD files have been moved to docs/
echo.
echo Documentation structure:
echo   docs\installation\    - Installation guides
echo   docs\getting-started\ - Quick start guides
echo   docs\agency\         - Agency platform docs
echo   docs\guides\         - User guides
echo   docs\features\       - Feature documentation
echo   docs\testing\        - Testing and demo
echo   docs\development\    - Developer docs
echo   docs\business\       - Business docs
echo   docs\archive\        - Old files
echo.
echo Main documentation: docs\README.md
echo.
pause
