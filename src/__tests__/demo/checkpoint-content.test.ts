/**
 * Checkpoint Task 4: Verify prisma/demo-content.ts generateMicrositeContent
 * works correctly for all industry categories.
 *
 * Uses dynamic import to avoid the heavy Prisma type chain at module resolution time.
 */
import { describe, it, expect } from 'vitest';

describe('Checkpoint: demo-content.ts generateMicrositeContent', () => {
  it('can be imported without errors', async () => {
    const mod = await import('../../../prisma/demo-content');
    expect(mod.generateMicrositeContent).toBeDefined();
    expect(typeof mod.generateMicrositeContent).toBe('function');
  });

  it('generates content for a template-backed category (restaurants-cafes)', async () => {
    const { generateMicrositeContent } = await import('../../../prisma/demo-content');
    const content = generateMicrositeContent('restaurants-cafes', 'The Golden Spoon', 'A Culinary Journey');
    expect(content).toBeDefined();
    expect(typeof content).toBe('object');

    const sections = (content as Record<string, unknown>).sections as Record<string, unknown>;
    expect(sections).toBeDefined();

    const hero = sections.hero as Record<string, unknown>;
    expect(hero.title).toBe('The Golden Spoon');
    expect(hero.subtitle).toBe('A Culinary Journey');
    expect(hero.enabled).toBe(true);
  });

  it('generates content for a placeholder-backed category (legal-services)', async () => {
    const { generateMicrositeContent } = await import('../../../prisma/demo-content');
    const content = generateMicrositeContent('legal-services', 'Sterling Law', 'Justice With Integrity');
    expect(content).toBeDefined();

    const sections = (content as Record<string, unknown>).sections as Record<string, unknown>;
    expect(sections).toBeDefined();

    const hero = sections.hero as Record<string, unknown>;
    expect(hero.title).toBe('Sterling Law');
    expect(hero.subtitle).toBe('Justice With Integrity');
  });

  it('all 8 sections are enabled in generated content', async () => {
    const { generateMicrositeContent } = await import('../../../prisma/demo-content');
    const content = generateMicrositeContent('business-owners', 'Pinnacle Enterprises', 'Building Success Together');
    const sections = (content as Record<string, unknown>).sections as Record<string, Record<string, unknown>>;

    const requiredSections = ['hero', 'about', 'services', 'gallery', 'team', 'testimonials', 'booking', 'contact'];
    for (const section of requiredSections) {
      expect(sections[section], `section "${section}" should exist`).toBeDefined();
      expect(sections[section].enabled, `section "${section}" should be enabled`).toBe(true);
    }
  });

  it('meets minimum content thresholds', async () => {
    const { generateMicrositeContent } = await import('../../../prisma/demo-content');
    const content = generateMicrositeContent('event-planners', 'Stellar Events', 'Creating Moments');
    const sections = (content as Record<string, unknown>).sections as Record<string, Record<string, unknown>>;

    // Services ≥ 3
    const serviceItems = (sections.services.items as unknown[]);
    expect(serviceItems.length).toBeGreaterThanOrEqual(3);

    // Gallery ≥ 4
    const galleryImages = (sections.gallery.images as unknown[]);
    expect(galleryImages.length).toBeGreaterThanOrEqual(4);

    // Team ≥ 2
    const teamMembers = (sections.team.members as unknown[]);
    expect(teamMembers.length).toBeGreaterThanOrEqual(2);

    // Testimonials ≥ 2
    const testimonialItems = (sections.testimonials.items as unknown[]);
    expect(testimonialItems.length).toBeGreaterThanOrEqual(2);
  });
});
