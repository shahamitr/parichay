import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function seedAdvancedFeatures() {
  console.log('🌱 Seeding advanced features...');

  try {
    // Get existing brands and branches
    const brands = await prisma.brand.findMany({
      include: {
        branches: true,
      },
    });

    if (brands.length === 0) {
      console.log('No brands found. Please run the main seed script first.');
      return;
    }

    for (const brand of brands) {
      console.log(`Updating brand: ${brand.name}`);

      for (const branch of brand.branches) {
        console.log(`  Updating branch: ${branch.name}`);

        // Get current microsite config
        const currentConfig = (branch.micrositeConfig as any) || {
          templateId: 'modern-business',
          sections: {},
          seoSettings: {
            title: branch.name,
            description: `${branch.name} - Professional services`,
            keywords: [],
          },
        };

        // Add new advanced features to the config
        const updatedConfig = {
          ...currentConfig,
          sections: {
            ...currentConfig.sections,
            // Local SEO Configuration
            localSEO: {
              enabled: true,
              businessName: branch.name,
              address: branch.address || {
                street: '123 Business Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                zipCode: '400001',
                country: 'India',
              },
              coordinates: {
                lat: 19.0760 + (Math.random() - 0.5) * 0.1, // Random coordinates around Mumbai
                lng: 72.8777 + (Math.random() - 0.5) * 0.1,
              },
              businessType: getRandomBusinessType(),
              keywords: getRandomKeywords(branch.name),
              mapProvider: 'openstreetmap',
              showMap: true,
              schema: {
                enabled: true,
                businessType: 'LocalBusiness',
                priceRange: '$$',
                paymentAccepted: ['Cash', 'Card', 'UPI', 'Net Banking'],
              },
            },
            // Messaging Configuration
            messaging: {
              enabled: true,
              channels: {
                whatsapp: {
                  enabled: true,
                  number: '+91 ' + generateRandomPhone(),
                  welcomeMessage: `Hi! Welcome to ${branch.name}. How can we help you today?`,
                  businessHours: true,
                },
                email: {
                  enabled: true,
                  address: `contact@${branch.name.toLowerCase().replace(/\s+/g, '')}.com`,
                  autoReply: true,
                  autoReplyMessage: `Thank you for contacting ${branch.name}. We will get back to you within 24 hours.`,
                },
                phone: {
                  enabled: true,
                  number: '+91 ' + generateRandomPhone(),
                  displayFormat: 'button',
                },
                livechat: {
                  enabled: true,
                  welcomeMessage: `Welcome to ${branch.name}! How can we assist you?`,
                  offlineMessage: 'We are currently offline. Please leave a message and we will get back to you.',
                  position: 'bottom-right',
                },
              },
              businessHours: {
                enabled: true,
                timezone: 'Asia/Kolkata',
                schedule: {
                  monday: { open: '09:00', close: '18:00', closed: false },
                  tuesday: { open: '09:00', close: '18:00', closed: false },
                  wednesday: { open: '09:00', close: '18:00', closed: false },
                  thursday: { open: '09:00', close: '18:00', closed: false },
                  friday: { open: '09:00', close: '18:00', closed: false },
                  saturday: { open: '09:00', close: '17:00', closed: false },
                  sunday: { open: '10:00', close: '16:00', closed: false },
                },
              },
              autoResponses: {
                enabled: true,
                responses: [
                  {
                    trigger: 'pricing',
                    response: 'Please check our services section for pricing details, or contact us for a custom quote.',
                    active: true,
                  },
                  {
                    trigger: 'hours',
                    response: 'We are open Monday to Saturday 9 AM to 6 PM, and Sunday 10 AM to 4 PM.',
                    active: true,
                  },
                  {
                    trigger: 'location',
                    response: 'You can find our address and directions in the contact section below.',
                    active: true,
                  },
                  {
                    trigger: 'appointment',
                    response: 'You can book an appointment through our booking system or call us directly.',
                    active: true,
                  },
                ],
              },
            },
            // Review Response Configuration
            reviewResponse: {
              enabled: true,
              autoResponse: {
                enabled: true,
                positiveTemplate: `Thank you so much for your wonderful review! We truly appreciate your feedback and are delighted that you had a great experience with ${branch.name}.`,
                negativeTemplate: `Thank you for your feedback. We take all reviews seriously and would love to discuss this further. Please contact us directly at ${branch.contact?.email || 'contact@example.com'} so we can make things right.`,
                neutralTemplate: `Thank you for taking the time to review ${branch.name}. Your feedback helps us improve our services.`,
              },
              reviewSources: {
                google: { enabled: true, businessId: '' },
                facebook: { enabled: false, pageId: '' },
                yelp: { enabled: false, businessId: '' },
                justdial: { enabled: true, businessId: '' },
                internal: { enabled: true },
              },
              responseTemplates: [
                {
                  id: '1',
                  name: 'Positive - Grateful',
                  template: `We're thrilled to hear about your positive experience with ${branch.name}! Thank you for choosing us.`,
                  category: 'positive',
                  active: true,
                },
                {
                  id: '2',
                  name: 'Negative - Solution-focused',
                  template: `We sincerely apologize for not meeting your expectations. Please contact us directly so we can resolve this issue and improve your experience.`,
                  category: 'negative',
                  active: true,
                },
                {
                  id: '3',
                  name: 'Neutral - Appreciative',
                  template: `Thank you for your honest feedback about ${branch.name}. We value all input from our customers and continuously work to improve.`,
                  category: 'neutral',
                  active: true,
                },
              ],
              notifications: {
                enabled: true,
                email: true,
                whatsapp: false,
                threshold: 3,
              },
              publicDisplay: {
                enabled: true,
                showResponses: true,
                moderateBeforePublish: false,
              },
            },
          },
          // Update section order to include new sections
          sectionOrder: [
            { id: 'hero', enabled: true },
            { id: 'about', enabled: true },
            { id: 'services', enabled: true },
            { id: 'gallery', enabled: false },
            { id: 'videos', enabled: false },
            { id: 'impact', enabled: false },
            { id: 'testimonials', enabled: false },
            { id: 'trustIndicators', enabled: false },
            { id: 'portfolio', enabled: false },
            { id: 'aboutFounder', enabled: false },
            { id: 'offers', enabled: false },
            { id: 'cta', enabled: false },
            { id: 'contact', enabled: true },
            { id: 'booking', enabled: false },
            { id: 'payment', enabled: false },
            { id: 'faq', enabled: false },
            { id: 'team', enabled: false },
            { id: 'businessHours', enabled: false },
            { id: 'feedback', enabled: false },
            { id: 'videoTestimonials', enabled: false },
            { id: 'voiceIntro', enabled: false },
            { id: 'whatsappCatalogue', enabled: false },
            { id: 'socialProofBadges', enabled: false },
            { id: 'localSEO', enabled: true },
            { id: 'messaging', enabled: true },
            { id: 'reviewResponse', enabled: true },
          ],
        };

        // Update the branch with new config
        await prisma.branch.update({
          where: { id: branch.id },
          data: {
            micrositeConfig: updatedConfig,
          },
        });

        console.log(`    ✅ Updated ${branch.name} with advanced features`);
      }
    }

    console.log('🎉 Advanced features seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding advanced features:', error);
    throw error;
  }
}

function getRandomBusinessType(): string {
  const types = [
    'restaurant',
    'retail',
    'service',
    'healthcare',
    'automotive',
    'beauty',
    'fitness',
    'education',
    'real-estate',
    'professional',
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomKeywords(businessName: string): string[] {
  const baseKeywords = [
    'professional services',
    'quality service',
    'customer satisfaction',
    'expert team',
    'reliable',
    'trusted',
  ];

  const businessSpecific = [
    `${businessName} services`,
    `best ${businessName.toLowerCase()}`,
    `${businessName.toLowerCase()} near me`,
    `professional ${businessName.toLowerCase()}`,
  ];

  return [...baseKeywords.slice(0, 3), ...businessSpecific.slice(0, 3)];
}

function generateRandomPhone(): string {
  const prefixes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 90000000) + 10000000; // 8-digit number
  return `${prefix}${number}`;
}

// Run the seed function
seedAdvancedFeatures()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });