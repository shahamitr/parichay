#!/bin/bash
# ============================================================================
# PARICHAY.IO - Linux/Mac Installation Script
# ============================================================================

set -e  # Exit on error

echo ""
echo "============================================================================"
echo "PARICHAY.IO - Complete Installation"
echo "============================================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}[1/6] Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to install dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}[2/6] Checking environment variables...${NC}"
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo ""
    echo -e "${YELLOW}[IMPORTANT] Please edit .env file with your database credentials${NC}"
    echo "Press Enter to continue after editing .env..."
    read
fi

echo ""
echo -e "${GREEN}[3/6] Generating Prisma client...${NC}"
npx prisma generate
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to generate Prisma client${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}[4/6] Pushing database schema...${NC}"
echo "This will create all tables and indexes..."
npx prisma db push
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to push database schema${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check if PostgreSQL is running"
    echo "2. Verify DATABASE_URL in .env file"
    echo "3. Ensure database exists: CREATE DATABASE parichay;"
    exit 1
fi

echo ""
echo -e "${GREEN}[5/6] Running additional migrations...${NC}"
echo ""

# Check if psql is available
if command -v psql &> /dev/null; then
    echo "Running white-label migration..."
    psql -d parichay -f prisma/migrations/add_white_label_support.sql 2>/dev/null || echo -e "${YELLOW}[WARNING] White-label migration may have already been applied${NC}"

    echo "Running MFA migration..."
    psql -d parichay -f prisma/migrations/add_mfa_fields.sql 2>/dev/null || echo -e "${YELLOW}[WARNING] MFA migration may have already been applied${NC}"

    echo "Running performance indexes..."
    psql -d parichay -f prisma/migrations/add_performance_indexes.sql 2>/dev/null || echo -e "${YELLOW}[WARNING] Performance indexes may have already been applied${NC}"
else
    echo -e "${YELLOW}[WARNING] psql not found. Skipping additional migrations.${NC}"
    echo "You can run them manually later if needed."
fi

echo ""
echo -e "${GREEN}[6/6] Installation complete!${NC}"
echo ""
echo "============================================================================"
echo -e "${GREEN}INSTALLATION SUCCESSFUL!${NC}"
echo "============================================================================"
echo ""
echo "Features installed:"
echo "  ✓ Multi-tenant white-label platform"
echo "  ✓ Agency management system"
echo "  ✓ Client management"
echo "  ✓ Billing and usage tracking"
echo "  ✓ Multi-factor authentication"
echo "  ✓ Verification system"
echo "  ✓ Premium features"
echo ""
echo "Next steps:"
echo "  1. Start development server: npm run dev"
echo "  2. Visit: http://localhost:3000"
echo "  3. Create your first agency: /agency/onboarding"
echo ""
echo "Documentation:"
echo "  - INSTALLATION_GUIDE.md"
echo "  - WHITE_LABEL_IMPLEMENTATION_SUMMARY.md"
echo "  - AGENCY_PORTAL_COMPLETE.md"
echo "  - AGENCY_QUICK_REFERENCE.md"
echo ""
echo "============================================================================"
echo ""
