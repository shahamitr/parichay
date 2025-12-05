#!/bin/bash
# ============================================================================
# PARICHAY.IO - SQL Files Cleanup
# ============================================================================
# This script organizes SQL files and removes redundant ones
# ============================================================================

set -e

echo ""
echo "============================================================================"
echo "PARICHAY.IO - SQL Files Cleanup"
echo "============================================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create setup/sql folder if not exists
mkdir -p setup/sql/{demo,archive}

echo -e "${GREEN}[1/4] Moving essential SQL files to setup/sql/...${NC}"

# Essential files - keep in setup/sql
mv -f create-database.sql setup/sql/ 2>/dev/null || true
mv -f seed-subscription-plans.sql setup/sql/ 2>/dev/null || true

echo -e "${GREEN}[2/4] Moving demo data files to setup/sql/demo/...${NC}"

# Demo data files - move to demo folder
mv -f add-comprehensive-demo-data.sql setup/sql/demo/ 2>/dev/null || true
mv -f add-more-demo.sql setup/sql/demo/ 2>/dev/null || true
mv -f create-demo-branches.sql setup/sql/demo/ 2>/dev/null || true
mv -f insert-demo-data.sql setup/sql/demo/ 2>/dev/null || true
mv -f insert-social-demo-data.sql setup/sql/demo/ 2>/dev/null || true
mv -f update-demo-with-all-sections.sql setup/sql/demo/ 2>/dev/null || true
mv -f verify-demo-branches.sql setup/sql/demo/ 2>/dev/null || true

echo -e "${GREEN}[3/4] Archiving old/redundant SQL files...${NC}"

# Old update files - archive
mv -f fix-brand-logos.sql setup/sql/archive/ 2>/dev/null || true
mv -f update-admin-password.sql setup/sql/archive/ 2>/dev/null || true
mv -f update-brand-logos.sql setup/sql/archive/ 2>/dev/null || true
mv -f update-microsite-with-media.sql setup/sql/archive/ 2>/dev/null || true
mv -f update-subscription-plans-ai.sql setup/sql/archive/ 2>/dev/null || true

echo -e "${GREEN}[4/4] Removing empty/redundant files...${NC}"

# Remove empty install-complete.sql
rm -f install-complete.sql 2>/dev/null || true

echo ""
echo "============================================================================"
echo -e "${GREEN}SQL CLEANUP COMPLETE!${NC}"
echo "============================================================================"
echo ""
echo "SQL files organized:"
echo ""
echo "setup/sql/"
echo "  ├── create-database.sql           [Essential - Database creation]"
echo "  ├── seed-subscription-plans.sql   [Essential - Initial data]"
echo "  ├── demo/                          [Demo data files]"
echo "  │   ├── add-comprehensive-demo-data.sql"
echo "  │   ├── add-more-demo.sql"
echo "  │   ├── create-demo-branches.sql"
echo "  │   ├── insert-demo-data.sql"
echo "  │   ├── insert-social-demo-data.sql"
echo "  │   ├── update-demo-with-all-sections.sql"
echo "  │   └── verify-demo-branches.sql"
echo "  └── archive/                       [Old/redundant files]"
echo "      ├── fix-brand-logos.sql"
echo "      ├── update-admin-password.sql"
echo "      ├── update-brand-logos.sql"
echo "      ├── update-microsite-with-media.sql"
echo "      └── update-subscription-plans-ai.sql"
echo ""
echo "Migrations remain in: prisma/migrations/"
echo "  ├── add_white_label_support.sql"
echo "  ├── add_mfa_fields.sql"
echo "  ├── add_performance_indexes.sql"
echo "  └── [other migration folders]"
echo ""
echo "No SQL files in root directory!"
echo ""
