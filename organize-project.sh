#!/bin/bash
# ============================================================================
# PARICHAY.IO - Project Organization Script
# ============================================================================
# This script organizes all documentation and removes redundant files
# ============================================================================

set -e

echo ""
echo "============================================================================"
echo "PARICHAY.IO - Project Organization"
echo "============================================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create docs folder structure
echo -e "${GREEN}[1/5] Creating documentation structure...${NC}"
mkdir -p docs/{installation,getting-started,agency,guides,features,testing,development,business,api,archive}

# Create setup folder
mkdir -p setup/{sql,scripts}

echo -e "${GREEN}[2/5] Moving installation documentation...${NC}"
mv -f QUICK_INSTALL.md docs/installation/ 2>/dev/null || true
mv -f INSTALL_README.md docs/installation/ 2>/dev/null || true
mv -f INSTALLATION_GUIDE.md docs/installation/ 2>/dev/null || true
mv -f INSTALLATION_COMPLETE.md docs/installation/ 2>/dev/null || true
mv -f MERGED_INSTALLATION_SUMMARY.md docs/installation/ 2>/dev/null || true
mv -f SETUP_DATABASE.md docs/installation/DATABASE_SETUP.md 2>/dev/null || true
mv -f SETUP_POSTGRESQL.md docs/installation/ 2>/dev/null || true
mv -f SETUP_WITH_MYSQL.md docs/installation/ 2>/dev/null || true

echo -e "${GREEN}[3/5] Moving agency documentation...${NC}"
mv -f AGENCY_PORTAL_COMPLETE.md docs/agency/ 2>/dev/null || true
mv -f AGENCY_QUICK_REFERENCE.md docs/agency/ 2>/dev/null || true
mv -f WHITE_LABEL_IMPLEMENTATION_SUMMARY.md docs/agency/WHITE_LABEL_IMPLEMENTATION.md 2>/dev/null || true

echo -e "${GREEN}[4/5] Moving user guides...${NC}"
# Getting Started
mv -f QUICK_START.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_START_AUTH.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_START_DASHBOARD.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_START_NEW_FEATURES.md docs/getting-started/ 2>/dev/null || true
mv -f SETUP_CHECKLIST.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_ONBOARDING_GUIDE.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_REBRANDING_SETUP.md docs/getting-started/ 2>/dev/null || true

# Guides
mv -f ADMIN_TOOLS_GUIDE.md docs/guides/ 2>/dev/null || true
mv -f AUTH_GUIDE.md docs/guides/ 2>/dev/null || true
mv -f LEAD_MANAGEMENT_GUIDE.md docs/guides/ 2>/dev/null || true
mv -f LEAD_MANAGEMENT_CRM_IMPLEMENTATION.md docs/guides/ 2>/dev/null || true
mv -f SYSTEM_SETTINGS_GUIDE.md docs/guides/ 2>/dev/null || true
mv -f LOGIN_CREDENTIALS.md docs/guides/ 2>/dev/null || true

# Features
mv -f BUILDER_QUICK_START.md docs/features/ 2>/dev/null || true
mv -f THEME_CUSTOMIZER_GUIDE.md docs/features/ 2>/dev/null || true
mv -f FESTIVAL_THEMING_GUIDE.md docs/features/ 2>/dev/null || true
mv -f VERIFICATION_SYSTEM_GUIDE.md docs/features/ 2>/dev/null || true
mv -f SMS_SETUP_GUIDE.md docs/features/ 2>/dev/null || true
mv -f TOAST_USAGE_GUIDE.md docs/features/ 2>/dev/null || true
mv -f NEW_SECTIONS_QUICK_REFERENCE.md docs/features/ 2>/dev/null || true
mv -f PLACEHOLDER_QUICK_GUIDE.md docs/features/ 2>/dev/null || true
mv -f PLACEHOLDER_VISUAL_GUIDE.md docs/features/ 2>/dev/null || true
mv -f SAMPLE_MEDIA_GUIDE.md docs/features/ 2>/dev/null || true

# Testing
mv -f TESTING_GUIDE.md docs/testing/ 2>/dev/null || true
mv -f QUICK_TEST_GUIDE.md docs/testing/ 2>/dev/null || true
mv -f DEMO_SETUP.md docs/testing/ 2>/dev/null || true
mv -f DEMO_GUIDE.md docs/testing/ 2>/dev/null || true
mv -f DEMO_QUICK_START.md docs/testing/ 2>/dev/null || true
mv -f DEMO_QUICK_REFERENCE.md docs/testing/ 2>/dev/null || true
mv -f README_DEMO.md docs/testing/ 2>/dev/null || true

