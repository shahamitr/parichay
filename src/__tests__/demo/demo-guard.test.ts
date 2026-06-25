/**
 * Property-based tests for demo config modification guard.
 * Uses fast-check to verify the guard logic across generated inputs.
 *
 * Feature: industry-demo-samples, Property 8: Demo config modification guard
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { isDemoBrand } from '@/lib/demo-utils';

// Re-implement the guard decision logic as a pure function for testing
type UserRole = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'STAFF' | 'USER';

function shouldRejectModification(brandSlug: string, userRole: UserRole): boolean {
  return isDemoBrand(brandSlug) && userRole !== 'SUPER_ADMIN';
}

// Generators
const roleArb = fc.constantFrom<UserRole>('SUPER_ADMIN', 'BRANCH_ADMIN', 'STAFF', 'USER');
const nonSuperAdminRoleArb = fc.constantFrom<UserRole>('BRANCH_ADMIN', 'STAFF', 'USER');
const demoSlugArb = fc.string({ minLength: 1 }).map((s) => 'demo-' + s);
const nonDemoSlugArb = fc.string({ minLength: 1 }).filter((s) => !s.startsWith('demo-'));

// Feature: industry-demo-samples, Property 8: Demo config modification guard
describe('Property 8: Demo config modification guard', () => {
  /**
   * **Validates: Requirements 7.1, 7.4**
   *
   * If brand slug starts with "demo-" and role ≠ SUPER_ADMIN → reject (403)
   * Non-demo brands → allow regardless of role
   * SUPER_ADMIN → always allow regardless of slug
   */

  it('rejects modification when slug starts with "demo-" and role is not SUPER_ADMIN', () => {
    fc.assert(
      fc.property(demoSlugArb, nonSuperAdminRoleArb, (slug, role) => {
        const result = shouldRejectModification(slug, role);
        expect(result).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('allows modification when slug does NOT start with "demo-" regardless of role', () => {
    fc.assert(
      fc.property(nonDemoSlugArb, roleArb, (slug, role) => {
        const result = shouldRejectModification(slug, role);
        expect(result).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('allows modification when role is SUPER_ADMIN regardless of slug', () => {
    // Test with both demo and non-demo slugs
    const anySlugArb = fc.oneof(demoSlugArb, nonDemoSlugArb);

    fc.assert(
      fc.property(anySlugArb, (slug) => {
        const result = shouldRejectModification(slug, 'SUPER_ADMIN');
        expect(result).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});
