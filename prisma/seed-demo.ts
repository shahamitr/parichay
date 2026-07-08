/**
 * Demo Data Seed Script
 *
 * Creates a dedicated demo microsite for each of the 11 industry categories.
 * Each demo includes: Brand, Branch, User, sample Leads, Analytics Events, and QR Code.
 *
 * Idempotent: safely re-runnable — deletes all existing demo data before re-creating.
 *
 * Usage: npx tsx prisma/seed-demo.ts
 */

import { industryCategories } from '../src/data/categories.js';
import { buildDemoSlug, buildDemoEmail } from '../src/lib/demo-utils.js';

// Lazy-loaded dependencies — only initialised when the seed script actually runs,
// so that test files can import the static maps/constants without triggering
// PrismaClient instantiation or database connections.
let _prisma: any = null;

function getPrisma() {
  if (!_prisma) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('../src/generated/prisma/index.js');
    _prisma = new PrismaClient();
  }
  return _prisma;
}

// Lazy-loaded content generator
let _generateMicrositeContent: ((
  categorySlug: string,
  businessName: string,
  tagline: string,
) => Record<string, unknown>) | null = null;

function getGenerateMicrositeContent() {
  if (!_generateMicrositeContent) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require('./demo-content');
      _generateMicrositeContent = mod.generateMicrositeContent;
    } catch {
      _generateMicrositeContent = (
        _categorySlug: string,
        businessName: string,
        tagline: string,
      ) => buildFallbackContent(businessName, tagline);
    }
  }
  return _generateMicrositeContent!;
}

// ---------------------------------------------------------------------------
// Static maps from the design document
// ---------------------------------------------------------------------------

/** Maps each category slug to a unique layout ID from layout-options.ts */
const INDUSTRY_LAYOUT_MAP: Record<string, string> = {
  'business-owners': 'modern-business',
  'corporate-professionals': 'corporate-professional',
  'event-planners': 'event-venue',
  'freelancers-consultants': 'consulting-firm',
  'educational-institutions': 'nordic-simple',
  'creatives-designers': 'creative-portfolio',
  'real-estate-agents': 'startup-dynamic',
  'healthcare-professionals': 'zen-spa',
  'restaurants-cafes': 'restaurant-hospitality',
  'fitness-wellness': 'fitness-energy',
  'legal-services': 'luxury-boutique',
};

/** Maps each category slug to a demo business name and tagline */
const INDUSTRY_DEMO_NAMES: Record<string, { name: string; tagline: string }> = {
  'business-owners': { name: 'Pinnacle Enterprises', tagline: 'Building Success Together' },
  'corporate-professionals': { name: 'Apex Corporate Solutions', tagline: 'Excellence in Every Engagement' },
  'event-planners': { name: 'Stellar Events Co.', tagline: 'Creating Unforgettable Moments' },
  'freelancers-consultants': { name: 'ProConsult Hub', tagline: 'Expert Solutions On Demand' },
  'educational-institutions': { name: 'Bright Horizons Academy', tagline: 'Shaping Future Leaders' },
  'creatives-designers': { name: 'Artisan Design Studio', tagline: 'Where Creativity Meets Craft' },
  'real-estate-agents': { name: 'Prime Realty Group', tagline: 'Your Dream Property Awaits' },
  'healthcare-professionals': { name: 'CareFirst Medical Center', tagline: 'Your Health, Our Priority' },
  'restaurants-cafes': { name: 'The Golden Spoon', tagline: 'A Culinary Journey Awaits' },
  'fitness-wellness': { name: 'VitalFit Studio', tagline: 'Transform Your Body & Mind' },
  'legal-services': { name: 'Sterling Law Associates', tagline: 'Justice With Integrity' },
};

// ---------------------------------------------------------------------------
// Lead statuses & analytics event types used for sample data
// ---------------------------------------------------------------------------