# Development
mv -f FOLDER_STRUCTURE.md docs/development/ 2>/dev/null || true
mv -f PERFORMANCE_OPTIMIZATION.md docs/development/ 2>/dev/null || true
mv -f ACCESSIBILITY_QUICK_REFERENCE.md docs/development/ACCESSIBILITY_GUIDE.md 2>/dev/null || true
mv -f COLOR_CONTRAST_COMPLIANCE.md docs/development/ 2>/dev/null || true
mv -f DESIGN_2_QUICK_REFERENCE.md docs/development/ 2>/dev/null || true

# Business
mv -f PRODUCT_OVERVIEW.md docs/business/ 2>/dev/null || true
mv -f PRODUCT_DIAGRAMS.md docs/business/ 2>/dev/null || true
mv -f COMPETITOR_ANALYSIS.md docs/business/ 2>/dev/null || true
mv -f PARICHAY_ENTERPRISE_FEATURES_ROADMAP.md docs/business/ENTERPRISE_ROADMAP.md 2>/dev/null || true
mv -f FEATURE_CHECKLIST.md docs/business/ 2>/dev/null || true
mv -f ROADMAP_VISUAL.md docs/business/ 2>/dev/null || true
mv -f NEXT_GEN_FEATURES_ANALYSIS.md docs/business/ 2>/dev/null || true

echo -e "${GREEN}[5/5] Organizing setup files...${NC}"
# Move installation scripts to setup
mv -f install.bat setup/ 2>/dev/null || true
mv -f install.sh setup/ 2>/dev/null || true
mv -f setup.bat setup/ 2>/dev/null || true

# Move SQL files to setup/sql
mv -f create-database.sql setup/sql/ 2>/dev/null || true
mv -f seed-subscription-plans.sql setup/sql/ 2>/dev/null || true

# Archive redundant SQL files
mv -f add-comprehensive-demo-data.sql docs/archive/ 2>/dev/null || true
mv -f add-more-demo.sql docs/archive/ 2>/dev/null || true
mv -f create-demo-branches.sql docs/archive/ 2>/dev/null || true
mv -f fix-brand-logos.sql docs/archive/ 2>/dev/null || true
mv -f insert-demo-data.sql docs/archive/ 2>/dev/null || true
mv -f insert-social-demo-data.sql docs/archive/ 2>/dev/null || true
mv -f update-admin-password.sql docs/archive/ 2>/dev/null || true
mv -f update-brand-logos.sql docs/archive/ 2>/dev/null || true
mv -f update-demo-with-all-sections.sql docs/archive/ 2>/dev/null || true
mv -f update-microsite-with-media.sql docs/archive/ 2>/dev/null || true
mv -f update-subscription-plans-ai.sql docs/archive/ 2>/dev/null || true
mv -f verify-demo-branches.sql docs/archive/ 2>/dev/null || true

# Archive old documentation
mv -f CLEANUP_COMPLETE.md docs/archive/ 2>/dev/null || true
mv -f CLEANUP_SUMMARY.md docs/archive/ 2>/dev/null || true
mv -f DOCUMENTATION_INDEX.md docs/archive/ 2>/dev/null || true
mv -f START_HERE.md docs/archive/ 2>/dev/null || true

# Remove old organization scripts
rm -f cleanup-files.bat 2>/dev/null || true
rm -f organize-docs.bat 2>/dev/null || true

echo ""
echo "============================================================================"
echo -e "${GREEN}ORGANIZATION COMPLETE!${NC}"
echo "============================================================================"
echo ""
echo "Documentation structure:"
echo "  docs/"
echo "  ├── installation/     - Installation guides"
echo "  ├── getting-started/  - Quick start guides"
echo "  ├── agency/          - Agency platform docs"
echo "  ├── guides/          - User guides"
echo "  ├── features/        - Feature documentation"
echo "  ├── testing/         - Testing and demo"
echo "  ├── development/     - Developer docs"
echo "  ├── business/        - Business docs"
echo "  ├── api/             - API reference"
echo "  └── archive/         - Old files"
echo ""
echo "Setup structure:"
echo "  setup/"
echo "  ├── install.bat      - Windows installer"
echo "  ├── install.sh       - Linux/Mac installer"
echo "  ├── setup.bat        - Setup script"
echo "  └── sql/             - SQL files"
echo ""
echo "Main documentation: docs/README.md"
echo "Quick install: setup/install.bat or setup/install.sh"
echo ""
echo "============================================================================"
echo ""
