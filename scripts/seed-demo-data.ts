
import { PrismaClient, UserRole } from '../src/generated/prisma/index.js';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding demo data...');

    // 1. Create or get a demo user
    const demoEmail = 'demo@onetouchbizcard.in';
    let user = await prisma.user.findUnique({
        where: { email: demoEmail },
    });

    if (!user) {
        console.log('Creating demo user...');
        const hashedPassword = await hash('Demo@123', 12);
        user = await prisma.user.create({
            data: {
                email: demoEmail,
                passwordHash: hashedPassword,
                firstName: 'Demo',
                lastName: 'User',
                role: UserRole.BRAND_MANAGER,
                isActive: true,
            },
        });
    } else {
        console.log('Demo user already exists.');
    }

    // 2. Define Demo Brands and Branches
    const demoBrands = [
        {
            name: 'Prime Properties',
            slug: 'prime-properties',
            tagline: 'Your Dream Home Awaits',
            category: 'real-estate-agents',
            colorTheme: { primary: '#0891B2', secondary: '#06B6D4', accent: '#22D3EE' },
            branch: {
                name: 'Downtown Office',
                slug: 'downtown',
                address: { street: '123 Market St', city: 'Metropolis', state: 'NY', zipCode: '10001', country: 'USA' },
                contact: { phone: '+1 555-0101', email: 'contact@primeproperties.com' },
                micrositeConfig: {
                    templateId: 'modern-business',
                    sections: {
                        hero: {
                            enabled: true,
                            title: 'Find Your Perfect Home',
                            subtitle: 'Luxury apartments and homes in the heart of the city.',
                            backgroundType: 'image',
                            backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                        },
                        about: {
                            enabled: true,
                            content: 'Prime Properties is the leading real estate agency in Metropolis, dedicated to helping you find your dream home.',
                        },
                        services: {
                            enabled: true,
                            items: [
                                { title: 'Residential Sales', description: 'Buying and selling homes.' },
                                { title: 'Commercial Leasing', description: 'Office and retail spaces.' },
                                { title: 'Property Management', description: 'Full-service management.' },
                            ],
                        },
                        gallery: {
                            enabled: true,
                            images: [
                                'https://images.unsplash.com/photo-1600596542815-22b5d1534b02?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            ],
                        },
                        contact: { enabled: true, showMap: true },
                    },
                    seoSettings: { title: 'Prime Properties - Real Estate', description: 'Find your dream home with Prime Properties.' },
                },
            },
        },
        {
            name: 'City Health Clinic',
            slug: 'city-health-clinic',
            tagline: 'Caring for Your Health',
            category: 'healthcare-professionals',
            colorTheme: { primary: '#DC2626', secondary: '#EF4444', accent: '#F87171' },
            branch: {
                name: 'Main Clinic',
                slug: 'main',
                address: { street: '456 Health Ave', city: 'Metropolis', state: 'NY', zipCode: '10002', country: 'USA' },
                contact: { phone: '+1 555-0102', email: 'info@cityhealth.com' },
                micrositeConfig: {
                    templateId: 'medical',
                    sections: {
                        hero: {
                            enabled: true,
                            title: 'Compassionate Care',
                            subtitle: 'Top-rated healthcare professionals at your service.',
                            backgroundType: 'color',
                        },
                        about: {
                            enabled: true,
                            content: 'City Health Clinic provides comprehensive medical services with a patient-centered approach.',
                        },
                        services: {
                            enabled: true,
                            items: [
                                { title: 'General Checkups', description: 'Routine health screenings.' },
                                { title: 'Pediatrics', description: 'Care for infants and children.' },
                                { title: 'Cardiology', description: 'Heart health specialists.' },
                            ],
                        },
                        contact: { enabled: true, showMap: true },
                    },
                    seoSettings: { title: 'City Health Clinic', description: 'Expert healthcare services.' },
                },
            },
        },
        {
            name: 'The Gourmet Bistro',
            slug: 'gourmet-bistro',
            tagline: 'Taste the Excellence',
            category: 'restaurants-cafes',
            colorTheme: { primary: '#D97706', secondary: '#F59E0B', accent: '#FBBF24' },
            branch: {
                name: 'Downtown',
                slug: 'downtown',
                address: { street: '789 Culinary Way', city: 'Metropolis', state: 'NY', zipCode: '10003', country: 'USA' },
                contact: { phone: '+1 555-0103', email: 'reservations@gourmetbistro.com' },
                micrositeConfig: {
                    templateId: 'restaurant',
                    sections: {
                        hero: {
                            enabled: true,
                            title: 'Exquisite Dining',
                            subtitle: 'Experience the finest flavors in town.',
                            backgroundType: 'image',
                            backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                        },
                        about: {
                            enabled: true,
                            content: 'A culinary journey featuring locally sourced ingredients and masterfully crafted dishes.',
                        },
                        services: { // Menu Highlights
                            enabled: true,
                            title: 'Menu Highlights',
                            items: [
                                { title: 'Signature Steak', description: 'Grilled to perfection.' },
                                { title: 'Seafood Pasta', description: 'Fresh catch of the day.' },
                                { title: 'Tiramisu', description: 'Classic Italian dessert.' },
                            ],
                        },
                        gallery: {
                            enabled: true,
                            images: [
                                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            ],
                        },
                        contact: { enabled: true, showMap: true },
                    },
                    seoSettings: { title: 'The Gourmet Bistro', description: 'Fine dining experience.' },
                },
            },
        },
        {
            name: 'FitLife Gym',
            slug: 'fitlife-gym',
            tagline: 'Stronger Every Day',
            category: 'fitness-wellness',
            colorTheme: { primary: '#16A34A', secondary: '#22C55E', accent: '#4ADE80' },
            branch: {
                name: 'Main Center',
                slug: 'main',
                address: { street: '321 Fitness Blvd', city: 'Metropolis', state: 'NY', zipCode: '10004', country: 'USA' },
                contact: { phone: '+1 555-0104', email: 'join@fitlife.com' },
                micrositeConfig: {
                    templateId: 'fitness',
                    sections: {
                        hero: {
                            enabled: true,
                            title: 'Achieve Your Goals',
                            subtitle: 'State-of-the-art equipment and expert trainers.',
                            backgroundType: 'image',
                            backgroundImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                        },
                        about: {
                            enabled: true,
                            content: 'FitLife Gym is dedicated to helping you reach your fitness potential with personalized training and group classes.',
                        },
                        services: {
                            enabled: true,
                            items: [
                                { title: 'Personal Training', description: 'One-on-one coaching.' },
                                { title: 'Group Classes', description: 'Yoga, HIIT, and more.' },
                                { title: 'Nutrition Planning', description: 'Customized diet plans.' },
                            ],
                        },
                        contact: { enabled: true, showMap: true },
                    },
                    seoSettings: { title: 'FitLife Gym', description: 'Your partner in fitness.' },
                },
            },
        },
        {
            name: 'Justice Law Firm',
            slug: 'justice-law',
            tagline: 'Defending Your Rights',
            category: 'legal-services',
            colorTheme: { primary: '#4B5563', secondary: '#6B7280', accent: '#9CA3AF' },
            branch: {
                name: 'Headquarters',
                slug: 'hq',
                address: { street: '555 Legal Ln', city: 'Metropolis', state: 'NY', zipCode: '10005', country: 'USA' },
                contact: { phone: '+1 555-0105', email: 'contact@justicelaw.com' },
                micrositeConfig: {
                    templateId: 'legal',
                    sections: {
                        hero: {
                            enabled: true,
                            title: 'Experienced Legal Counsel',
                            subtitle: 'Protecting your interests with integrity and dedication.',
                            backgroundType: 'color',
                        },
                        about: {
                            enabled: true,
                            content: 'Justice Law Firm brings decades of experience in various legal fields to serve our clients effectively.',
                        },
                        services: { // Practice Areas
                            enabled: true,
                            title: 'Practice Areas',
                            items: [
                                { title: 'Corporate Law', description: 'Business formation and contracts.' },
                                { title: 'Family Law', description: 'Divorce and custody.' },
                                { title: 'Criminal Defense', description: 'Protecting your rights.' },
                            ],
                        },
                        contact: { enabled: true, showMap: true },
                    },
                    seoSettings: { title: 'Justice Law Firm', description: 'Professional legal services.' },
                },
            },
        },
    ];

    for (const brandData of demoBrands) {
        // Check if brand exists
        let brand = await prisma.brand.findUnique({
            where: { slug: brandData.slug },
        });

        if (!brand) {
            console.log(`Creating brand: ${brandData.name}`);
            brand = await prisma.brand.create({
                data: {
                    name: brandData.name,
                    slug: brandData.slug,
                    tagline: brandData.tagline,
                    ownerId: user.id,
                    colorTheme: brandData.colorTheme,
                },
            });
        } else {
            console.log(`Brand ${brandData.name} already exists.`);
        }

        // Check if branch exists
        const branchSlug = brandData.branch.slug;
        const existingBranch = await prisma.branch.findUnique({
            where: {
                brandId_slug: {
                    brandId: brand.id,
                    slug: branchSlug,
                },
            },
        });

        if (!existingBranch) {
            console.log(`Creating branch: ${brandData.branch.name} for ${brandData.name}`);
            await prisma.branch.create({
                data: {
                    name: brandData.branch.name,
                    slug: branchSlug,
                    brandId: brand.id,
                    address: brandData.branch.address,
                    contact: brandData.branch.contact,
                    micrositeConfig: brandData.branch.micrositeConfig,
                    isActive: true,
                },
            });
        } else {
            console.log(`Branch ${brandData.branch.name} already exists.`);
        }
    }

    console.log('Demo data seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
