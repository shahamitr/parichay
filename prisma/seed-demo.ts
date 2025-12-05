/**
 * Demo Data Seed Script
 *
 * This script creates comprehensive demo data for showcasing the platform:
 * - Multiple brands with different industries
 * - Executives with performance data
 * - Branches with complete microsite configurations
 * - Sample leads and analytics
 *
 * Usage: npx tsx prisma/seed-demo.ts
 */

import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting demo data seeding...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing demo data...');
  await prisma.lead.deleteMany({});
  await prisma.analyticsEvent.deleteMany({});
  await prisma.qRCode.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.user.deleteMany({ where: { email: { contains: '@demo.' } } });
  await prisma.brand.deleteMany({ where: { slug: { contains: 'demo-' } } });

  // Create Demo Brands
  console.log('\n🏢 Creating demo brands...');

  const brands = await Promise.all([
    // 1. Tech Startup
    prisma.brand.create({
      data: {
        name: 'TechVision Solutions',
        slug: 'demo-techvision',
        logo: 'https://ui-avatars.com/api/?name=TechVision+Solutions&size=200&background=3B82F6&color=FFFFFF&bold=true',
        tagline: 'Innovating Tomorrow, Today',
        colorTheme: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#F59E0B',
        },
        ownerId: 'demo-owner-1',
      },
    }),

    // 2. Restaurant Chain
    prisma.brand.create({
      data: {
        name: 'Spice Garden Restaurant',
        slug: 'demo-spicegarden',
        logo: 'https://ui-avatars.com/api/?name=Spice+Garden&size=200&background=EF4444&color=FFFFFF&bold=true',
        tagline: 'Authentic Flavors, Memorable Moments',
        colorTheme: {
          primary: '#EF4444',
          secondary: '#DC2626',
          accent: '#F59E0B',
        },
        ownerId: 'demo-owner-2',
      },
    }),

    // 3. Fitness Center
    prisma.brand.create({
      data: {
        name: 'FitLife Gym & Wellness',
        slug: 'demo-fitlife',
        logo: 'https://ui-avatars.com/api/?name=FitLife+Gym&size=200&background=10B981&color=FFFFFF&bold=true',
        tagline: 'Transform Your Life',
        colorTheme: {
          primary: '#10B981',
          secondary: '#059669',
          accent: '#F59E0B',
        },
        ownerId: 'demo-owner-3',
      },
    }),

    // 4. Real Estate
    prisma.brand.create({
      data: {
        name: 'Prime Properties Group',
        slug: 'demo-primeproperties',
        logo: 'https://ui-avatars.com/api/?name=Prime+Properties&size=200&background=8B5CF6&color=FFFFFF&bold=true',
        tagline: 'Your Dream Home Awaits',
        colorTheme: {
          primary: '#8B5CF6',
          secondary: '#7C3AED',
          accent: '#F59E0B',
        },
        ownerId: 'demo-owner-4',
      },
    }),

    // 5. Medical Clinic
    prisma.brand.create({
      data: {
        name: 'HealthCare Plus Clinic',
        slug: 'demo-healthcareplus',
        logo: 'https://ui-avatars.com/api/?name=HealthCare+Plus&size=200&background=06B6D4&color=FFFFFF&bold=true',
        tagline: 'Your Health, Our Priority',
        colorTheme: {
          primary: '#06B6D4',
          secondary: '#0891B2',
          accent: '#F59E0B',
        },
        ownerId: 'demo-owner-5',
      },
    }),
  ]);

  console.log(`✅ Created ${brands.length} demo brands`);

  // Create Demo Executives
  console.log('\n👥 Creating demo executives...');

  const hashedPassword = await bcrypt.hash('Demo@123', 10);

  const executives = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.smith@demo.executive',
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Smith',
        role: 'EXECUTIVE',
        phone: '+91 98765 43210',
        isActive: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'sarah.johnson@demo.executive',
        passwordHash: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'EXECUTIVE',
        phone: '+91 98765 43211',
        isActive: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'michael.chen@demo.executive',
        passwordHash: hashedPassword,
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'EXECUTIVE',
        phone: '+91 98765 43212',
        isActive: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'priya.patel@demo.executive',
        passwordHash: hashedPassword,
        firstName: 'Priya',
        lastName: 'Patel',
        role: 'EXECUTIVE',
        phone: '+91 98765 43213',
        isActive: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'david.kumar@demo.executive',
        passwordHash: hashedPassword,
        firstName: 'David',
        lastName: 'Kumar',
        role: 'EXECUTIVE',
        phone: '+91 98765 43214',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${executives.length} demo executives`);

  // Create Demo Branches with Complete Microsite Configurations
  console.log('\n🏪 Creating demo branches...');

  const branches = [];

  // TechVision Branches
  branches.push(
    await prisma.branch.create({
      data: {
        name: 'TechVision Mumbai HQ',
        slug: 'mumbai-hq',
        brandId: brands[0].id,
        isActive: true,
        onboardedBy: executives[0].id,
        onboardedAt: new Date('2024-01-15'),
        address: {
          street: '123 Business Park, Andheri East',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400069',
          country: 'India',
        },
        contact: {
          phone: '+91 22 1234 5678',
          whatsapp: '+91 98765 00001',
          email: 'mumbai@techvision.demo',
        },
        socialMedia: {
          facebook: 'https://facebook.com/techvision',
          instagram: 'https://instagram.com/techvision',
          linkedin: 'https://linkedin.com/company/techvision',
          twitter: 'https://twitter.com/techvision',
        },
        businessHours: {
          monday: { open: '09:00 AM', close: '06:00 PM', closed: false },
          tuesday: { open: '09:00 AM', close: '06:00 PM', closed: false },
          wednesday: { open: '09:00 AM', close: '06:00 PM', closed: false },
          thursday: { open: '09:00 AM', close: '06:00 PM', closed: false },
          friday: { open: '09:00 AM', close: '06:00 PM', closed: false },
          saturday: { open: '10:00 AM', close: '02:00 PM', closed: false },
          sunday: { open: '00:00 AM', close: '00:00 PM', closed: true },
        },
        micrositeConfig: {
          templateId: 'modern-business',
          sections: {
            hero: {
              enabled: true,
              title: 'Welcome to TechVision Solutions',
              subtitle: 'Transforming businesses through innovative technology',
              backgroundType: 'gradient',
              animationEnabled: true,
            },
            about: {
              enabled: true,
              content: 'TechVision Solutions is a leading technology company specializing in custom software development, cloud solutions, and digital transformation. With over 10 years of experience, we help businesses leverage technology to achieve their goals.',
            },
            services: {
              enabled: true,
              items: [
                {
                  id: 'service-1',
                  name: 'Custom Software Development',
                  description: 'Tailored software solutions built to meet your specific business needs',
                  price: 150000,
                  category: 'development',
                  availability: 'available',
                  features: [
                    'Full-stack development',
                    'Agile methodology',
                    'Quality assurance',
                    'Post-launch support',
                  ],
                },
                {
                  id: 'service-2',
                  name: 'Cloud Migration Services',
                  description: 'Seamlessly migrate your infrastructure to the cloud',
                  price: 200000,
                  category: 'cloud',
                  availability: 'available',
                  features: [
                    'AWS/Azure/GCP expertise',
                    'Zero downtime migration',
                    'Cost optimization',
                    '24/7 monitoring',
                  ],
                },
                {
                  id: 'service-3',
                  name: 'Mobile App Development',
                  description: 'Native and cross-platform mobile applications',
                  price: 180000,
                  category: 'development',
                  availability: 'available',
                  features: [
                    'iOS & Android',
                    'React Native/Flutter',
                    'App Store optimization',
                    'Maintenance & updates',
                  ],
                },
              ],
            },
            gallery: {
              enabled: true,
              images: [
                'https://picsum.photos/800/600?random=1',
                'https://picsum.photos/800/600?random=2',
                'https://picsum.photos/800/600?random=3',
              ],
            },
            contact: {
              enabled: true,
              showMap: true,
              leadForm: {
                enabled: true,
                fields: ['name', 'email', 'phone', 'company', 'message'],
              },
              appointmentBooking: {
                enabled: true,
                provider: 'custom',
                availableSlots: [
                  { day: 'monday', slots: ['10:00 AM', '02:00 PM', '04:00 PM'] },
                  { day: 'tuesday', slots: ['10:00 AM', '02:00 PM', '04:00 PM'] },
                  { day: 'wednesday', slots: ['10:00 AM', '02:00 PM', '04:00 PM'] },
                  { day: 'thursday', slots: ['10:00 AM', '02:00 PM', '04:00 PM'] },
                  { day: 'friday', slots: ['10:00 AM', '02:00 PM'] },
                ],
              },
              liveChatEnabled: false,
            },
          },
          seoSettings: {
            title: 'TechVision Solutions Mumbai - Custom Software Development',
            description: 'Leading technology company in Mumbai offering custom software development, cloud solutions, and digital transformation services.',
            keywords: ['software development', 'cloud migration', 'mobile apps', 'Mumbai'],
          },
        },
      },
    })
  );

  // Spice Garden Branches
  branches.push(
    await prisma.branch.create({
      data: {
        name: 'Spice Garden Bandra',
        slug: 'bandra',
        brandId: brands[1].id,
        isActive: true,
        onboardedBy: executives[1].id,
        onboardedAt: new Date('2024-02-10'),
        address: {
          street: '456 Linking Road, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400050',
          country: 'India',
        },
        contact: {
          phone: '+91 22 2345 6789',
          whatsapp: '+91 98765 00002',
          email: 'bandra@spicegarden.demo',
        },
        socialMedia: {
          facebook: 'https://facebook.com/spicegarden',
          instagram: 'https://instagram.com/spicegarden',
        },
        businessHours: {
          monday: { open: '11:00 AM', close: '11:00 PM', closed: false },
          tuesday: { open: '11:00 AM', close: '11:00 PM', closed: false },
          wednesday: { open: '11:00 AM', close: '11:00 PM', closed: false },
          thursday: { open: '11:00 AM', close: '11:00 PM', closed: false },
          friday: { open: '11:00 AM', close: '11:00 PM', closed: false },
          saturday: { open: '11:00 AM', close: '11:00 PM', closed: false },
          sunday: { open: '11:00 AM', close: '11:00 PM', closed: false },
        },
        micrositeConfig: {
          templateId: 'modern-business',
          sections: {
            hero: {
              enabled: true,
              title: 'Welcome to Spice Garden',
              subtitle: 'Experience authentic Indian cuisine',
              backgroundType: 'image',
              backgroundImage: 'https://picsum.photos/1920/1080?random=restaurant',
              animationEnabled: true,
            },
            about: {
              enabled: true,
              content: 'Spice Garden brings you the finest authentic Indian cuisine with recipes passed down through generations. Our chefs use only the freshest ingredients and traditional cooking methods to create unforgettable dining experiences.',
            },
            services: {
              enabled: true,
              items: [
                {
                  id: 'menu-1',
                  name: 'Butter Chicken',
                  description: 'Tender chicken in rich tomato and butter gravy',
                  price: 450,
                  category: 'main-course',
                  availability: 'available',
                  features: ['Chef Special', 'Most Popular', 'Mild Spice'],
                },
                {
                  id: 'menu-2',
                  name: 'Biryani Special',
                  description: 'Aromatic basmati rice with choice of meat or vegetables',
                  price: 380,
                  category: 'main-course',
                  availability: 'available',
                  features: ['Signature Dish', 'Medium Spice', 'Serves 1-2'],
                },
                {
                  id: 'menu-3',
                  name: 'Paneer Tikka',
                  description: 'Grilled cottage cheese with Indian spices',
                  price: 320,
                  category: 'appetizer',
                  availability: 'available',
                  features: ['Vegetarian', 'Tandoor Cooked', 'Mild Spice'],
                },
              ],
            },
            gallery: {
              enabled: true,
              images: [
                'https://picsum.photos/800/600?random=10',
                'https://picsum.photos/800/600?random=11',
                'https://picsum.photos/800/600?random=12',
              ],
            },
            contact: {
              enabled: true,
              showMap: true,
              leadForm: {
                enabled: true,
                fields: ['name', 'phone', 'date', 'guests', 'message'],
              },
              appointmentBooking: {
                enabled: true,
                provider: 'custom',
                availableSlots: [
                  { day: 'monday', slots: ['12:00 PM', '01:00 PM', '07:00 PM', '08:00 PM'] },
                  { day: 'tuesday', slots: ['12:00 PM', '01:00 PM', '07:00 PM', '08:00 PM'] },
                  { day: 'wednesday', slots: ['12:00 PM', '01:00 PM', '07:00 PM', '08:00 PM'] },
                  { day: 'thursday', slots: ['12:00 PM', '01:00 PM', '07:00 PM', '08:00 PM'] },
                  { day: 'friday', slots: ['12:00 PM', '01:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'] },
                  { day: 'saturday', slots: ['12:00 PM', '01:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'] },
                  { day: 'sunday', slots: ['12:00 PM', '01:00 PM', '07:00 PM', '08:00 PM'] },
                ],
              },
            },
          },
          seoSettings: {
            title: 'Spice Garden Bandra - Authentic Indian Restaurant',
            description: 'Experience the finest authentic Indian cuisine at Spice Garden Bandra. Book your table today!',
            keywords: ['Indian restaurant', 'Bandra', 'authentic cuisine', 'fine dining'],
          },
        },
      },
    })
  );

  // FitLife Branches
  branches.push(
    await prisma.branch.create({
      data: {
        name: 'FitLife Powai',
        slug: 'powai',
        brandId: brands[2].id,
        isActive: true,
        onboardedBy: executives[2].id,
        onboardedAt: new Date('2024-02-20'),
        address: {
          street: '789 Hiranandani Gardens',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400076',
          country: 'India',
        },
        contact: {
          phone: '+91 22 3456 7890',
          whatsapp: '+91 98765 00003',
          email: 'powai@fitlife.demo',
        },
        socialMedia: {
          facebook: 'https://facebook.com/fitlifegym',
          instagram: 'https://instagram.com/fitlifegym',
          youtube: 'https://youtube.com/fitlifegym',
        },
        businessHours: {
          monday: { open: '06:00 AM', close: '10:00 PM', closed: false },
          tuesday: { open: '06:00 AM', close: '10:00 PM', closed: false },
          wednesday: { open: '06:00 AM', close: '10:00 PM', closed: false },
          thursday: { open: '06:00 AM', close: '10:00 PM', closed: false },
          friday: { open: '06:00 AM', close: '10:00 PM', closed: false },
          saturday: { open: '07:00 AM', close: '09:00 PM', closed: false },
          sunday: { open: '07:00 AM', close: '09:00 PM', closed: false },
        },
        micrositeConfig: {
          templateId: 'modern-business',
          sections: {
            hero: {
              enabled: true,
              title: 'Transform Your Life at FitLife',
              subtitle: 'State-of-the-art gym and wellness center',
              backgroundType: 'gradient',
              animationEnabled: true,
            },
            about: {
              enabled: true,
              content: 'FitLife Gym & Wellness is your partner in achieving your fitness goals. With state-of-the-art equipment, expert trainers, and a supportive community, we help you transform your life one workout at a time.',
            },
            services: {
              enabled: true,
              items: [
                {
                  id: 'membership-1',
                  name: 'Monthly Membership',
                  description: 'Full access to gym and group classes',
                  price: 2500,
                  category: 'membership',
                  availability: 'available',
                  features: [
                    'Unlimited gym access',
                    'Group fitness classes',
                    'Locker facility',
                    'Free fitness assessment',
                  ],
                },
                {
                  id: 'membership-2',
                  name: 'Personal Training Package',
                  description: '12 sessions with certified personal trainer',
                  price: 15000,
                  category: 'training',
                  availability: 'available',
                  features: [
                    '12 one-on-one sessions',
                    'Customized workout plan',
                    'Nutrition guidance',
                    'Progress tracking',
                  ],
                },
                {
                  id: 'membership-3',
                  name: 'Yoga & Wellness',
                  description: 'Monthly yoga and meditation classes',
                  price: 3000,
                  category: 'wellness',
                  availability: 'available',
                  features: [
                    'Daily yoga classes',
                    'Meditation sessions',
                    'Breathing exercises',
                    'Stress management',
                  ],
                },
              ],
            },
            gallery: {
              enabled: true,
              images: [
                'https://picsum.photos/800/600?random=20',
                'https://picsum.photos/800/600?random=21',
                'https://picsum.photos/800/600?random=22',
              ],
            },
            contact: {
              enabled: true,
              showMap: true,
              leadForm: {
                enabled: true,
                fields: ['name', 'email', 'phone', 'message'],
              },
              appointmentBooking: {
                enabled: true,
                provider: 'custom',
                availableSlots: [
                  { day: 'monday', slots: ['09:00 AM', '11:00 AM', '04:00 PM', '06:00 PM'] },
                  { day: 'tuesday', slots: ['09:00 AM', '11:00 AM', '04:00 PM', '06:00 PM'] },
                  { day: 'wednesday', slots: ['09:00 AM', '11:00 AM', '04:00 PM', '06:00 PM'] },
                  { day: 'thursday', slots: ['09:00 AM', '11:00 AM', '04:00 PM', '06:00 PM'] },
                  { day: 'friday', slots: ['09:00 AM', '11:00 AM', '04:00 PM', '06:00 PM'] },
                  { day: 'saturday', slots: ['10:00 AM', '12:00 PM', '04:00 PM'] },
                ],
              },
            },
          },
          seoSettings: {
            title: 'FitLife Gym Powai - Transform Your Life',
            description: 'Join FitLife Gym in Powai for state-of-the-art fitness facilities, expert trainers, and a supportive community.',
            keywords: ['gym', 'fitness', 'Powai', 'personal training', 'yoga'],
          },
        },
      },
    })
  );

  // Add more branches for other brands...
  // (Continuing with Prime Properties and HealthCare Plus)

  console.log(`✅ Created ${branches.length} demo branches`);

  // Create Sample Leads
  console.log('\n📧 Creating sample leads...');

  const leads = [];
  for (let i = 0; i < 20; i++) {
    leads.push(
      await prisma.lead.create({
        data: {
          branchId: branches[i % branches.length].id,
          name: `Lead ${i + 1}`,
          email: `lead${i + 1}@demo.com`,
          phone: `+91 98765 ${String(i).padStart(5, '0')}`,
          message: 'Interested in your services. Please contact me.',
          source: i % 3 === 0 ? 'qr_code' : i % 3 === 1 ? 'direct_visit' : 'social_share',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      })
    );
  }

  console.log(`✅ Created ${leads.length} sample leads`);

  // Create Analytics Events
  console.log('\n📊 Creating analytics events...');

  const events = [];
  for (let i = 0; i < 100; i++) {
    const branch = branches[i % branches.length];
    events.push(
      await prisma.analyticsEvent.create({
        data: {
          branchId: branch.id,
          brandId: branch.brandId,
          eventType: ['PAGE_VIEW', 'CLICK', 'QR_SCAN', 'LEAD_SUBMIT', 'VCARD_DOWNLOAD'][i % 5] as any,
          metadata: {
            page: '/microsites',
            action: 'view',
          },
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      })
    );
  }

  console.log(`✅ Created ${events.length} analytics events`);

  console.log('\n✨ Demo data seeding completed successfully!\n');
  console.log('📝 Demo Credentials:');
  console.log('   Executives:');
  executives.forEach((exec) => {
    console.log(`   - ${exec.email} / Demo@123`);
  });
  console.log('\n🎉 You can now showcase the platform with realistic demo data!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
