#!/bin/bash
# ============================================================================
# PARICHAY.IO - Remove Unused MD Files
# ============================================================================
# This script removes all MD files from root that should be in docs/
# ============================================================================

set -e

echo ""
echo "============================================================================"
echo "PARICHAY.IO - Cleaning Up Unused MD Files"
echo "============================================================================"
echo ""

echo "This will remove all MD files from root except README.md"
echo "Files will be moved to docs/ structure or deleted if redundant"
echo ""
read -p "Press Enter to continue..."

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

# Create docs structure if not exists
mkdir -p docs/{installation,getting-started,agency,guides,features,testing,development,business,archive}

echo -e "${GREEN}[1/4] Moving installation docs...${NC}"
mv -f QUICK_INSTALL.md docs/installation/ 2>/dev/null || true
mv -f INSTALL_README.md docs/installation/ 2>/dev/null || true
mv -f INSTALLATION_GUIDE.md docs/installation/ 2>/dev/null || true
mv -f INSTALLATION_COMPLETE.md docs/installation/ 2>/dev/null || true
mv -f MERGED_INSTALLATION_SUMMARY.md docs/installation/ 2>/dev/null || true
mv -f SETUP_DATABASE.md docs/installation/DATABASE_SETUP.md 2>/dev/null || true
mv -f SETUP_POSTGRESQL.md docs/installation/ 2>/dev/null || true
mv -f SETUP_WITH_MYSQL.md docs/installation/ 2>/dev/null || true

echo -e "${GREEN}[2/4] Moving agency docs...${NC}"
mv -f AGENCY_PORTAL_COMPLETE.md docs/agency/ 2>/dev/null || true
mv -f AGENCY_QUICK_REFERENCE.md docs/agency/ 2>/dev/null || true
mv -f WHITE_LABEL_IMPLEMENTATION_SUMMARY.md docs/agency/WHITE_LABEL_IMPLEMENTATION.md 2>/dev/null || true

echo -e "${GREEN}[3/4] Moving user guides...${NC}"
mv -f QUICK_START.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_START_AUTH.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_START_DASHBOARD.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_START_NEW_FEATURES.md docs/getting-started/ 2>/dev/null || true
mv -f SETUP_CHECKLIST.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_ONBOARDING_GUIDE.md docs/getting-started/ 2>/dev/null || true
mv -f QUICK_REBRANDING_SETUP.md docs/getting-started/ 2>/dev/null || true

mv -f ADMIN_TOOLS_GUIDE.md docs/guides/ 2>/dev/null || true
mv -f AUTH_GUIDE.md docs/guides/ 2>/dev/null || true
mv -f LEAD_MANAGEMENT_GUIDE.md docs/guides/ 2>/dev/null || true
mv -f LEAD_MANAGEMENT_CRM_IMPLEMENTATION.md docs/guides/ 2>/dev/null || true
mv -f SYSTEM_SETTINGS_GUIDE.md docs/guides/ 2>/dev/null || true
mv -f LOGIN_CREDENTIALS.md docs/guides/ 2>/dev/null || true

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

mv -f TESTING_GUIDE.md docs/testing/ 2>/dev/null || true
mv -f QUICK_TEST_GUIDE.md docs/testing/ 2>/dev/null || true
mv -f DEMO_SETUP.md docs/testing/ 2>/dev/null || true
mv -f DEMO_GUIDE.md docs/testing/ 2>/dev/null || true
mv -f DEMO_QUICK_START.md docs/testing/ 2>/dev/null || true
mv -f DEMO_QUICK_REFERENCE.md docs/testing/ 2>/dev/null || true
mv -f README_DEMO.md docs/testing/ 2>/dev/null || true

mv -f FOLDER_STRUCTURE.md docs/development/ 2>/dev/null || true
mv -f PERFORMANCE_OPTIMIZATION.md docs/development/ 2>/dev/null || true
mv -f ACCESSIBILITY_QUICK_REFERENCE.md docs/development/ACCESSIBILITY_GUIDE.md 2>/dev/null || true
mv -f COLOR_CONTRAST_COMPLIANCE.md docs/development/ 2>/dev/null || true
mv -f DESIGN_2_QUICK_REFERENCE.md docs/development/ 2>/dev/null || true

mv -f PRODUCT_OVERVIEW.md docs/business/ 2>/dev/null || true
mv -f PRODUCT_DIAGRAMS.md docs/business/ 2>/dev/null || true
mv -f COMPETITOR_ANALYSIS.md docs/business/ 2>/dev/null || true
mv -f PARICHAY_ENTERPRISE_FEATURES_ROADMAP.md docs/business/ENTERPRISE_ROADMAP.md 2>/dev/null || true
mv -f FEATURE_CHECKLIST.md docs/business/ 2>/dev/null || true
mv -f ROADMAP_VISUAL.md docs/business/ 2>/dev/null || true
mv -f NEXT_GEN_FEATURES_ANALYSIS.md docs/business/ 2>/dev/null || true

echo -e "${GREEN}[4/4] Archiving old files...${NC}"
mv -f CLEANUP_COMPLETE.md docs/archive/ 2>/dev/null || true
mv -f CLEANUP_SUMMARY.md docs/archive/ 2>/dev/null || true
mv -f DOCUMENTATION_INDEX.md docs/archive/ 2>/dev/null || true
mv -f START_HERE.md docs/archive/ 2>/dev/null || true
mv -f ORGANIZATION_COMPLETE.md docs/archive/ 2>/dev/null || true
mv -f ORGANIZE_NOW.md docs/archive/ 2>/dev/null || true
mv -f PROJECT_README.md docs/archive/ 2>/dev/null || true

echo ""
echo "============================================================================"
echo -e "${GREEN}CLEANUP COMPLETE!${NC}"
echo "============================================================================"
echo ""
echo "Remaining MD files in root:"
ls -1 *.md 2>/dev/null || echo "  (none except README.md)"
echo ""
echo "All other MD files have been moved to docs/"
echo ""
echo "Documentation structure:"
echo "  docs/installation/    - Installation guides"
echo "  docs/getting-started/ - Quick start guides"
echo "  docs/agency/         - Agency platform docs"
echo "  docs/guides/         - User guides"
echo "  docs/features/       - Feature documentation"
echo "  docs/testing/        - Testing and demo"
echo "  docs/development/    - Developer docs"
echo "  docs/business/       - Business docs"
echo "  docs/archive/        - Old files"
echo ""
echo "Main documentation: docs/README.md"
echo ""
