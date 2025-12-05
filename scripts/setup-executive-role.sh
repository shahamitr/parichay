#!/bin/bash

# Setup Executive Role and Onboarding Tracking
# This script helps set up the executive role feature

echo "🚀 Setting up Executive Role and Onboarding Tracking..."
echo ""

# Step 1: Run database migration
echo "📊 Step 1: Running database migration..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Migration failed. Please check your database connection."
    exit 1
fi

echo "✅ Migration completed successfully"
echo ""

# Step 2: Generate Prisma client
echo "🔧 Step 2: Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Prisma client generation failed."
    exit 1
fi

echo "✅ Prisma client generated successfully"
echo ""

# Step 3: Verify schema
echo "🔍 Step 3: Verifying schema..."
npx prisma validate

if [ $? -ne 0 ]; then
    echo "⚠️  Schema validation warnings detected"
else
    echo "✅ Schema validated successfully"
fi

echo ""
echo "✨ Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Create executive users via admin panel or API"
echo "2. Assign executives to branches"
echo "3. View executive stats in the dashboard"
echo ""
echo "📖 For more information, see:"
echo "   - docs/EXECUTIVE_ROLE_GUIDE.md"
echo "   - EXECUTIVE_ROLE_IMPLEMENTATION.md"
echo ""
