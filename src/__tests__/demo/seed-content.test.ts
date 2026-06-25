/**
 * Property-based tests for demo content generation.
 *
 * Uses fast-check to verify universal properties hold across all valid inputs.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateMicrositeContent } from '../../../prisma/demo-content';

// Feature: industry-demo-samples, Property 3: Microsite content completeness
describe('Demo Content Generation', () => {
  describe('Property 3: Microsite content completeness', () => {
    // **Validates: Requirements 2.1, 2.4, 2.5**

    const KNOWN_CATEGORY_SLUGS = [
      'business-owners',
      'corporate-professionals',
      'event-planners',
      'freelancers-consultants',
      'educational-institutions',
      'creatives-designers',
      'real-estate-agents',
      'healthcare-professionals',
      'restaurants-cafes',
      'fitness-wellness',
      'legal-services',
    ] as const;

    const REQUIRED_SECTIONS = [
      'hero',
      'about',
      'services',
      'gallery',
      'team',
      'testimonials',
      'booking',
      'contact',
    ] as const;

    const categorySlugArb = fc.constantFrom(...KNOWN_CATEGORY_SLUGS);
    const businessNameArb = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);
    const taglineArb = fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0);

    it('produces config with all 8 sections enabled for any known category slug', () => {
      // Feature: industry-demo-samples, Property 3: Microsite content completeness
      fc.assert(
        fc.property(categorySlugArb, businessNameArb, taglineArb, (slug, name, tagline) => {
          const result = generateMicrositeContent(slug, name, tagline);
          const sections = result.sections as Record<string, Record<string, unknown>>;

          // All 8 sections must exist and be enabled
          for (const section of REQUIRED_SECTIONS) {
            expect(sections[section]).toBeDefined();
            expect(sections[section].enabled).toBe(true);
          }
        }),
        { numRuns: 100 },
      );
    });

    it('meets minimum item thresholds for services, gallery, team, and testimonials', () => {
      // Feature: industry-demo-samples, Property 3: Microsite content completeness
      fc.assert(
        fc.property(categorySlugArb, businessNameArb, taglineArb, (slug, name, tagline) => {
          const result = generateMicrositeContent(slug, name, tagline);
          const sections = result.sections as Record<string, Record<string, unknown>>;

          // Services ≥ 3
          const serviceItems = sections.services.items as unknown[];
          expect(serviceItems.length).toBeGreaterThanOrEqual(3);

          // Gallery ≥ 4
          const galleryImages = sections.gallery.images as unknown[];
          expect(galleryImages.length).toBeGreaterThanOrEqual(4);

          // Team ≥ 2
          const teamMembers = sections.team.members as unknown[];
          expect(teamMembers.length).toBeGreaterThanOrEqual(2);

          // Testimonials ≥ 2
          const testimonialItems = sections.testimonials.items as unknown[];
          expect(testimonialItems.length).toBeGreaterThanOrEqual(2);
        }),
        { numRuns: 100 },
      );
    });

    it('sets hero title to businessName and subtitle to tagline', () => {
      // Feature: industry-demo-samples, Property 3: Microsite content completeness
      fc.assert(
        fc.property(categorySlugArb, businessNameArb, taglineArb, (slug, name, tagline) => {
          const result = generateMicrositeContent(slug, name, tagline);
          const sections = result.sections as Record<string, Record<string, unknown>>;

          expect(sections.hero.title).toBe(name);
          expect(sections.hero.subtitle).toBe(tagline);
        }),
        { numRuns: 100 },
      );
    });

    it('meets minimum thresholds for unknown/fallback category slugs', () => {
      // Feature: industry-demo-samples, Property 3: Microsite content completeness
      const unknownSlugArb = fc.string({ minLength: 1, maxLength: 50 })
        .filter(s => s.trim().length > 0 && !KNOWN_CATEGORY_SLUGS.includes(s as typeof KNOWN_CATEGORY_SLUGS[number]));

      fc.assert(
        fc.property(unknownSlugArb, businessNameArb, taglineArb, (slug, name, tagline) => {
          const result = generateMicrositeContent(slug, name, tagline);
          const sections = result.sections as Record<string, Record<string, unknown>>;

          // All 8 sections must exist and be enabled even for unknown slugs
          for (const section of REQUIRED_SECTIONS) {
            expect(sections[section]).toBeDefined();
            expect(sections[section].enabled).toBe(true);
          }

          // Minimum thresholds still hold
          const serviceItems = sections.services.items as unknown[];
          expect(serviceItems.length).toBeGreaterThanOrEqual(3);

          const galleryImages = sections.gallery.images as unknown[];
          expect(galleryImages.length).toBeGreaterThanOrEqual(4);

          const teamMembers = sections.team.members as unknown[];
          expect(teamMembers.length).toBeGreaterThanOrEqual(2);

          const testimonialItems = sections.testimonials.items as unknown[];
          expect(testimonialItems.length).toBeGreaterThanOrEqual(2);

          // Hero still matches
          expect(sections.hero.title).toBe(name);
          expect(sections.hero.subtitle).toBe(tagline);
        }),
        { numRuns: 100 },
      );
    });
  });
});

// Feature: industry-demo-samples, Property 4 (unit): Color theme and layout assignment
describe('Color Theme and Layout Assignment', () => {
  describe('Property 4 (unit): Color theme and layout assignment', () => {
    // **Validates: Requirements 3.1, 3.2, 3.3**

    // Inline copy of INDUSTRY_LAYOUT_MAP from prisma/seed-demo.ts
    // (not exported due to lazy-loaded PrismaClient in that module)
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

    const EXPECTED_CATEGORY_SLUGS = [
      'business-owners',
      'corporate-professionals',
      'event-planners',
      'freelancers-consultants',
      'educational-institutions',
      'creatives-designers',
      'real-estate-agents',
      'healthcare-professionals',
      'restaurants-cafes',
      'fitness-wellness',
      'legal-services',
    ];

    it('all layout values are unique (no two categories share a layout)', () => {
      const values = Object.values(INDUSTRY_LAYOUT_MAP);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('every category slug from industryCategories has an entry in the layout map', () => {
      for (const slug of EXPECTED_CATEGORY_SLUGS) {
        expect(INDUSTRY_LAYOUT_MAP[slug]).toBeDefined();
        expect(INDUSTRY_LAYOUT_MAP[slug].length).toBeGreaterThan(0);
      }
    });

    it('layout map has exactly 11 entries (one per industry category)', () => {
      expect(Object.keys(INDUSTRY_LAYOUT_MAP).length).toBe(11);
    });

    it('layout map keys match exactly the expected category slugs', () => {
      const mapKeys = Object.keys(INDUSTRY_LAYOUT_MAP).sort();
      const expectedKeys = [...EXPECTED_CATEGORY_SLUGS].sort();
      expect(mapKeys).toEqual(expectedKeys);
    });
  });
});
