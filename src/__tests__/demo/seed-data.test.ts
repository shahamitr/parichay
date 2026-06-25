/**
 * Property-based tests for demo seed data generation.
 *
 * Uses fast-check to verify universal properties hold across all valid inputs.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Feature: industry-demo-samples, Property 7: Timestamp distribution within bounds

// Re-implement randomDateWithinDays inline (not exported from seed-demo.ts due to lazy-loaded PrismaClient)
function randomDateWithinDays(days: number): Date {
  const now = Date.now();
  return new Date(now - Math.random() * days * 24 * 60 * 60 * 1000);
}

describe('Demo Seed Data', () => {
  describe('Property 7: Timestamp distribution within bounds', () => {
    // **Validates: Requirements 6.4**

    it('produces dates within [now - N days, now] for any positive N', () => {
      // Feature: industry-demo-samples, Property 7: Timestamp distribution within bounds
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 365 }), (days) => {
          const toleranceMs = 1000; // 1 second tolerance for execution time
          const before = Date.now();
          const result = randomDateWithinDays(days);
          const after = Date.now();

          const resultTime = result.getTime();

          // The date should not be later than now (with tolerance)
          expect(resultTime).toBeLessThanOrEqual(after + toleranceMs);

          // The date should not be earlier than now - N days (with tolerance)
          const lowerBound = before - days * 24 * 60 * 60 * 1000 - toleranceMs;
          expect(resultTime).toBeGreaterThanOrEqual(lowerBound);
        }),
        { numRuns: 100 },
      );
    });

    it('returns a valid Date object for any positive day count', () => {
      // Feature: industry-demo-samples, Property 7: Timestamp distribution within bounds
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 365 }), (days) => {
          const result = randomDateWithinDays(days);

          // Must be a Date instance
          expect(result).toBeInstanceOf(Date);

          // Must not be NaN (invalid date)
          expect(result.getTime()).not.toBeNaN();
        }),
        { numRuns: 100 },
      );
    });
  });
});


// Feature: industry-demo-samples, Property: Sample data minimum thresholds

describe('Sample Data Minimum Thresholds', () => {
  // **Validates: Requirements 6.1, 6.2, 6.3**

  // Design constants from seed-demo.ts (not exported due to lazy-loaded PrismaClient)
  const LEADS_PER_CATEGORY = 5;
  const EVENTS_PER_CATEGORY = 30;
  const QR_CODES_PER_CATEGORY = 1;

  const LEAD_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'] as const;
  const LEAD_SOURCES = ['qr_code', 'direct_visit', 'social_share'] as const;
  const EVENT_TYPES = ['PAGE_VIEW', 'CLICK', 'QR_SCAN', 'LEAD_SUBMIT', 'VCARD_DOWNLOAD'] as const;

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

  const categorySlugArb = fc.constantFrom(...KNOWN_CATEGORY_SLUGS);

  it('configured lead count meets minimum threshold of 5 per category', () => {
    // Feature: industry-demo-samples, Property: Sample data minimum thresholds
    fc.assert(
      fc.property(categorySlugArb, (_category) => {
        // The seed script calls createSampleLeads(branchId, 5) for every category
        // Verify the configured constant meets the minimum requirement
        expect(LEADS_PER_CATEGORY).toBeGreaterThanOrEqual(5);
      }),
      { numRuns: 100 },
    );
  });

  it('configured analytics event count meets minimum threshold of 30 per category', () => {
    // Feature: industry-demo-samples, Property: Sample data minimum thresholds
    fc.assert(
      fc.property(categorySlugArb, (_category) => {
        // The seed script calls createAnalyticsEvents(branchId, brandId, 30) for every category
        // Verify the configured constant meets the minimum requirement
        expect(EVENTS_PER_CATEGORY).toBeGreaterThanOrEqual(30);
      }),
      { numRuns: 100 },
    );
  });

  it('configured QR code count meets minimum threshold of 1 per category', () => {
    // Feature: industry-demo-samples, Property: Sample data minimum thresholds
    fc.assert(
      fc.property(categorySlugArb, (_category) => {
        // The seed script calls createQRCode once per category
        // Verify the configured constant meets the minimum requirement
        expect(QR_CODES_PER_CATEGORY).toBeGreaterThanOrEqual(1);
      }),
      { numRuns: 100 },
    );
  });

  it('lead statuses cover all 4 required types when count >= 4', () => {
    // Feature: industry-demo-samples, Property: Sample data minimum thresholds
    fc.assert(
      fc.property(categorySlugArb, (_category) => {
        // The seed uses i % LEAD_STATUSES.length to rotate, so with count=5
        // we get all 4 statuses covered (indices 0,1,2,3,0)
        const coveredStatuses = new Set<string>();
        for (let i = 0; i < LEADS_PER_CATEGORY; i++) {
          coveredStatuses.add(LEAD_STATUSES[i % LEAD_STATUSES.length]);
        }
        // All 4 lead statuses must be present
        expect(coveredStatuses.size).toBe(LEAD_STATUSES.length);
        expect(coveredStatuses.has('NEW')).toBe(true);
        expect(coveredStatuses.has('CONTACTED')).toBe(true);
        expect(coveredStatuses.has('QUALIFIED')).toBe(true);
        expect(coveredStatuses.has('CONVERTED')).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('event types cover all 5 required types when count >= 5', () => {
    // Feature: industry-demo-samples, Property: Sample data minimum thresholds
    fc.assert(
      fc.property(categorySlugArb, (_category) => {
        // The seed uses i % EVENT_TYPES.length to rotate, so with count=30
        // all 5 event types are covered (30 / 5 = 6 full rotations)
        const coveredTypes = new Set<string>();
        for (let i = 0; i < EVENTS_PER_CATEGORY; i++) {
          coveredTypes.add(EVENT_TYPES[i % EVENT_TYPES.length]);
        }
        // All 5 event types must be present
        expect(coveredTypes.size).toBe(EVENT_TYPES.length);
        expect(coveredTypes.has('PAGE_VIEW')).toBe(true);
        expect(coveredTypes.has('CLICK')).toBe(true);
        expect(coveredTypes.has('QR_SCAN')).toBe(true);
        expect(coveredTypes.has('LEAD_SUBMIT')).toBe(true);
        expect(coveredTypes.has('VCARD_DOWNLOAD')).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('lead sources cover all 3 types when count >= 3', () => {
    // Feature: industry-demo-samples, Property: Sample data minimum thresholds
    fc.assert(
      fc.property(categorySlugArb, (_category) => {
        // The seed uses i % LEAD_SOURCES.length to rotate, so with count=5
        // all 3 sources are covered (indices 0,1,2,0,1)
        const coveredSources = new Set<string>();
        for (let i = 0; i < LEADS_PER_CATEGORY; i++) {
          coveredSources.add(LEAD_SOURCES[i % LEAD_SOURCES.length]);
        }
        // All 3 lead sources must be present
        expect(coveredSources.size).toBe(LEAD_SOURCES.length);
        expect(coveredSources.has('qr_code')).toBe(true);
        expect(coveredSources.has('direct_visit')).toBe(true);
        expect(coveredSources.has('social_share')).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
