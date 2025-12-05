// @ts-nocheck
import { MicrositeTemplate, TemplateCategory } from '@/types/template';
import { MicrositeConfig } from '@/types/microsite';

// Template data with industry-specific designs
export const MICROSITE_TEMPLATES: MicrositeTemplate[] = [
  {
    id: 'automotive-classic',
    name: 'Automotive Classic',
    description: 'Professional template for car dealerships and automotive services',
    category: 'automotive',
    previewImage: '/templates/automotive-classic-preview.jpg',
    thumbnailImage: '/templates/automotive-classic-thumb.jpg',
    isPremium: false,
    features: ['Service showcase', 'Contact forms', 'Location map', 'Gallery'],
    defaultConfig: {
      templateId: 'automotive-classic',
      sections: {
        hero: {
          enabled: true,
          title: 'Your Trusted Automotive Partner',
          subtitle: 'Quality service and reliable solutions for all your automotive needs',
          backgroundImage: '/templates/automotive-hero-bg.jpg',
        },
        about: {
          enabled: true,
          content: 'With years of experience in the automotive industry, we provide comprehensive services including sales, maintenance, and repairs. Our certified technicians ensure your vehicle receives the best care.',
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Vehicle Sales',
              description: 'New and pre-owned vehicles with warranty',
              image: '/templates/service-sales.jpg',
            },
            {
              id: '2',
              name: 'Maintenance & Repair',
              description: 'Complete automotive maintenance and repair services',
              image: '/templates/service-repair.jpg',
            },
            {
              id: '3',
              name: 'Parts & Accessories',
              description: 'Genuine parts and quality accessories',
              image: '/templates/service-parts.jpg',
            },
          ],
        },
        gallery: {
          enabled: true,
          images: [
            '/templates/automotive-gallery-1.jpg',
            '/templates/automotive-gallery-2.jpg',
            '/templates/automotive-gallery-3.jpg',
          ],
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'email', 'phone', 'vehicle-interest', 'message'],
          },
        },
      },
      seoSettings: {
        title: 'Professional Automotive Services',
        description: 'Your trusted partner for automotive sales, service, and repairs. Quality guaranteed.',
        keywords: ['automotive', 'car dealer', 'vehicle service', 'auto repair'],
      },
    },
  },
  {
    id: 'retail-modern',
    name: 'Retail Modern',
    description: 'Contemporary design for retail stores and boutiques',
    category: 'retail',
    previewImage: '/templates/retail-modern-preview.jpg',
    thumbnailImage: '/templates/retail-modern-thumb.jpg',
    isPremium: false,
    features: ['Product showcase', 'Store hours', 'Social media integration', 'Contact forms'],
    defaultConfig: {
      templateId: 'retail-modern',
      sections: {
        hero: {
          enabled: true,
          title: 'Discover Amazing Products',
          subtitle: 'Quality merchandise at unbeatable prices',
          backgroundImage: '/templates/retail-hero-bg.jpg',
        },
        about: {
          enabled: true,
          content: 'We are passionate about bringing you the latest trends and highest quality products. Our curated collection ensures you find exactly what you\'re looking for.',
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Fashion & Apparel',
              description: 'Latest fashion trends for all ages',
              image: '/templates/retail-fashion.jpg',
            },
            {
              id: '2',
              name: 'Home & Lifestyle',
              description: 'Beautiful items for your home',
              image: '/templates/retail-home.jpg',
            },
            {
              id: '3',
              name: 'Personal Care',
              description: 'Premium beauty and wellness products',
              image: '/templates/retail-beauty.jpg',
            },
          ],
        },
        gallery: {
          enabled: true,
          images: [
            '/templates/retail-gallery-1.jpg',
            '/templates/retail-gallery-2.jpg',
            '/templates/retail-gallery-3.jpg',
          ],
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'email', 'phone', 'product-interest', 'message'],
          },
        },
      },
      seoSettings: {
        title: 'Premium Retail Store',
        description: 'Discover amazing products and latest trends at our retail store. Quality guaranteed.',
        keywords: ['retail', 'shopping', 'fashion', 'lifestyle', 'products'],
      },
    },
  },
  {
    id: 'healthcare-professional',
    name: 'Healthcare Professional',
    description: 'Clean and trustworthy design for healthcare providers',
    category: 'healthcare',
    previewImage: '/templates/healthcare-professional-preview.jpg',
    thumbnailImage: '/templates/healthcare-professional-thumb.jpg',
    isPremium: true,
    features: ['Appointment booking', 'Service details', 'Doctor profiles', 'Patient forms'],
    defaultConfig: {
      templateId: 'healthcare-professional',
      sections: {
        hero: {
          enabled: true,
          title: 'Compassionate Healthcare Services',
          subtitle: 'Your health and wellness is our priority',
          backgroundImage: '/templates/healthcare-hero-bg.jpg',
        },
        about: {
          enabled: true,
          content: 'We provide comprehensive healthcare services with a focus on patient care and medical excellence. Our experienced team is dedicated to your health and well-being.',
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'General Consultation',
              description: 'Comprehensive health checkups and consultations',
              image: '/templates/healthcare-consultation.jpg',
            },
            {
              id: '2',
              name: 'Specialized Care',
              description: 'Expert care in various medical specialties',
              image: '/templates/healthcare-specialized.jpg',
            },
            {
              id: '3',
              name: 'Preventive Care',
              description: 'Health screenings and preventive treatments',
              image: '/templates/healthcare-preventive.jpg',
            },
          ],
        },
        gallery: {
          enabled: false,
          images: [],
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'email', 'phone', 'appointment-type', 'preferred-date', 'message'],
          },
        },
      },
      seoSettings: {
        title: 'Professional Healthcare Services',
        description: 'Comprehensive healthcare services with experienced medical professionals. Your health is our priority.',
        keywords: ['healthcare', 'medical', 'doctor', 'clinic', 'health services'],
      },
    },
  },
  {
    id: 'real-estate-luxury',
    name: 'Real Estate Luxury',
    description: 'Elegant template for real estate professionals and agencies',
    category: 'real-estate',
    previewImage: '/templates/real-estate-luxury-preview.jpg',
    thumbnailImage: '/templates/real-estate-luxury-thumb.jpg',
    isPremium: true,
    features: ['Property showcase', 'Agent profiles', 'Market insights', 'Contact forms'],
    defaultConfig: {
      templateId: 'real-estate-luxury',
      sections: {
        hero: {
          enabled: true,
          title: 'Find Your Dream Property',
          subtitle: 'Luxury real estate solutions tailored to your needs',
          backgroundImage: '/templates/real-estate-hero-bg.jpg',
        },
        about: {
          enabled: true,
          content: 'With extensive market knowledge and personalized service, we help you find the perfect property or sell your current one at the best price. Your real estate goals are our mission.',
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Property Sales',
              description: 'Expert assistance in buying and selling properties',
              image: '/templates/real-estate-sales.jpg',
            },
            {
              id: '2',
              name: 'Property Management',
              description: 'Comprehensive property management services',
              image: '/templates/real-estate-management.jpg',
            },
            {
              id: '3',
              name: 'Investment Consulting',
              description: 'Strategic real estate investment advice',
              image: '/templates/real-estate-investment.jpg',
            },
          ],
        },
        gallery: {
          enabled: true,
          images: [
            '/templates/real-estate-gallery-1.jpg',
            '/templates/real-estate-gallery-2.jpg',
            '/templates/real-estate-gallery-3.jpg',
          ],
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'email', 'phone', 'property-type', 'budget', 'message'],
          },
        },
      },
      seoSettings: {
        title: 'Luxury Real Estate Services',
        description: 'Find your dream property with our expert real estate services. Luxury homes and investment opportunities.',
        keywords: ['real estate', 'property', 'luxury homes', 'investment', 'buying', 'selling'],
      },
    },
  },
  {
    id: 'consulting-corporate',
    name: 'Consulting Corporate',
    description: 'Professional template for consulting and business services',
    category: 'consulting',
    previewImage: '/templates/consulting-corporate-preview.jpg',
    thumbnailImage: '/templates/consulting-corporate-thumb.jpg',
    isPremium: false,
    features: ['Service portfolio', 'Team profiles', 'Case studies', 'Contact forms'],
    defaultConfig: {
      templateId: 'consulting-corporate',
      sections: {
        hero: {
          enabled: true,
          title: 'Strategic Business Solutions',
          subtitle: 'Expert consulting services to drive your business forward',
          backgroundImage: '/templates/consulting-hero-bg.jpg',
        },
        about: {
          enabled: true,
          content: 'We provide strategic consulting services to help businesses optimize operations, increase efficiency, and achieve sustainable growth. Our experienced consultants deliver tailored solutions.',
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Business Strategy',
              description: 'Strategic planning and business development',
              image: '/templates/consulting-strategy.jpg',
            },
            {
              id: '2',
              name: 'Operations Consulting',
              description: 'Process optimization and operational excellence',
              image: '/templates/consulting-operations.jpg',
            },
            {
              id: '3',
              name: 'Digital Transformation',
              description: 'Technology integration and digital solutions',
              image: '/templates/consulting-digital.jpg',
            },
          ],
        },
        gallery: {
          enabled: false,
          images: [],
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'email', 'phone', 'company', 'consulting-need', 'message'],
          },
        },
      },
      seoSettings: {
        title: 'Professional Business Consulting',
        description: 'Strategic consulting services to optimize your business operations and drive growth.',
        keywords: ['consulting', 'business strategy', 'operations', 'digital transformation'],
      },
    },
  },
  {
    id: 'restaurant-cozy',
    name: 'Restaurant Cozy',
    description: 'Warm and inviting template for restaurants and cafes',
    category: 'restaurant',
    previewImage: '/templates/restaurant-cozy-preview.jpg',
    thumbnailImage: '/templates/restaurant-cozy-thumb.jpg',
    isPremium: false,
    features: ['Menu showcase', 'Reservation system', 'Photo gallery', 'Reviews'],
    defaultConfig: {
      templateId: 'restaurant-cozy',
      sections: {
        hero: {
          enabled: true,
          title: 'Delicious Dining Experience',
          subtitle: 'Fresh ingredients, authentic flavors, memorable moments',
          backgroundImage: '/templates/restaurant-hero-bg.jpg',
        },
        about: {
          enabled: true,
          content: 'We create exceptional dining experiences with fresh, locally-sourced ingredients and authentic recipes passed down through generations. Every dish tells a story.',
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Signature Dishes',
              description: 'Our chef\'s special creations and traditional favorites',
              image: '/templates/restaurant-signature.jpg',
            },
            {
              id: '2',
              name: 'Catering Services',
              description: 'Professional catering for events and celebrations',
              image: '/templates/restaurant-catering.jpg',
            },
            {
              id: '3',
              name: 'Private Dining',
              description: 'Intimate dining experiences for special occasions',
              image: '/templates/restaurant-private.jpg',
            },
          ],
        },
        gallery: {
          enabled: true,
          images: [
            '/templates/restaurant-gallery-1.jpg',
            '/templates/restaurant-gallery-2.jpg',
            '/templates/restaurant-gallery-3.jpg',
          ],
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'email', 'phone', 'party-size', 'preferred-date', 'message'],
          },
        },
      },
      seoSettings: {
        title: 'Authentic Restaurant Experience',
        description: 'Enjoy delicious food and warm hospitality at our restaurant. Fresh ingredients, authentic flavors.',
        keywords: ['restaurant', 'dining', 'food', 'cuisine', 'catering', 'reservations'],
      },
    },
  },
];

