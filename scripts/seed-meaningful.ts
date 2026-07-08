
import { PrismaClient } from '../src/generated/prisma/index.js';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting meaningful data seed...');

    // Get the demo brand and branch (from basic seed)
    const brand = await prisma.brand.findFirst({
        where: { slug: 'demo-company' },
    });

    if (!brand) {
        console.error('❌ Demo brand not found. Please run "npm run prisma:seed" first.');
        return;
    }

    const branch = await prisma.branch.findFirst({
        where: { brandId: brand.id },
    });

    if (!branch) {
        console.error('❌ Demo branch not found.');
        return;
    }

    console.log('📊 Generating analytics for:', brand.name);

    // 1. Generate Analytics Events (Page Views & Clicks) for the last 30 days
    const events = [];
    const eventTypes = ['PAGE_VIEW', 'CLICK', 'SCROLL_DEPTH', 'HEATMAP_CLICKS'] as const;

    for (let i = 0; i < 500; i++) {
        const date = faker.date.recent({ days: 30 });
        const eventType = faker.helpers.arrayElement(eventTypes);

        let metadata = {};
        if (eventType === 'PAGE_VIEW') {
            metadata = {
                url: 'http://localhost:3000/demo-company',
                referrer: faker.internet.url(),
                userAgent: faker.internet.userAgent(),
                deviceInfo: {
                    device: faker.helpers.arrayElement(['mobile', 'desktop', 'tablet']),
                    os: faker.helpers.arrayElement(['iOS', 'Android', 'Windows', 'MacOS']),
                    browser: faker.helpers.arrayElement(['Chrome', 'Safari', 'Firefox'])
                },
                locationInfo: {
                    country: 'India',
                    city: faker.location.city()
                }
            };
        } else if (eventType === 'CLICK') {
            metadata = {
                elementId: faker.helpers.arrayElement(['cta-button', 'contact-link', 'service-item']),
                elementText: faker.lorem.words(2),
                pageUrl: '/demo-company'
            };
        } else if (eventType === 'HEATMAP_CLICKS') {
            metadata = {
                clicks: Array.from({ length: 5 }, () => ({
                    x: faker.number.int({ min: 0, max: 100 }),
                    y: faker.number.int({ min: 0, max: 100 }),
                    section: faker.helpers.arrayElement(['hero', 'services', 'contact'])
                })),
                screenWidth: 1920,
                screenHeight: 1080
            };
        } else if (eventType === 'SCROLL_DEPTH') {
            metadata = {
                maxDepth: faker.helpers.arrayElement([25, 50, 75, 100]),
                pageUrl: '/demo-company'
            }
        }

        events.push({
            brandId: brand.id,
            branchId: branch.id,
            eventType,
            metadata,
            createdAt: date,
        });
    }

    // Batch insert analytics
    // Note: Prisma createMany is faster
    await prisma.analyticsEvent.createMany({
        data: events,
    });
    console.log(`✅ Added ${events.length} analytics events`);

    // 2. Generate More Leads
    const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'] as const;
    const leads = [];

    for (let i = 0; i < 20; i++) {
        leads.push({
            branchId: branch.id,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            message: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(leadStatuses),
            source: faker.helpers.arrayElement(['Facebook', 'Google', 'Direct', 'Referral']),
            createdAt: faker.date.recent({ days: 60 }),
        });
    }

    await prisma.lead.createMany({
        data: leads,
    });
    console.log(`✅ Added ${leads.length} new leads`);

    // 3. Add a secondary branch
    const newBranch = await prisma.branch.create({
        data: {
            name: 'South Extension',
            slug: 'south-ext',
            brandId: brand.id,
            isActive: true,
            address: {
                street: faker.location.streetAddress(),
                city: 'Bangalore',
                state: 'Karnataka',
                country: 'India',
                zipCode: '560001'
            },
            contact: {
                email: 'south@democompany.com',
                phone: '+91-9876543299'
            },
            micrositeConfig: {
                templateId: 'minimal-elegant',
                message: 'Welcome to our Bangalore branch!'
            }
        }
    });
    console.log(`✅ Added new branch: ${newBranch.name}`);

}

main()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
