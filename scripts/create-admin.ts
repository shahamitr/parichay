/**
 * Create Admin Account Script
 *
 * Creates a SUPER_ADMIN account for platform administration
 *
 * Usage: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  console.log('👤 Creating Admin Account...\n');

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@onetouch.local' },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('   Email: admin@onetouch.local');
      console.log('   To reset password, delete the user first.\n');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@onetouch.local',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        phone: '+91 99999 99999',
        isActive: true,
      },
    });

    console.log('✅ Admin account created successfully!\n');
    console.log('📝 Admin Credentials:');
    console.log('   Email: admin@onetouch.local');
    console.log('   Password: Admin@123');
    console.log('   Role: SUPER_ADMIN\n');
    console.log('🎉 You can now login to the admin dashboard!');
    console.log('   URL: http://localhost:3000/login\n');

  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
