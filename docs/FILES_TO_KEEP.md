# Essential Files - Keep These

## Core Documentation (Keep)
- ✅ **README.md** - Main project documentation
- ✅ **docs/CONSOLIDATED_DOCUMENTATION.md** - Complete comprehensive guide
- ✅ **WHITE_LABEL_PLATFORM_IMPLEMENTATION.md** - White-label/agency platform guide
- ✅ **QUICK_START.md** - Quick start guide
- ✅ **SETUP_DATABASE.md** -e setup instructions

## Feature Guides (Keep)
- ✅ **AUTH_GUIDE.md** - Authentication and security
- ✅ **ADMIN_TOOLS_GUIDE.md** - Admin dashboard features
- ✅ **LEAD_MANAGEMENT_GUIDE.md** - CRM and lead management
- ✅ **TESTING_GUIDE.md** - Testing procedures
- ✅ **THEME_CUSTOMIZER_GUIDE.md** - Theme customization
- ✅ **BUILDER_QUICK_START.md** - Microsite builder guide
- ✅ **DEMO_GUIDE.md** - Demo setup guide
- ✅ **SMS_SETUP_GUIDE.md** - SMS configuration
- ✅ **SYSTEM_SETTINGS_GUIDE.md** - System settings
- ✅ **VERIFICATION_SYSTEM_GUIDE.md** - Verification features
- ✅ **ACCESSIBILITY_QUICK_REFERENCE.md** - Accessibility guidelines
- ✅ **DESIGN_2_QUICK_REFERENCE.md** - Design system reference
- ✅ **NEW_SECTIONS_QUICK_REFERENCE.md** - Microsite sections
- ✅ **PLACEHOLDER_QUICK_GUIDE.md** - Placeholder images
- ✅ **DEMO_QUICK_REFERENCE.md** - Demo quick reference
- ✅ **QUICK_START_AUTH.md** - Auth quick start
- ✅ **QUICK_START_DASHBOARD.md** - Dashboard quick start
- ✅ **QUICK_START_NEW_FEATURES.md** - New features guide
- ✅ **QUICK_TEST_GUIDE.md** - Quick testing guide
- ✅ **QUICK_ONBOARDING_GUIDE.md** - User onboarding
- ✅ **QUICK_REBRANDING_SETUP.md** - Rebranding guide

## Reference Documents (Keep)
- ✅ **COMPETITOR_ANALYSIS.md** - Market analysis
- ✅ **FEATURE_CHECKLIST.md** - Feature tracking
- ✅ **FOLDER_STRUCTURE.md** - Project structure
- ✅ **PARICHAY_ENTERPRISE_FEATURES_ROADMAP.md** - Product roadmap
- ✅ **PERFORMANCE_OPTIMIZATION.md** - Performance guide
- ✅ **PRODUCT_OVERVIEW.md** - Product overview
- ✅ **PRODUCT_DIAGRAMS.md** - Architecture diagrams
- ✅ **ROADMAP_VISUAL.md** - Visual roadmap
- ✅ **FESTIVAL_THEMING_GUIDE.md** - Festival themes
- ✅ **SAMPLE_MEDIA_GUIDE.md** - Media guidelines
- ✅ **PLACEHOLDER_VISUAL_GUIDE.md** - Visual guide
- ✅ **TOAST_USAGE_GUIDE.md** - Toast notifications
- ✅ **COLOR_CONTRAST_COMPLIANCE.md** - Accessibility compliance
- ✅ **NEXT_GEN_FEATURES_ANALYSIS.md** - Future features

