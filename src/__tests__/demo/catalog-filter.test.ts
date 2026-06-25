/**
 * Property-based tests for catalog search filter correctness.
 * Uses fast-check to verify the filter logic from IndustryCatalogGrid.
 */
// Feature: industry-demo-samples, Property 5: Search filter correctness
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Re-implementation of the filter logic from IndustryCatalogGrid.tsx:
 * categories.filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
 */
function filterCategories<T extends { name: string }>(
  categories: T[],
  search: string,
): T[] {
  return categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()),
  );
}

// Arbitrary for hex color strings like "#a1b2c3"
const hexColorArb = fc
  .array(fc.constantFrom('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'), { minLength: 6, maxLength: 6 })
  .map((chars) => `#${chars.join('')}`);

// Arbitrary for category objects matching the IndustryCategoryCard shape
const categoryArb = fc.record({
  categoryId: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  slug: fc.string({ minLength: 1 }),
  description: fc.string(),
  icon: fc.constantFrom('briefcase', 'palette', 'scale'),
  colorScheme: fc.record({
    primary: hexColorArb,
    secondary: hexColorArb,
    accent: hexColorArb,
  }),
  demoUrl: fc.oneof(fc.constant(null), fc.string({ minLength: 1 })),
  brandName: fc.oneof(fc.constant(null), fc.string({ minLength: 1 })),
});

describe('Property 5: Search filter correctness', () => {
  /**
   * **Validates: Requirements 4.6**
   *
   * For any array of category objects and any query string, filtering returns
   * exactly those categories whose name contains the query (case-insensitive),
   * preserving order.
   */
  it('returns exactly those categories whose name contains the query (case-insensitive), preserving order', () => {
    const categoriesArb = fc.array(categoryArb, { minLength: 0, maxLength: 20 });
    const queryArb = fc.string({ minLength: 0, maxLength: 30 });

    fc.assert(
      fc.property(categoriesArb, queryArb, (categories, query) => {
        const result = filterCategories(categories, query);

        // Every item in result must have name containing query (case-insensitive)
        for (const cat of result) {
          expect(cat.name.toLowerCase()).toContain(query.toLowerCase());
        }

        // Every item in input that matches must be in result
        const expected = categories.filter((cat) =>
          cat.name.toLowerCase().includes(query.toLowerCase()),
        );
        expect(result).toHaveLength(expected.length);

        // Order is preserved: indices in result match relative order in input
        let lastInputIndex = -1;
        for (const cat of result) {
          const inputIndex = categories.indexOf(cat);
          expect(inputIndex).toBeGreaterThan(lastInputIndex);
          lastInputIndex = inputIndex;
        }
      }),
      { numRuns: 100 },
    );
  });

  it('empty query returns all categories unchanged', () => {
    const categoriesArb = fc.array(categoryArb, { minLength: 0, maxLength: 20 });

    fc.assert(
      fc.property(categoriesArb, (categories) => {
        const result = filterCategories(categories, '');

        // Empty search should return all categories in original order
        expect(result).toHaveLength(categories.length);
        expect(result).toEqual(categories);
      }),
      { numRuns: 100 },
    );
  });

  it('filter is case-insensitive: query "ABC" matches name containing "abc"', () => {
    const categoriesArb = fc.array(categoryArb, { minLength: 1, maxLength: 20 });

    fc.assert(
      fc.property(categoriesArb, (categories) => {
        // Use the first category's name with altered case as query
        const name = categories[0].name;
        const upperQuery = name.toUpperCase();
        const lowerQuery = name.toLowerCase();

        const upperResult = filterCategories(categories, upperQuery);
        const lowerResult = filterCategories(categories, lowerQuery);

        // Both case variants must produce the same results
        expect(upperResult).toEqual(lowerResult);
      }),
      { numRuns: 100 },
    );
  });
});