const LEAD_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'] as const;
const LEAD_SOURCES = ['qr_code', 'direct_visit', 'social_share'] as const;
const EVENT_TYPES = ['PAGE_VIEW', 'CLICK', 'QR_SCAN', 'LEAD_SUBMIT', 'VCARD_DOWNLOAD'] as const;

// ---------------------------------------------------------------------------
// Seed result tracking
// ---------------------------------------------------------------------------

interface SeedResult {
  brandsCreated: number;
  branchesCreated: number;
  usersCreated: number;
  leadsCreated: number;
  eventsCreated: number;
  qrCodesCreated: number;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Fallback content generator (used until prisma/demo-content.ts exists)
// ---------------------------------------------------------------------------

function buildFallbackContent(
  businessName: string,
  tagline: string,
): Record<string, unknown> {
  return {
    templateId: 'modern-business',
    seoSettings: {
      title: `${businessName} — ${tagline}`,
      description: `Welcome to ${businessName}. ${tagline}.`,
      keywords: [businessName.toLowerCase()],
    },
    sections: {
      hero: {
        enabled: true,
        title: businessName,
        subtitle: tagline,
        backgroundType: 'gradient',
        animationEnabled: true,
      },
      about: {
        enabled: true,
        content: `${businessName} is a leading provider in its industry. We are committed to delivering exceptional quality and service to all our clients. ${tagline}.`,
      },
      services: {
        enabled: true,
        items: [
          { id: 's1', name: 'Core Service', description: 'Our flagship offering', price: 5000, category: 'primary', availability: 'available', features: ['Professional', 'Reliable', 'Affordable'] },
          { id: 's2', name: 'Premium Service', description: 'Enhanced experience', price: 10000, category: 'premium', availability: 'available', features: ['Priority support', 'Custom solutions', 'Dedicated team'] },
          { id: 's3', name: 'Consultation', description: 'Expert guidance', price: 2000, category: 'advisory', availability: 'available', features: ['1-on-1 session', 'Action plan', 'Follow-up'] },
        ],
      },
      gallery: {
        enabled: true,
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
          'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
        ],
      },
      team: {
        enabled: true,
        title: 'Our Team',
        subtitle: 'Meet the experts',
        members: [
          { id: 't1', name: 'Alex Johnson', role: 'Founder & CEO', bio: 'Visionary leader with 15+ years of experience', photo: 'https://ui-avatars.com/api/?name=Alex+Johnson&size=200' },
          { id: 't2', name: 'Priya Sharma', role: 'Operations Head', bio: 'Expert in streamlining business processes', photo: 'https://ui-avatars.com/api/?name=Priya+Sharma&size=200' },
        ],
      },
      testimonials: {
        enabled: true,
        items: [
          { id: 'r1', name: 'Rahul Verma', role: 'Client', content: 'Outstanding service and professionalism. Highly recommended!', rating: 5 },
          { id: 'r2', name: 'Anita Desai', role: 'Partner', content: 'A pleasure to work with. They truly understand our needs.', rating: 5 },
        ],
      },
      booking: {
        enabled: true,
        title: 'Book an Appointment',
        subtitle: 'Schedule a session with us',
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
  };
}

// ---------------------------------------------------------------------------
// Helper: random date within the last N days
// ---------------------------------------------------------------------------

function randomDateWithinDays(days: number): Date {
  const now = Date.now();
  return new Date(now - Math.random() * days * 24 * 60 * 60 * 1000);
}

// ---------------------------------------------------------------------------
// Idempotent cleanup
// ---------------------------------------------------------------------------

async function cleanupDemoData(): Promise<void> {
  const prisma = getPrisma();
  console.log('🗑️  Cleaning up existing demo data...');

  // Find all demo brands
  const demoBrands = await prisma.brand.findMany({
    where: { slug: { startsWith: 'demo-' } },
    select: { id: true },
  });

  const brandIds = demoBrands.map((b) => b.id);

  if (brandIds.length > 0) {
    // Delete cascading data tied to demo brands
    await prisma.lead.deleteMany({ where: { branch: { brandId: { in: brandIds } } } });
    await prisma.analyticsEvent.deleteMany({ where: { brandId: { in: brandIds } } });
    await prisma.qRCode.deleteMany({ where: { brandId: { in: brandIds } } });
    await prisma.branch.deleteMany({ where: { brandId: { in: brandIds } } });
    await prisma.brand.deleteMany({ where: { id: { in: brandIds } } });
  }

  // Delete demo users
  await prisma.user.deleteMany({ where: { email: { endsWith: '@demo.parichay.io' } } });

  console.log(`   Removed ${brandIds.length} demo brand(s) and associated data.`);
}

// ---------------------------------------------------------------------------
// Create sample leads for a branch
// ---------------------------------------------------------------------------

async function createSampleLeads(branchId: string, count: number): Promise<number> {
  const prisma = getPrisma();
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan'];
  const lastNames = ['Sharma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Verma', 'Mehta', 'Joshi', 'Reddy', 'Nair'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    await prisma.lead.create({
      data: {
        branchId,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `+91 98765 ${String(10000 + i).slice(-5)}`,
        message: 'Interested in your services. Please share more details.',
        source: LEAD_SOURCES[i % LEAD_SOURCES.length],
        status: LEAD_STATUSES[i % LEAD_STATUSES.length],
        createdAt: randomDateWithinDays(30),
      },
    });
  }
  return count;
}

// ---------------------------------------------------------------------------
// Create analytics events for a branch
// ---------------------------------------------------------------------------

async function createAnalyticsEvents(
  branchId: string,
  brandId: string,
  count: number,
): Promise<number> {
  const prisma = getPrisma();
  for (let i = 0; i < count; i++) {
    await prisma.analyticsEvent.create({
      data: {
        branchId,
        brandId,
        eventType: EVENT_TYPES[i % EVENT_TYPES.length] as never,
        metadata: { page: '/microsites', action: 'view' },
        createdAt: randomDateWithinDays(30),
      },
    });
  }
  return count;
}

// ---------------------------------------------------------------------------
// Create a QR code for a branch
// ---------------------------------------------------------------------------

async function createQRCode(branchId: string, brandId: string, brandSlug: string): Promise<void> {
  const prisma = getPrisma();
  await prisma.qRCode.create({
    data: {
      branchId,
      brandId,
      url: `/${brandSlug}/main`,
      qrData: `data:image/png;base64,placeholder-${brandSlug}`,
      format: 'PNG',
    },
  });
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seedDemoData(): Promise<SeedResult> {
  const prisma = getPrisma();
  const generateMicrositeContent = getGenerateMicrositeContent();
  const result: SeedResult = {
    brandsCreated: 0,
    branchesCreated: 0,
    usersCreated: 0,
    leadsCreated: 0,
    eventsCreated: 0,
    qrCodesCreated: 0,
    errors: [],
  };

  // Step 1: Idempotent cleanup
  await cleanupDemoData();

  // Step 2: Hash the shared demo password once
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('Demo@123', 10);

  console.log('\n🏗️  Creating demo microsites for 11 industry categories...\n');

  // Step 3: Iterate over every industry category
  for (const category of industryCategories) {
    try {
      const slug = category.slug;
      const brandSlug = buildDemoSlug(slug);
      const demoInfo = INDUSTRY_DEMO_NAMES[slug] ?? { name: category.name, tagline: category.description };
      const layoutId = INDUSTRY_LAYOUT_MAP[slug] ?? 'modern-business';

      // --- Brand ---
      const brand = await prisma.brand.create({
        data: {
          name: demoInfo.name,
          slug: brandSlug,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(demoInfo.name)}&size=200&background=${category.colorScheme.primary.replace('#', '')}&color=FFFFFF&bold=true`,
          tagline: demoInfo.tagline,
          colorTheme: {
            primary: category.colorScheme.primary,
            secondary: category.colorScheme.secondary,
            accent: category.colorScheme.accent,
          },
          layoutId,
          ownerId: `demo-owner-${slug}`,
        },
      });
      result.brandsCreated++;

      // --- Branch ---
      const micrositeConfig = generateMicrositeContent(slug, demoInfo.name, demoInfo.tagline);

      const branch = await prisma.branch.create({
        data: {
          name: `${demoInfo.name} — Main`,
          slug: 'main',
          brandId: brand.id,
          isActive: true,
          address: {
            street: '123 Demo Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India',
          },
          contact: {
            phone: '+91 22 1234 5678',
            whatsapp: '+91 98765 00000',
            email: `contact@${slug}.demo`,
          },
          businessHours: {
            monday: { open: '09:00', close: '18:00', closed: false },
            tuesday: { open: '09:00', close: '18:00', closed: false },
            wednesday: { open: '09:00', close: '18:00', closed: false },
            thursday: { open: '09:00', close: '18:00', closed: false },
            friday: { open: '09:00', close: '18:00', closed: false },
            saturday: { open: '10:00', close: '14:00', closed: false },
            sunday: { open: '00:00', close: '00:00', closed: true },
          },
          micrositeConfig,
        },
      });
      result.branchesCreated++;

      // --- User ---
      await prisma.user.create({
        data: {
          email: buildDemoEmail(slug),
          passwordHash: hashedPassword,
          firstName: demoInfo.name.split(' ')[0],
          lastName: demoInfo.name.split(' ').slice(1).join(' ') || 'Demo',
          role: 'BRANCH_ADMIN',
          isActive: true,
          industryCategory: category.id,
          brandId: brand.id,
        },
      });
      result.usersCreated++;

      // --- Leads (5 per branch) ---
      const leadsCreated = await createSampleLeads(branch.id, 5);
      result.leadsCreated += leadsCreated;

      // --- Analytics Events (30 per branch) ---
      const eventsCreated = await createAnalyticsEvents(branch.id, brand.id, 30);
      result.eventsCreated += eventsCreated;

      // --- QR Code (1 per branch) ---
      await createQRCode(branch.id, brand.id, brandSlug);
      result.qrCodesCreated++;

      console.log(`   ✅ ${category.name} → ${brandSlug}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`   ❌ ${category.name}: ${message}`);
      result.errors.push(`${category.name}: ${message}`);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱 Starting demo data seeding...\n');

  const result = await seedDemoData();

  console.log('\n📊 Seed Summary:');
  console.log(`   Brands created:  ${result.brandsCreated}`);
  console.log(`   Branches created: ${result.branchesCreated}`);
  console.log(`   Users created:   ${result.usersCreated}`);
  console.log(`   Leads generated: ${result.leadsCreated}`);
  console.log(`   Events generated: ${result.eventsCreated}`);
  console.log(`   QR codes created: ${result.qrCodesCreated}`);

  if (result.errors.length > 0) {
    console.log(`\n⚠️  Errors (${result.errors.length}):`);
    result.errors.forEach((e) => console.log(`   - ${e}`));
  }

  console.log('\n✨ Demo data seeding completed!\n');
  console.log('📝 Demo Credentials:');
  industryCategories.forEach((cat) => {
    console.log(`   - ${buildDemoEmail(cat.slug)} / Demo@123`);
  });
  console.log('');
}

// Only run main() when executed directly (not when imported by tests)
const isDirectExecution =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (process.argv[1].endsWith('seed-demo.ts') || process.argv[1].endsWith('seed-demo.js'));

if (isDirectExecution) {
  main()
    .catch((e) => {
      console.error('❌ Error seeding demo data:', e);
      process.exit(1);
    })
    .finally(async () => {
      await getPrisma().$disconnect();
    });
}

// Export for testing
export {
  INDUSTRY_LAYOUT_MAP,
  INDUSTRY_DEMO_NAMES,
  LEAD_STATUSES,
  EVENT_TYPES,
  randomDateWithinDays,
  buildFallbackContent,
  seedDemoData,
  cleanupDemoData,
};
