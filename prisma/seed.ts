import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create subscription plans
  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'basic-plan' },
    update: {},
    create: {
      id: 'basic-plan',
      name: 'Basic',
      price: 999,
      duration: 'MONTHLY',
      features: {
        maxBranches: 3,
        customDomain: false,
        analytics: true,
        qrCodes: true,
        leadCapture: true,
        templates: 5,
      },
    },
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'pro-plan' },
    update: {},
    create: {
      id: 'pro-plan',
      name: 'Professional',
      price: 1999,
      duration: 'MONTHLY',
      features: {
        maxBranches: 10,
        customDomain: true,
        analytics: true,
        qrCodes: true,
        leadCapture: true,
        templates: 15,
        prioritySupport: true,
      },
    },
  });

  const enterprisePlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'enterprise-plan' },
    update: {},
    create: {
      id: 'enterprise-plan',
      name: 'Enterprise',
      price: 4999,
      duration: 'MONTHLY',
      features: {
        maxBranches: -1, // Unlimited
        customDomain: true,
        analytics: true,
        qrCodes: true,
        leadCapture: true,
        templates: -1, // All templates
        prioritySupport: true,
        whiteLabel: true,
        apiAccess: true,
      },
    },
  });

  // Create super admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@onetouchbizcard.in' },
    update: {},
    create: {
      email: 'admin@onetouchbizcard.in',
      passwordHash: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      phone: '+91-9999999999',
    },
  });

  // Create demo brand
  const demoBrand = await prisma.brand.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'Demo Company',
      slug: 'demo-company',
      tagline: 'Your trusted business partner',
      colorTheme: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#F59E0B',
      },
      ownerId: superAdmin.id,
    },
  });

  // Create demo branch
  const demoBranch = await prisma.branch.create({
    data: {
      name: 'Main Office',
      slug: 'main-office',
      brandId: demoBrand.id,
      address: {
        street: '123 Business Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
      },
      contact: {
        phone: '+91-9876543210',
        whatsapp: '+91-9876543210',
        email: 'contact@democompany.com',
      },
      socialMedia: {
        facebook: 'https://facebook.com/democompany',
        instagram: 'https://instagram.com/democompany',
        linkedin: 'https://linkedin.com/company/democompany',
      },
      businessHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '00:00', close: '00:00', closed: true },
      },
      micrositeConfig: {
        templateId: 'modern-business',
        sections: {
          hero: {
            enabled: true,
            title: 'Welcome to Demo Company',
            subtitle: 'Your trusted business partner for all your needs',
            backgroundImage: null,
          },
          about: {
            enabled: true,
            content: 'We are a leading company in our industry with over 10 years of experience.',
          },
          services: {
            enabled: true,
            items: [
              {
                name: 'Consulting',
                description: 'Professional business consulting services',
                price: 5000,
              },
              {
                name: 'Support',
                description: '24/7 customer support services',
                price: 2000,
              },
            ],
          },
          gallery: {
            enabled: true,
            images: [],
          },
          contact: {
            enabled: true,
            showMap: true,
            leadForm: {
              enabled: true,
              fields: ['name', 'email', 'phone', 'message'],
            },
          },
        },
        seoSettings: {
          title: 'Demo Company - Main Office',
          description: 'Contact Demo Company Main Office for all your business needs. Located in Mumbai, Maharashtra.',
          keywords: ['demo company', 'business', 'mumbai', 'consulting'],
        },
      },
    },
  });

  // Create sample leads
  const sampleLeads = [
    {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+91-9876543211',
      message: 'Interested in your consulting services. Please contact me.',
      status: 'NEW' as const,
      source: 'Website',
      branchId: demoBranch.id,
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+91-9876543212',
      message: 'Looking for business partnership opportunities.',
      status: 'CONTACTED' as const,
      source: 'Social Media',
      branchId: demoBranch.id,
    },
    {
      name: 'Mike Wilson',
      email: 'mike.wilson@business.com',
      phone: '+91-9876543213',
      message: 'Need support services for our company.',
      status: 'QUALIFIED' as const,
      source: 'Referral',
      branchId: demoBranch.id,
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@startup.com',
      phone: '+91-9876543214',
      message: 'Interested in your premium consulting package.',
      status: 'CONVERTED' as const,
      source: 'Google Ads',
      branchId: demoBranch.id,
    },
    {
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      phone: '+91-9876543215',
      message: 'Checking pricing for your services.',
      status: 'LOST' as const,
      source: 'Website',
      branchId: demoBranch.id,
    },
  ];

  const createdLeads = [];
  for (const leadData of sampleLeads) {
    const lead = await prisma.lead.create({
      data: leadData,
    });
    createdLeads.push(lead);
  }

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log(`  - ${3} subscription plans`);
  console.log(`  - ${1} super admin user`);
  console.log(`  - ${1} demo brand`);
  console.log(`  - ${1} demo branch`);
  console.log(`  - ${createdLeads.length} sample leads`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });