/**
 * Property-based tests for demo utility functions.
 * Uses fast-check to verify universal properties across generated inputs.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  isDemoBrand,
  buildDemoSlug,
  buildDemoEmail,
  getCategoryFromDemoSlug,
  resolveDemoUrl,
} from '@/lib/demo-utils';

// Feature: industry-demo-samples, Property 1: Demo slug generation
describe('Property 1: Demo slug generation', () => {
  /**
   * **Validates: Requirements 1.2, 4.4**
   *
   * For any valid category slug, buildDemoSlug(slug) equals "demo-" + slug
   * and isDemoBrand(buildDemoSlug(slug)) returns true.
   */
  it('buildDemoSlug produces "demo-" + slug and isDemoBrand recognizes it', () => {
    // Generate non-empty strings that don't start with "demo-" to act as category slugs
    const categorySlugArb = fc.stringMatching(/^[a-z][a-z0-9-]*$/).filter(
      (s) => s.length > 0 && !s.startsWith('demo-')
    );

    fc.assert(
      fc.property(categorySlugArb, (slug) => {
        const demoSlug = buildDemoSlug(slug);

        // buildDemoSlug equals "demo-" + slug
        expect(demoSlug).toBe(`demo-${slug}`);

        // isDemoBrand recognizes the generated slug
        expect(isDemoBrand(demoSlug)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: industry-demo-samples, Property 2: Demo email generation
describe('Property 2: Demo email generation', () => {
  /**
   * **Validates: Requirements 1.3**
   *
   * For any valid category slug, buildDemoEmail(slug) equals slug + "@demo.parichay.io",
   * contains exactly one `@`, and has a non-empty local part.
   */
  it('buildDemoEmail produces slug + "@demo.parichay.io" with exactly one @ and non-empty local part', () => {
    const categorySlugArb = fc.stringMatching(/^[a-z][a-z0-9-]*$/).filter(
      (s) => s.length > 0 && !s.startsWith('demo-')
    );

    fc.assert(
      fc.property(categorySlugArb, (slug) => {
        const email = buildDemoEmail(slug);

        // buildDemoEmail equals slug + "@demo.parichay.io"
        expect(email).toBe(`${slug}@demo.parichay.io`);

        // Contains exactly one "@"
        const atCount = email.split('@').length - 1;
        expect(atCount).toBe(1);

        // Non-empty local part (part before @)
        const localPart = email.split('@')[0];
        expect(localPart.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: industry-demo-samples, Property 4: Demo brand detection
describe('Property 4: Demo brand detection', () => {
  /**
   * **Validates: Requirements 4.4, 7.1**
   *
   * For any string, isDemoBrand(s) returns true iff s starts with "demo-".
   * For any non-demo slug, getCategoryFromDemoSlug returns null.
   * For any demo slug "demo-X", getCategoryFromDemoSlug returns "X".
   */
  it('isDemoBrand returns true iff string starts with "demo-"', () => {
    // Generate arbitrary strings (some will start with "demo-", some won't)
    const arbitraryString = fc.string({ minLength: 0, maxLength: 50 });

    fc.assert(
      fc.property(arbitraryString, (s) => {
        const result = isDemoBrand(s);
        const startsWithDemo = s.startsWith('demo-');

        expect(result).toBe(startsWithDemo);
      }),
      { numRuns: 100 }
    );
  });

  it('isDemoBrand returns true for strings with "demo-" prefix', () => {
    // Generate strings that definitely start with "demo-"
    const demoPrefixed = fc.string({ minLength: 1, maxLength: 40 }).map(
      (s) => `demo-${s}`
    );

    fc.assert(
      fc.property(demoPrefixed, (s) => {
        expect(isDemoBrand(s)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('isDemoBrand returns false for strings without "demo-" prefix', () => {
    // Generate strings that don't start with "demo-"
    const nonDemo = fc.string({ minLength: 1, maxLength: 40 }).filter(
      (s) => !s.startsWith('demo-')
    );

    fc.assert(
      fc.property(nonDemo, (s) => {
        expect(isDemoBrand(s)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('getCategoryFromDemoSlug("demo-X") returns "X" for any X', () => {
    const categoryPart = fc.string({ minLength: 1, maxLength: 40 });

    fc.assert(
      fc.property(categoryPart, (x) => {
        const demoSlug = `demo-${x}`;
        const result = getCategoryFromDemoSlug(demoSlug);

        expect(result).toBe(x);
      }),
      { numRuns: 100 }
    );
  });

  it('getCategoryFromDemoSlug returns null for non-demo slugs', () => {
    const nonDemoSlug = fc.string({ minLength: 1, maxLength: 40 }).filter(
      (s) => !s.startsWith('demo-')
    );

    fc.assert(
      fc.property(nonDemoSlug, (s) => {
        const result = getCategoryFromDemoSlug(s);

        expect(result).toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: industry-demo-samples, Property 6: Demo URL resolution
describe('Property 6: Demo URL resolution', () => {
  /**
   * **Validates: Requirements 5.2, 5.3**
   *
   * If demoUrl is defined and non-empty, resolveDemoUrl returns it unchanged.
   * If demoUrl is undefined or empty, returns `/demo-{slug}/main`.
   */
  it('returns demoUrl unchanged when defined and non-empty', () => {
    const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]*$/).filter(
      (s) => s.length > 0
    );
    const demoUrlArb = fc.string({ minLength: 1, maxLength: 100 }).filter(
      (s) => s.length > 0
    );

    fc.assert(
      fc.property(slugArb, demoUrlArb, (slug, demoUrl) => {
        const category = { slug, demoUrl };
        const result = resolveDemoUrl(category);

        expect(result).toBe(demoUrl);
      }),
      { numRuns: 100 }
    );
  });

  it('returns /demo-{slug}/main when demoUrl is undefined', () => {
    const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]*$/).filter(
      (s) => s.length > 0
    );

    fc.assert(
      fc.property(slugArb, (slug) => {
        const category = { slug };
        const result = resolveDemoUrl(category);

        expect(result).toBe(`/demo-${slug}/main`);
      }),
      { numRuns: 100 }
    );
  });

  it('returns /demo-{slug}/main when demoUrl is empty string', () => {
    const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]*$/).filter(
      (s) => s.length > 0
    );

    fc.assert(
      fc.property(slugArb, (slug) => {
        const category = { slug, demoUrl: '' };
        const result = resolveDemoUrl(category);

        expect(result).toBe(`/demo-${slug}/main`);
      }),
      { numRuns: 100 }
    );
  });
});