## Database Files (Keep)
- ✅ **create-database.sql** - Database creation
- ✅ **add-comprehensive-demo-data.sql** - Demo data
- ✅ **add-more-demo.sql** - Additional demo data
- ✅ **create-demo-branches.sql** - Demo branches
- ✅ **insert-demo-data.sql** - Insert demo data
- ✅ **insert-social-demo-data.sql** - Social demo data
- ✅ **seed-subscription-plans.sql** - Subscription plans
- ✅ **update-admin-password.sql** - Admin password update
- ✅ **update-brand-logos.sql** - Brand logos update
- ✅ **update-demo-with-all-sections.sql** - Demo sections
- ✅ **update-microsite-with-media.sql** - Media updates
- ✅ **update-subscription-plans-ai.sql** - AI plan updates
- ✅ **verify-demo-branches.sql** - Verify demo data
- ✅ **fix-brand-logos.sql** - Fix brand logos

## Configuration Files (Keep)
- ✅ **.env.example** - Environment template
- ✅ **.env.production.example** - Production env template
- ✅ **.env.staging.example** - Staging env template
- ✅ **docker-compose.yml** - Docker configuration
- ✅ **Dockerfile** - Docker image
- ✅ **vercel.json** - Vercel deployment
- ✅ **next.config.js** - Next.js config
- ✅ **tailwind.config.ts** - Tailwind config
- ✅ **tsconfig.json** - TypeScript config
- ✅ **jest.config.js** - Jest config
- ✅ **jest.setup.js** - Jest setup
- ✅ **postcss.config.mjs** - PostCSS config
- ✅ **.eslintrc.json** - ESLint config
- ✅ **.prettierrc** - Prettier config
- ✅ **package.json** - Dependencies
- ✅ **setup.bat** - Setup script
- ✅ **start.bat** - Start script

## Credentials (Keep)
- ✅ **LOGIN_CREDENTIALS.md** - Login information
- ✅ **SETUP_CHECKLIST.md** - Setup checklist
- ✅ **SETUP_POSTGRESQL.md** - PostgreSQL setup
- ✅ **SETUP_WITH_MYSQL.md** - MySQL setup

---

## Files to Delete (Run cleanup-files.bat)

### Old Test Files
- ❌ test-auth-flow.js
- ❌ test-complete-flow.js
- ❌ test-cookies.html
- ❌ test-public-qr.html
- ❌ test-qr-simple.bat
- ❌ test-qrcode-api.js
- ❌ test-qrcode.html
- ❌ test-vcard.js
- ❌ test_output.txt
- ❌ check-admin.js
- ❌ check-env-vars.js
- ❌ check-env.js
- ❌ create-admin.js
- ❌ seed-admin.js

### Old Test Results
- ❌ brand_test_fail.txt
- ❌ brand_test_fail_2.txt
- ❌ brand_test_fail_cmd.txt
- ❌ compilation-check.txt
- ❌ compilation-errors.txt
- ❌ ADMIN_REDESIGN_STATUS.txt

### Redundant Implementation Summaries (100+ files)
All files with patterns:
- ❌ *_COMPLETE.md
- ❌ *_SUMMARY.md
- ❌ *_IMPLEMENTATION.md
- ❌ *_FIXED.md
- ❌ PHASE_*.md
- ❌ TASK_*.md
- ❌ ALL_*.md
- ❌ FINAL_*.md

These are consolidated into `docs/CONSOLIDATED_DOCUMENTATION.md`

---

## How to Clean Up

### Option 1: Run Cleanup Script (Recommended)
```bash
cleanup-files.bat
```

### Option 2: Manual Cleanup
Review each file and delete if it matches the "Files to Delete" patterns above.

---

## After Cleanup

Your documentation structure will be:
```
onetouch-bizcard/
├── README.md (main entry point)
├── docs/
│   ├── CONSOLIDATED_DOCUMENTATION.md (complete guide)
│   └── FILES_TO_KEEP.md (this file)
├── WHITE_LABEL_PLATFORM_IMPLEMENTATION.md
├── QUICK_START.md
├── AUTH_GUIDE.md
├── ADMIN_TOOLS_GUIDE.md
├── LEAD_MANAGEMENT_GUIDE.md
├── TESTING_GUIDE.md
├── THEME_CUSTOMIZER_GUIDE.md
├── SETUP_DATABASE.md
└── [other essential guides...]
```

**Result:** Clean, organized documentation with no redundancy!
