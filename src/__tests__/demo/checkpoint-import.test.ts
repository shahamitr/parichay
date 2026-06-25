/**
 * Checkpoint Task 4: Verify all demo modules import correctly
 * and static maps/constants are accessible.
 */
import { describe, it, expect } from 'vitest';
import {
  isDemoBrand,
  getCategoryFromDemoSlug,
  buildDemoSlug,
  buildDemoEmail,
  resolveDemoUrl,
} from '../../lib/demo-utils';
import {
  INDUSTRY_LAYOUT_MAP,
  INDUSTRY_DEMO_NAMES,
  LEAD_STATUSES,
  EVENT_TYPES,
  buildFallbackContent,
} from '../../../prisma/seed-demo';

describe('Checkpoint: demo-utils imports and basic functionality', () => {
  it('isDemoBrand correctly identifies demo brands', () => {
    expect(isDemoBrand('demo-restaurants-cafes')).toBe(true);
    expect(isDemoBrand('my-brand')).toBe(false);
    expect(isDemoBrand('')).toBe(false);
  });

  it('getCategoryFromDemoSlug extracts category', () => {
    expect(getCategoryFromDemoSlug('demo-restaurants-cafes')).toBe('restaurants-cafes');
    expect(getCategoryFromDemoSlug('my-brand')).toBeNull();
  });

  it('buildDemoSlug creates correct slug', () => {
    expect(buildDemoSlug('fitness-wellness')).toBe('demo-fitness-wellness');
  });

  it('buildDemoEmail creates correct email', () => {
    expect(buildDemoEmail('restaurants-cafes')).toBe('restaurants-cafes@demo.parichay.io');
  });

  it('resolveDemoUrl returns correct URL', () => {
    expect(resolveDemoUrl({ slug: 'legal-services' })).toBe('/demo-legal-services/main');
    expect(resolveDemoUrl({ slug: 'legal-services', demoUrl: '/custom-url' })).toBe('/custom-url');
  });
});

describe('Checkpoint: seed-demo.ts exports static maps correctly', () => {
  it('INDUSTRY_LAYOUT_MAP has entries for all 11 categories', () => {
    expect(Object.keys(INDUSTRY_LAYOUT_MAP).length).toBe(11);
    expect(INDUSTRY_LAYOUT_MAP['restaurants-cafes']).toBe('restaurant-hospitality');
    expect(INDUSTRY_LAYOUT_MAP['fitness-wellness']).toBe('fitness-energy');
  });

  it('INDUSTRY_LAYOUT_MAP values are all unique', () => {
    const values = Object.values(INDUSTRY_LAYOUT_MAP);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('INDUSTRY_DEMO_NAMES has entries for all 11 categories', () => {
    expect(Object.keys(INDUSTRY_DEMO_NAMES).length).toBe(11);
    expect(INDUSTRY_DEMO_NAMES['restaurants-cafes'].name).toBe('The Golden Spoon');
    expect(INDUSTRY_DEMO_NAMES['restaurants-cafes'].tagline).toBe('A Culinary Journey Awaits');
  });

  it('all INDUSTRY_DEMO_NAMES have name and tagline', () => {
    for (const [slug, info] of Object.entries(INDUSTRY_DEMO_NAMES)) {
      expect(info.name, `${slug} should have name`).toBeTruthy();
      expect(info.tagline, `${slug} should have tagline`).toBeTruthy();
    }
  });

  it('LEAD_STATUSES contains expected values', () => {
    expect(LEAD_STATUSES).toContain('NEW');
    expect(LEAD_STATUSES).toContain('CONTACTED');
    expect(LEAD_STATUSES).toContain('QUALIFIED');
    expect(LEAD_STATUSES).toContain('CONVERTED');
    expect(LEAD_STATUSES.length).toBe(4);
  });

  it('EVENT_TYPES contains expected values', () => {
    expect(EVENT_TYPES).toContain('PAGE_VIEW');
    expect(EVENT_TYPES).toContain('CLICK');
    expect(EVENT_TYPES).toContain('QR_SCAN');
    expect(EVENT_TYPES).toContain('LEAD_SUBMIT');
    expect(EVENT_TYPES).toContain('VCARD_DOWNLOAD');
    expect(EVENT_TYPES.length).toBe(5);
  });

  it('buildFallbackContent returns valid content structure', () => {
    const content = buildFallbackContent('Test Biz', 'Test Tagline');
    expect(content.templateId).toBe('modern-business');
    expect(content.seoSettings).toBeDefined();
    expect(content.sections).toBeDefined();

    const sections = content.sections as Record<string, unknown>;
    expect(sections.hero).toBeDefined();
    expect(sections.about).toBeDefined();
    expect(sections.services).toBeDefined();
    expect(sections.gallery).toBeDefined();
    expect(sections.team).toBeDefined();
    expect(sections.testimonials).toBeDefined();
    expect(sections.booking).toBeDefined();
    expect(sections.contact).toBeDefined();
  });

  it('buildFallbackContent uses provided business name and tagline', () => {
    const content = buildFallbackContent('My Business', 'Great Tagline');
    const sections = content.sections as Record<string, Record<string, unknown>>;
    expect(sections.hero.title).toBe('My Business');
    expect(sections.hero.subtitle).toBe('Great Tagline');
  });
});
