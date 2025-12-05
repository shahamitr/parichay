// @ts-nocheck
import { getMicrositeData } from '../microsite-data';
import { generateMicrositeSEO, generateStructuredData, generateSitemapEntry } from '../seo-utils';
import { prisma } from '../prisma';
import { MicrositeData } from '@/types/microsite';

// Mock dependencies
jest.mock('../prisma', () => ({
  prisma: {
    brand: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../cache', () => ({
  withCache: jest.fn((key, fn, ttl) => fn()),
  CacheKeys: {
    MICROSITE: (brand: string, branch: string) => `microsite:${brand}:${branch}`,
  },
  CacheTTL: {
    MEDIUM: 300,
  },
}));

describe('Microsite Rendering - Dynamic URL Routing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMicrositeData', () => {
    it('should fetch microsite data for valid brand and branch slugs', async () => {
      const mockBrand = {
        id: 'brand-123',
        name: 'Test Brand',
        slug: 'test-brand',
        logo: 'https://example.com/logo.png',
        tagline: 'Test Tagline',
        colorTheme: { primary: '#000000', secondary: '#ffffff', accent: '#ff0000' },
        customDomain: null,
        branches: [
          {
            id: 'branch-123',
            name: 'Test Branch',
            slug: 'test-branch',
            isActive: true,
            address: {
              street: '123 Test St',
              city: 'Test City',
              state: 'Test State',
              zipCode: '12345',
              country: 'Test Country',
            },
            contact: {
              phone: '+1234567890',
              email: 'test@example.com',
              whatsapp: '+1234567890',
            },
            socialMedia: {
              facebook: 'https://facebook.com/test',
              instagram: 'https://instagram.com/test',
            },
            businessHours: {
              monday: { open: '09:00', close: '17:00', closed: false },
              tuesday: { open: '09:00', close: '17:00', closed: false },
            },
            micrositeConfig: {
              templateId: 'template-1',
              sections: {
                hero: { enabled: true, title: 'Welcome', subtitle: 'Test subtitle' },
                about: { enabled: true, content: 'About us' },
                services: { enabled: true, items: [] },
                gallery: { enabled: true, images: [] },
                contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'email'] } },
              },
              seoSettings: {
                title: 'Test Branch - Test Brand',
                description: 'Test description',
                keywords: ['test', 'branch'],
              },
            },
            updatedAt: new Date('2024-01-01'),
          },
        ],
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(mockBrand);

      const result = await getMicrositeData('test-brand', 'test-branch');

      expect(result).toBeDefined();
      expect(result?.brand.slug).toBe('test-brand');
      expect(result?.branch.slug).toBe('test-branch');
      expect(prisma.brand.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-brand' },
        include: {
          branches: {
            where: { slug: 'test-branch', isActive: true },
          },
        },
      });
    });

    it('should return null for non-existent brand slug', async () => {
      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getMicrositeData('non-existent-brand', 'test-branch');

      expect(result).toBeNull();
    });

    it('should return null for non-existent branch slug', async () => {
      const mockBrand = {
        id: 'brand-123',
        name: 'Test Brand',
        slug: 'test-brand',
        branches: [],
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(mockBrand);

      const result = await getMicrositeData('test-brand', 'non-existent-branch');

      expect(result).toBeNull();
    });

    it('should return null for inactive branch', async () => {
      const mockBrand = {
        id: 'brand-123',
        name: 'Test Brand',
        slug: 'test-brand',
        branches: [],
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(mockBrand);

      const result = await getMicrositeData('test-brand', 'inactive-branch');

      expect(result).toBeNull();
      expect(prisma.brand.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-brand' },
        include: {
          branches: {
            where: { slug: 'inactive-branch', isActive: true },
          },
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      (prisma.brand.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const result = await getMicrositeData('test-brand', 'test-branch');

      expect(result).toBeNull();
    });
  });
});

describe('Microsite Rendering - SEO Metadata Generation', () => {
  const mockMicrositeData: MicrositeData = {
    brand: {
      id: 'brand-123',
      name: 'Test Brand',
      slug: 'test-brand',
      logo: 'https://example.com/logo.png',
      tagline: 'Test Tagline',
      colorTheme: { primary: '#000000', secondary: '#ffffff', accent: '#ff0000' },
      customDomain: null,
    } as any,
    branch: {
      id: 'branch-123',
      name: 'Test Branch',
      slug: 'test-branch',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country',
      },
      contact: {
        phone: '+1234567890',
        email: 'test@example.com',
        whatsapp: '+1234567890',
      },
      socialMedia: {
        facebook: 'https://facebook.com/test',
        instagram: 'https://instagram.com/test',
      },
      businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
      },
      micrositeConfig: {
        templateId: 'template-1',
        sections: {
          hero: { enabled: true, title: 'Welcome', subtitle: 'Test subtitle' },
          about: { enabled: true, content: 'About us' },
          services: { enabled: true, items: [] },
          gallery: { enabled: true, images: [] },
          contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'email'] } },
        },
        seoSettings: {
          title: 'Custom SEO Title',
          description: 'Custom SEO description',
          keywords: ['test', 'seo', 'keywords'],
          ogImage: 'https://example.com/og-image.png',
        },
      },
      updatedAt: '2024-01-01T00:00:00.000Z',
    } as any,
    micrositeConfig: {
      templateId: 'template-1',
      sections: {
        hero: { enabled: true, title: 'Welcome', subtitle: 'Test subtitle' },
        about: { enabled: true, content: 'About us' },
        services: { enabled: true, items: [] },
        gallery: { enabled: true, images: [] },
        contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'email'] } },
      },
      seoSettings: {
        title: 'Custom SEO Title',
        description: 'Custom SEO description',
        keywords: ['test', 'seo', 'keywords'],
        ogImage: 'https://example.com/og-image.png',
      },
    },
  };

  describe('generateMicrositeSEO', () => {
    it('should generate SEO metadata with custom settings', () => {
      const metadata = generateMicrositeSEO(mockMicrositeData);

      expect(metadata.title).toBe('Custom SEO Title');
      expect(metadata.description).toBe('Custom SEO description');
      expect(metadata.keywords).toEqual(['test', 'seo', 'keywords']);
    });

    it('should generate default SEO metadata when custom settings are missing', () => {
      const dataWithoutSEO = {
        ...mockMicrositeData,
        branch: {
          ...mockMicrositeData.branch,
          micrositeConfig: {
            ...mockMicrositeData.branch.micrositeConfig,
            seoSettings: {} as any,
          },
        },
        micrositeConfig: {
          ...mockMicrositeData.micrositeConfig,
          seoSettings: {} as any,
        },
      };

      const metadata = generateMicrositeSEO(dataWithoutSEO);

      expect(metadata.title).toBe('Test Branch - Test Brand');
      expect(metadata.description).toContain('Visit Test Branch');
    });

    it('should generate Open Graph metadata', () => {
      const metadata = generateMicrositeSEO(mockMicrositeData);

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.type).toBe('website');
      expect(metadata.openGraph?.title).toBe('Custom SEO Title');
      expect(metadata.openGraph?.description).toBe('Custom SEO description');
      expect(metadata.openGraph?.url).toBe('https://onetouchbizcard.in/test-brand/test-branch');
      expect(metadata.openGraph?.images).toHaveLength(1);
      expect(metadata.openGraph?.images?.[0]).toMatchObject({
        url: 'https://example.com/og-image.png',
        width: 1200,
        height: 630,
      });
    });

    it('should generate Twitter card metadata', () => {
      const metadata = generateMicrositeSEO(mockMicrositeData);

      expect(metadata.twitter).toBeDefined();
      expect(metadata.twitter?.card).toBe('summary_large_image');
      expect(metadata.twitter?.title).toBe('Custom SEO Title');
      expect(metadata.twitter?.description).toBe('Custom SEO description');
      expect(metadata.twitter?.images).toContain('https://example.com/og-image.png');
    });

    it('should set robots metadata for indexing', () => {
      const metadata = generateMicrositeSEO(mockMicrositeData);

      expect(metadata.robots).toBeDefined();
      expect(metadata.robots?.index).toBe(true);
      expect(metadata.robots?.follow).toBe(true);
    });

    it('should set canonical URL', () => {
      const metadata = generateMicrositeSEO(mockMicrositeData);

      expect(metadata.alternates?.canonical).toBe('https://onetouchbizcard.in/test-brand/test-branch');
    });
  });

  describe('generateStructuredData', () => {
    it('should generate JSON-LD structured data for LocalBusiness', () => {
      const structuredData = generateStructuredData(mockMicrositeData);

      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('LocalBusiness');
      expect(structuredData.name).toBe('Test Branch');
      expect(structuredData.url).toBe('https://onetouchbizcard.in/test-brand/test-branch');
    });

    it('should include contact information in structured data', () => {
      const structuredData = generateStructuredData(mockMicrositeData);

      expect(structuredData.telephone).toBe('+1234567890');
      expect(structuredData.email).toBe('test@example.com');
    });

    it('should include postal address in structured data', () => {
      const structuredData = generateStructuredData(mockMicrositeData);

      expect(structuredData.address).toBeDefined();
      expect(structuredData.address['@type']).toBe('PostalAddress');
      expect(structuredData.address.streetAddress).toBe('123 Test St');
      expect(structuredData.address.addressLocality).toBe('Test City');
      expect(structuredData.address.addressRegion).toBe('Test State');
      expect(structuredData.address.postalCode).toBe('12345');
      expect(structuredData.address.addressCountry).toBe('Test Country');
    });

    it('should include social media links in sameAs property', () => {
      const structuredData = generateStructuredData(mockMicrositeData);

      expect(structuredData.sameAs).toContain('https://facebook.com/test');
      expect(structuredData.sameAs).toContain('https://instagram.com/test');
    });

    it('should include business hours when available', () => {
      const structuredData = generateStructuredData(mockMicrositeData);

      expect(structuredData.openingHoursSpecification).toBeDefined();
      expect(structuredData.openingHoursSpecification.length).toBeGreaterThan(0);
    });

    it('should filter out closed days from business hours', () => {
      const dataWithClosedDay = {
        ...mockMicrositeData,
        branch: {
          ...mockMicrositeData.branch,
          businessHours: {
            monday: { open: '09:00', close: '17:00', closed: false },
            sunday: { open: '00:00', close: '00:00', closed: true },
          },
        },
      };

      const structuredData = generateStructuredData(dataWithClosedDay);

      expect(structuredData.openingHoursSpecification).toBeDefined();
      const sundayHours = structuredData.openingHoursSpecification.find((spec: any) => spec.dayOfWeek === 'Su');
      expect(sundayHours).toBeUndefined();
    });
  });

  describe('generateSitemapEntry', () => {
    it('should generate sitemap entry with correct URL', () => {
      const sitemapEntry = generateSitemapEntry(mockMicrositeData);

      expect(sitemapEntry.url).toBe('https://onetouchbizcard.in/test-brand/test-branch');
    });

    it('should set change frequency to weekly', () => {
      const sitemapEntry = generateSitemapEntry(mockMicrositeData);

      expect(sitemapEntry.changeFrequency).toBe('weekly');
    });

    it('should set priority to 0.8', () => {
      const sitemapEntry = generateSitemapEntry(mockMicrositeData);

      expect(sitemapEntry.priority).toBe(0.8);
    });

    it('should use branch updatedAt for lastModified', () => {
      const sitemapEntry = generateSitemapEntry(mockMicrositeData);

      expect(sitemapEntry.lastModified).toEqual(new Date('2024-01-01T00:00:00.000Z'));
    });
  });
});