export function getTemplateById(id: string): MicrositeTemplate | undefined {
  return MICROSITE_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory): MicrositeTemplate[] {
  return MICROSITE_TEMPLATES.filter(template => template.category === category);
}

export function getFreeTemplates(): MicrositeTemplate[] {
  return MICROSITE_TEMPLATES.filter(template => !template.isPremium);
}

export function getPremiumTemplates(): MicrositeTemplate[] {
  return MICROSITE_TEMPLATES.filter(template => template.isPremium);
}

export function getTemplateCategories(): TemplateCategory[] {
  return Array.from(new Set(MICROSITE_TEMPLATES.map(template => template.category)));
}

export function applyTemplateToConfig(
  templateId: string,
  currentConfig: MicrositeConfig
): MicrositeConfig {
  const template = getTemplateById(templateId);
  if (!template) {
    return currentConfig;
  }

  // Merge template default config with current config, preserving user customizations
  return {
    ...currentConfig,
    templateId,
    sections: {
      hero: {
        ...template.defaultConfig.sections?.hero,
        ...currentConfig.sections.hero,
        enabled: template.defaultConfig.sections?.hero?.enabled ?? currentConfig.sections.hero.enabled,
      },
      about: {
        ...template.defaultConfig.sections?.about,
        ...currentConfig.sections.about,
        enabled: template.defaultConfig.sections?.about?.enabled ?? currentConfig.sections.about.enabled,
      },
      services: {
        ...template.defaultConfig.sections?.services,
        ...currentConfig.sections.services,
        enabled: template.defaultConfig.sections?.services?.enabled ?? currentConfig.sections.services.enabled,
        // Keep existing items unless template provides new ones
        items: currentConfig.sections.services.items.length > 0
          ? currentConfig.sections.services.items
          : template.defaultConfig.sections?.services?.items || [],
      },
      gallery: {
        ...template.defaultConfig.sections?.gallery,
        ...currentConfig.sections.gallery,
        enabled: template.defaultConfig.sections?.gallery?.enabled ?? currentConfig.sections.gallery.enabled,
        // Keep existing images unless template provides new ones
        images: currentConfig.sections.gallery.images.length > 0
          ? currentConfig.sections.gallery.images
          : template.defaultConfig.sections?.gallery?.images || [],
      },
      contact: {
        ...template.defaultConfig.sections?.contact,
        ...currentConfig.sections.contact,
        enabled: template.defaultConfig.sections?.contact?.enabled ?? currentConfig.sections.contact.enabled,
        leadForm: {
          ...template.defaultConfig.sections?.contact?.leadForm,
          ...currentConfig.sections.contact.leadForm,
        },
      },
    },
    seoSettings: {
      ...template.defaultConfig.seoSettings,
      ...currentConfig.seoSettings,
    },
  };
}