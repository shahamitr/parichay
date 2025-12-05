#!/bin/bash

# Seed Demo Data Script for Linux/Mac

echo ""
echo "🌱 OneTouch BizCard - Demo Data Seeder"
echo "====================================="
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Generating Prisma Client..."
npx prisma generate

echo ""
echo "🌱 Seeding demo data..."
npx tsx prisma/seed-demo.ts

echo ""
echo "✅ Demo data seeding complete!"
echo ""
echo "📝 Demo Executive Credentials:"
echo "   Email: john.smith@demo.executive"
echo "   Email: sarah.johnson@demo.executive"
echo "   Email: michael.chen@demo.executive"
echo "   Email: priya.patel@demo.executive"
echo "   Email: david.kumar@demo.executive"
echo "   Password: Demo@123"
echo ""
echo "🎉 You can now login and explore the platform!"
echo ""
