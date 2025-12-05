@echo off
REM Seed Demo Data Script for Windows

echo.
echo 🌱 OneTouch BizCard - Demo Data Seeder
echo =====================================
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🗄️  Generating Prisma Client...
call npx prisma generate

echo.
echo 🌱 Seeding demo data...
call npx tsx prisma/seed-demo.ts

echo.
echo ✅ Demo data seeding complete!
echo.
echo 📝 Demo Executive Credentials:
echo    Email: john.smith@demo.executive
echo    Email: sarah.johnson@demo.executive
echo    Email: michael.chen@demo.executive
echo    Email: priya.patel@demo.executive
echo    Email: david.kumar@demo.executive
echo    Password: Demo@123
echo.
echo 🎉 You can now login and explore the platform!
echo.

pause
