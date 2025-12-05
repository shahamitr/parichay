@echo off
echo Cleaning up redundant documentation and test files...
echo.

REM Remove old test files
del /Q test-auth-flow.js 2>nul
del /Q test-complete-flow.js 2>nul
del /Q test-cookies.html 2>nul
del /Q test-public-qr.html 2>nul
del /Q test-qr-simple.bat 2>nul
del /Q test-qrcode-api.js 2>nul
del /Q test-qrcode.html 2>nul
del /Q test-vcard.js 2>nul
del /Q test_output.txt 2>nul
del /Q check-admin.js 2>nul
del /Q check-env-vars.js 2>nul
del /Q check-env.js 2>nul
del /Q create-admin.js 2>nul
del /Q seed-admin.js 2>nul

REM Remove old test result files
del /Q brand_test_fail.txt 2>nul
del /Q brand_test_fail_2.txt 2>nul
del /Q brand_test_fail_cmd.txt 2>nul
del /Q compilation-check.txt 2>nul
del /Q compilation-errors.txt 2>nul
del /Q ADMIN_REDESIGN_STATUS.txt 2>nul

REM Remove redundant implementation summaries
del /Q ACCESSIBILITY_IMPLEMENTATION.md 2>nul
del /Q ADDITIONAL_FEATURES_COMPLETE.md 2>nul
del /Q ADMIN_DASHBOARD_INTEGRATION.md 2>nul
del /Q ADMIN_REDESIGN_PROGRESS.md 2>nul
del /Q ADVANCED_ANALYTICS_IMPLEMENTATION.md 2>nul
del /Q ADVANCED_FEATURES_SUMMARY.md 2>nul
del /Q ADVANCED_MICROSITE_FEATURES.md 2>nul
del /Q AI_CONTENT_GENERATION_PLAN.md 2>nul
del /Q AI_CONTENT_GENERATOR.md 2>nul
del /Q AI_CONTENT_GENERATOR_IMPLEMENTATION.md 2>nul
del /Q AI_FEATURES_ANALYSIS.md 2>nul
del /Q AI_IMPLEMENTATION_PHASE1_COMPLETE.md 2>nul
del /Q ALL_ISSUES_FIXED.md 2>nul
del /Q ALL_PAGES_COMPLETE.md 2>nul
del /Q ALL_PAGES_SUMMARY.md 2>nul
del /Q ALL_PHASES_COMPLETE.md 2>nul
del /Q ALL_PHASES_COMPLETE_FINAL.md 2>nul
del /Q ANIMATION_SYSTEM_IMPLEMENTATION.md 2>nul
del /Q ARC_COMPONENT_IMPLEMENTATION.md 2>nul
del /Q ARC_MOBILE_OPTIMIZATION.md 2>nul
del /Q ASYMMETRIC_LAYOUT_IMPLEMENTATION.md 2>nul
del /Q AUTHENTICATION_COMPLETE.md 2>nul
del /Q AUTHENTICATION_FIXED.md 2>nul
del /Q AUTHENTICATION_REVAMP_SUMMARY.md 2>nul
del /Q BRAND_CUSTOMIZATION_IMPLEMENTATION.md 2>nul
del /Q BRAND_PREVIEW_COPY_LINK.md 2>nul
del /Q BRAND_URL_FIX.md 2>nul
del /Q BUGFIXES_SUMMARY.md 2>nul
del /Q compilation-error-analysis.md 2>nul
del /Q COMPILATION_FIXES_COMPLETE.md 2>nul
del /Q COMPILATION_VERIFICATION_FINAL_REPORT.md 2>nul
del /Q COMPILATION_VERIFICATION_REPORT.md 2>nul
del /Q COMPLETE_IMPLEMENTATION_SUMMARY.md 2>nul
del /Q COMPLETION_SUMMARY.md 2>nul
del /Q DASHBOARD_ARCHITECTURE.md 2>nul
del /Q DASHBOARD_DELIVERY_SUMMARY.md 2>nul
del /Q DASHBOARD_FIXED.md 2>nul
del /Q DASHBOARD_IMPLEMENTATION_GUIDE.md 2>nul
del /Q DEMO_DATA_COMPLETE.md 2>nul
del /Q DEMO_DATA_SUMMARY.md 2>nul
del /Q DEMO_SITES_READY.md 2>nul
del /Q DEMO_URLS.md 2>nul
del /Q DESIGN_2_COMPLETE_SUMMARY.md 2>nul
del /Q DESIGN_2_FINAL_SUMMARY.md 2>nul
del /Q DESIGN_2_IMPLEMENTATION.md 2>nul
del /Q DRAWER_IMPLEMENTATION.md 2>nul
del /Q EXECUTIVE_PORTAL_IMPLEMENTATION.md 2>nul
del /Q EXECUTIVE_ROLE_IMPLEMENTATION.md 2>nul
del /Q FEATURES_IMPLEMENTATION_STATUS.md 2>nul
del /Q FEATURES_IMPLEMENTATION_SUMMARY.md 2>nul
del /Q FEATURES_IMPLEMENTED.md 2>nul
del /Q FEATURES_INTEGRATED.md 2>nul
del /Q FINAL_COMPLETION_REPORT.md 2>nul
del /Q FINAL_IMPLEMENTATION_COMPLETE.md 2>nul
del /Q FINAL_LOGIN_SOLUTION.md 2>nul
del /Q FINAL_SUMMARY.md 2>nul
del /Q FIXES_APPLIED.md 2>nul
del /Q FULL_PREVIEW_IMPLEMENTATION.md 2>nul
del /Q IMMEDIATE_FIXES_GUIDE.md 2>nul
del /Q IMPLEMENTATION_SUMMARY.md 2>nul
del /Q INDUSTRY_CATEGORIES_COMPLETE.md 2>nul
del /Q INDUSTRY_CATEGORIES_IMPLEMENTATION.md 2>nul
del /Q INTEGRATION_GUIDE.md 2>nul
del /Q LOGIN_FIX_INSTRUCTIONS.md 2>nul
del /Q LOGIN_FIX_SUMMARY.md 2>nul
del /Q MFA_COMPLETION_SUMMARY.md 2>nul
del /Q MFA_IMPLEMENTATION.md 2>nul
del /Q MICROSITE_BUILDER_ENHANCEMENTS.md 2>nul
del /Q MICROSITE_BUILDER_IMPLEMENTATION.md 2>nul
del /Q MICROSITE_DATA_MAPPING.md 2>nul
del /Q MICROSITE_PREVIEW_IMPLEMENTATION.md 2>nul
del /Q MICROSITE_SECTIONS_SUMMARY.md 2>nul
del /Q MIGRATION_INSTRUCTIONS.md 2>nul
del /Q NAVIGATION_SYSTEM_IMPLEMENTATION.md 2>nul
del /Q PAGES_CREATED.md 2>nul
del /Q PAYMENT_SYSTEM_COMPLETE.md 2>nul
del /Q PENDING_TASKS_ANALYSIS.md 2>nul
del /Q PERFORMANCE_OPTIMIZATION_SUMMARY.md 2>nul
del /Q PHASE1_COMPLETE_MODERN_DESIGN.md 2>nul
del /Q PHASE_2_IMPLEMENTATION_COMPLETE.md 2>nul
del /Q PHASE_3_IMPLEMENTATION_COMPLETE.md 2>nul
del /Q PLACEHOLDER_CHANGES_SUMMARY.md 2>nul
del /Q PLACEHOLDER_IMAGES_IMPLEMENTATION.md 2>nul
del /Q prioritized-fix-list.md 2>nul
del /Q PRODUCTION_READINESS_GAP_ANALYSIS.md 2>nul
del /Q PRODUCTION_READINESS_SUMMARY.md 2>nul
del /Q PRODUCTION_READY.md 2>nul
del /Q PROJECT_COMPLETE.md 2>nul
del /Q READY_TO_USE.md 2>nul
del /Q REBRANDING_COMPLETE.md 2>nul
del /Q REBRANDING_TO_PARICHAY.md 2>nul
del /Q RUNNING.md 2>nul
del /Q SEPARATOR_AND_MEDIA_SUMMARY.md 2>nul
del /Q SMS_IMPLEMENTATION_SUMMARY.md 2>nul
del /Q SUBSCRIPTION_SYSTEM_COMPLETE.md 2>nul
del /Q TASK_11_RESPONSIVE_OPTIMIZATION_COMPLETE.md 2>nul
del /Q TASK_12_ACCESSIBILITY_SUMMARY.md 2>nul
del /Q TASK_13_PERFORMANCE_OPTIMIZATION_COMPLETE.md 2>nul
del /Q TASK_18_COMPLETION.md 2>nul
del /Q TASK_4_IMPLEMENTATION_SUMMARY.md 2>nul
del /Q TASK_9_IMPLEMENTATION_SUMMARY.md 2>nul
del /Q TEST_LOGIN.md 2>nul
del /Q TEST_LOGIN_NOW.md 2>nul
del /Q USERS_AND_BRANDS_UPDATES.md 2>nul
del /Q VCARD_TEST_RESULTS.md 2>nul
del /Q VERIFICATION_TESTS_COMPLETE.md 2>nul

echo.
echo Cleanup complete!
echo.
echo Kept essential files:
echo - README.md (Main documentation)
echo - WHITE_LABEL_PLATFORM_IMPLEMENTATION.md (White-label guide)
echo - docs/CONSOLIDATED_DOCUMENTATION.md (Complete documentation)
echo - QUICK_START.md (Quick start guide)
echo - AUTH_GUIDE.md (Authentication guide)
echo - ADMIN_TOOLS_GUIDE.md (Admin tools)
echo - LEAD_MANAGEMENT_GUIDE.md (CRM guide)
echo - TESTING_GUIDE.md (Testing guide)
echo - SETUP_DATABASE.md (Database setup)
echo - All SQL files (Database scripts)
echo.
pause