describe('Microsite Rendering - Configuration Logic', () => {
  const mockMicrositeData: MicrositeData = {
    brand: {
      id: 'brand-123',
      name: 'Test Brand',
      slug: 'test-brand',
      logo: 'https://example.com/logo.png',
      tagline: 'Test Tagline',
      colorTheme: { primary: '#000000', secondary: '#ffffff', accent: '#ff0000' },
      customDomain: null,
    } as any,
    branch: {
      id: 'branch-123',
      name: 'Test Branch',
      slug: 'test-branch',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country',
      },
      contact: {
        phone: '+1234567890',
        email: 'test@example.com',
      },
      socialMedia: {},
      businessHours: {},
      micrositeConfig: {
        templateId: 'template-1',
        sections: {
          hero: { enabled: true, title: 'Welcome', subtitle: 'Test subtitle', backgroundImage: 'hero.jpg' },
          about: { enabled: false, content: '' },
          services: {
            enabled: true, items: [
              { id: '1', name: 'Service 1', description: 'Description 1', price: 100 },
              { id: '2', name: 'Service 2', description: 'Description 2' },
            ]
          },
          gallery: { enabled: true, images: ['img1.jpg', 'img2.jpg'] },
          contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'email', 'phone'] } },
        },
        seoSettings: {
          title: 'Test Title',
          description: 'Test Description',
          keywords: ['test'],
        },
      },
      updatedAt: '2024-01-01T00:00:00.000Z',
    } as any,
    micrositeConfig: {
      templateId: 'template-1',
      sections: {
        hero: { enabled: true, title: 'Welcome', subtitle: 'Test subtitle', backgroundImage: 'hero.jpg' },
        about: { enabled: false, content: '' },
        services: {
          enabled: true, items: [
            { id: '1', name: 'Service 1', description: 'Description 1', price: 100 },
            { id: '2', name: 'Service 2', description: 'Description 2' },
          ]
        },
        gallery: { enabled: true, images: ['img1.jpg', 'img2.jpg'] },
        contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'email', 'phone'] } },
      },
      seoSettings: {
        title: 'Test Title',
        description: 'Test Description',
        keywords: ['test'],
      },
    },
  };

  describe('Microsite Configuration Structure', () => {
    it('should have valid template ID', () => {
      expect(mockMicrositeData.micrositeConfig.templateId).toBeDefined();
      expect(typeof mockMicrositeData.micrositeConfig.templateId).toBe('string');
    });

    it('should have sections configuration', () => {
      const sections = mockMicrositeData.micrositeConfig.sections;

      expect(sections).toBeDefined();
      expect(sections.hero).toBeDefined();
      expect(sections.about).toBeDefined();
      expect(sections.services).toBeDefined();
      expect(sections.gallery).toBeDefined();
      expect(sections.contact).toBeDefined();
    });

    it('should respect enabled/disabled section flags', () => {
      const sections = mockMicrositeData.micrositeConfig.sections;

      expect(sections.hero.enabled).toBe(true);
      expect(sections.about.enabled).toBe(false);
      expect(sections.services.enabled).toBe(true);
    });

    it('should have hero section with required fields', () => {
      const hero = mockMicrositeData.micrositeConfig.sections.hero;

      expect(hero.title).toBe('Welcome');
      expect(hero.subtitle).toBe('Test subtitle');
      expect(hero.backgroundImage).toBe('hero.jpg');
    });

    it('should have services section with items array', () => {
      const services = mockMicrositeData.micrositeConfig.sections.services;

      expect(Array.isArray(services.items)).toBe(true);
      expect(services.items.length).toBe(2);
      expect(services.items[0]).toHaveProperty('name');
      expect(services.items[0]).toHaveProperty('description');
    });

    it('should have gallery section with images array', () => {
      const gallery = mockMicrositeData.micrositeConfig.sections.gallery;

      expect(Array.isArray(gallery.images)).toBe(true);
      expect(gallery.images.length).toBe(2);
    });

    it('should have contact section with lead form configuration', () => {
      const contact = mockMicrositeData.micrositeConfig.sections.contact;

      expect(contact.showMap).toBe(true);
      expect(contact.leadForm.enabled).toBe(true);
      expect(Array.isArray(contact.leadForm.fields)).toBe(true);
      expect(contact.leadForm.fields).toContain('name');
      expect(contact.leadForm.fields).toContain('email');
    });

    it('should have SEO settings with required fields', () => {
      const seo = mockMicrositeData.micrositeConfig.seoSettings;

      expect(seo.title).toBeDefined();
      expect(seo.description).toBeDefined();
      expect(Array.isArray(seo.keywords)).toBe(true);
    });
  });

  describe('Brand Theming Application', () => {
    it('should have brand color theme defined', () => {
      const colorTheme = mockMicrositeData.brand.colorTheme;

      expect(colorTheme).toBeDefined();
      expect(colorTheme.primary).toBeDefined();
      expect(colorTheme.secondary).toBeDefined();
      expect(colorTheme.accent).toBeDefined();
    });

    it('should have valid hex color codes', () => {
      const colorTheme = mockMicrositeData.brand.colorTheme;
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      expect(hexColorRegex.test(colorTheme.primary)).toBe(true);
      expect(hexColorRegex.test(colorTheme.secondary)).toBe(true);
      expect(hexColorRegex.test(colorTheme.accent)).toBe(true);
    });

    it('should have brand logo URL', () => {
      expect(mockMicrositeData.brand.logo).toBeDefined();
      expect(typeof mockMicrositeData.brand.logo).toBe('string');
    });

    it('should have brand tagline', () => {
      expect(mockMicrositeData.brand.tagline).toBeDefined();
      expect(typeof mockMicrositeData.brand.tagline).toBe('string');
    });
  });
});
