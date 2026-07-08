# Implementation Plan: Industry Demo Samples

## Overview

Expand the demo seed infrastructure to create 11 industry-specific demo microsites, add a public Demo Catalog page at `/demo/industries`, implement demo detection utilities, read-only protection for demo microsites, and a visual demo badge. All code is TypeScript/Next.js with Prisma, tested via vitest + fast-check.

## Tasks

- [x] 1. Set up demo utility module and property tests
  - [x] 1.1 Create `src/lib/demo-utils.ts` with `isDemoBrand`, `getCategoryFromDemoSlug`, `buildDemoSlug`, `buildDemoEmail`, and `resolveDemoUrl` utility functions
    - `isDemoBrand(slug)` returns true if slug starts with `demo-`
    - `getCategoryFromDemoSlug(slug)` extracts category slug from demo brand slug, returns null if not a demo brand
    - `buildDemoSlug(categorySlug)` returns `demo-{categorySlug}`
    - `buildDemoEmail(categorySlug)` returns `{categorySlug}@demo.parichay.io`
    - `resolveDemoUrl(category)` returns `demoUrl` if defined, else `/demo-{slug}/main`
    - _Requirements: 1.2, 1.3, 5.2, 5.3_

  - [x] 1.2 Write property tests for slug and email generation in `src/__tests__/demo/demo-utils.test.ts`
    - **Property 1: Demo slug generation** — For any valid category slug, `buildDemoSlug(slug)` equals `"demo-" + slug` and `isDemoBrand(buildDemoSlug(slug))` returns true
    - **Validates: Requirements 1.2, 4.4**
    - **Property 2: Demo email generation** — For any valid category slug, `buildDemoEmail(slug)` equals `slug + "@demo.parichay.io"`, contains exactly one `@`, and has non-empty local part
    - **Validates: Requirements 1.3**

  - [x] 1.3 Write property tests for demo brand detection and URL resolution in `src/__tests__/demo/demo-utils.test.ts`
    - **Property 4: Demo brand detection** — `isDemoBrand(s)` returns true iff `s` starts with `"demo-"`; `getCategoryFromDemoSlug` returns correct category or null
    - **Validates: Requirements 4.4, 7.1**
    - **Property 6: Demo URL resolution** — If `demoUrl` is defined, returns it unchanged; otherwise returns `/demo-{slug}/main`
    - **Validates: Requirements 5.2, 5.3**

- [x] 2. Create industry-specific microsite content generator
  - [x] 2.1 Create `prisma/demo-content.ts` content generator module
    - Define `CATEGORY_TO_TEMPLATE` mapping for categories with existing templates (healthcare, restaurant, fitness, beauty/creatives)
    - Define `PLACEHOLDER_CONTENT` with rich industry-specific data for the remaining 7 categories (business-owners, corporate-professionals, event-planners, freelancers-consultants, educational-institutions, real-estate-agents, legal-services)
    - Export `generateMicrositeContent(categorySlug, businessName, tagline)` function that tries template → placeholder → fallback
    - Implement `ensureMinimumContent()` to guarantee all 8 sections enabled with minimum item counts
    - Ensure hero.title = businessName, hero.subtitle = tagline, services ≥ 3, gallery ≥ 4, team ≥ 2, testimonials ≥ 2
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.2 Write property test for microsite content completeness in `src/__tests__/demo/seed-content.test.ts`
    - **Property 3: Microsite content completeness** — For any valid category slug, business name, and tagline, `generateMicrositeContent` produces config with all 8 sections enabled, meeting minimum item thresholds
    - **Validates: Requirements 2.1, 2.4, 2.5**

- [x] 3. Rewrite the demo seed script for full industry coverage
  - [x] 3.1 Rewrite `prisma/seed-demo.ts` to iterate over all 11 industry categories from `src/data/categories.ts`
    - Define `INDUSTRY_LAYOUT_MAP` mapping each category slug to a unique layout ID from `src/data/layout-options.ts`
    - Define `INDUSTRY_DEMO_NAMES` mapping each category slug to a business name and tagline
    - Implement idempotent cleanup: delete all `demo-` prefixed brands (cascading to branches, leads, analytics, QR codes) and `@demo.parichay.io` users before creating
    - For each category: create Brand (slug `demo-{category.slug}`, colorTheme from `category.colorScheme`, layoutId from map), Branch (slug `main`, micrositeConfig from content generator), User (email `{slug}@demo.parichay.io`, password `Demo@123`, role `BRANCH_ADMIN`, industryCategory set)
    - Create 5 leads per branch with varied statuses (NEW, CONTACTED, QUALIFIED, CONVERTED)
    - Create 30 analytics events per branch distributed across 5 event types over 30 days
    - Create 1 QR code per branch
    - Wrap each category in try/catch, log errors with category name, continue with remaining categories
    - Log progress summary: brands created, leads generated, events generated
    - Use lazy-loaded PrismaClient and content generator for test-friendly imports
    - Add direct execution guard so `main()` only runs when script is executed directly
    - Ensure execution completes within 60 seconds
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 6.1, 6.2, 6.3, 6.4, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 3.2 Write property test for color theme and layout assignment in `src/__tests__/demo/seed-content.test.ts`
    - **Property 4 (unit): Color theme and layout assignment** — Verify all values in `INDUSTRY_LAYOUT_MAP` are unique and every category slug has an entry
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [x] 3.3 Write property test for timestamp distribution in `src/__tests__/demo/seed-data.test.ts`
    - **Property 7: Timestamp distribution within bounds** — For any N, random date generator produces dates within [now - N days, now]
    - **Validates: Requirements 6.4**

  - [x] 3.4 Write property test for sample data minimum thresholds in `src/__tests__/demo/seed-data.test.ts`
    - Test that the seed data generation logic produces ≥ 5 leads, ≥ 30 events, and ≥ 1 QR code per category
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 4. Checkpoint - Ensure all seed and utility tests pass
  - Run `pnpm test` and verify all property tests in `src/__tests__/demo/` pass
  - Verify seed script runs successfully with `npx tsx prisma/seed-demo.ts`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Update category demoUrls and build Demo Catalog page
  - [x] 5.1 Update `demoUrl` field on all 11 industry category entries in `src/data/categories.ts` to point to `/demo-{category.slug}/main`
    - _Requirements: 5.4_

  - [x] 5.2 Create `src/app/demo/industries/page.tsx` Server Component
    - Fetch demo brands from DB where slug starts with `demo-`
    - Merge with static category data from `src/data/categories.ts` for icons and descriptions
    - Render `IndustryCatalogGrid` client component with merged data
    - If a demo brand doesn't exist for a category, pass `demoUrl: null` to show "Coming Soon" state
    - Page accessible at `/demo/industries`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 5.3 Create `src/components/demo/IndustryCatalogGrid.tsx` client component
    - Render industry category cards in a responsive grid, each showing category name, icon, description, and color theme
    - Cards with a valid `demoUrl` link to the demo microsite; cards without show disabled state with "Coming Soon" label
    - Include a search input that filters cards by category name (case-insensitive substring match)
    - _Requirements: 4.1, 4.2, 4.5, 4.6_

  - [x] 5.4 Write property test for search filter correctness in `src/__tests__/demo/catalog-filter.test.ts`
    - **Property 5: Search filter correctness** — For any array of category objects and any query string, filtering returns exactly those categories whose name contains the query (case-insensitive), preserving order
    - **Validates: Requirements 4.6**

- [x] 6. Create API endpoint and DemoBadge component
  - [x] 6.1 Create `src/app/api/demo/microsites/route.ts` GET endpoint
    - Query demo brands (slug starts with `demo-`) with their first active branch
    - Support optional `?category={slug}` query param to filter by industry
    - Return `{ success: boolean, data: DemoMicrositeListItem[] }` with brandId, brandName, brandSlug, branchSlug, industryCategory, colorTheme, demoUrl
    - Return empty array for invalid/unknown category filter (not an error)
    - _Requirements: 4.4, Design API Layer_

  - [x] 6.2 Create `src/components/microsites/DemoBadge.tsx` component
    - Fixed-position top banner: "🎯 Demo Preview — {categoryName} | Create Your Own →"
    - Link "Create Your Own" to `/register`
    - Style with the brand's color theme, ensure it doesn't overlap microsite content (spacer div h-10 sm:h-11)
    - Add `role="banner"` and `aria-label` for accessibility
    - _Requirements: 7.3_

  - [x] 6.3 Integrate DemoBadge into the microsite page at `src/app/[brand]/[branch]/page.tsx`
    - Import `isDemoBrand` from `src/lib/demo-utils`
    - If the brand slug is a demo brand, render `DemoBadge` above `MicrositeRenderer`
    - Look up category name from `src/data/categories.ts` using `getCategoryFromDemoSlug`
    - _Requirements: 7.3_

- [x] 7. Implement read-only protection for demo microsites
  - [x] 7.1 Add demo config modification guard to the microsite config update API (`POST /api/microsites` or equivalent route)
    - After verifying user auth and before updating the branch, check if the brand slug starts with `demo-`
    - If demo brand and user role is not `SUPER_ADMIN`, return 403 with `{ error: 'Demo microsites cannot be modified' }`
    - Fetch the brand via the branch to get the slug for the check
    - Lead form submissions on demo microsites remain functional (no changes needed to lead API)
    - _Requirements: 7.1, 7.2, 7.4_

  - [x] 7.2 Write property test for demo config modification guard in `src/__tests__/demo/demo-guard.test.ts`
    - **Property 8: Demo config modification guard** — If brand slug starts with `"demo-"` and role ≠ SUPER_ADMIN → reject (403); non-demo brands → allow; SUPER_ADMIN → always allow
    - **Validates: Requirements 7.1, 7.4**

- [x] 8. Add "View Live Demo" button to category-related pages
  - [x] 8.1 Add a "View Live Demo" link/button to industry category displays on the landing page and onboarding flow
    - Use `resolveDemoUrl` from `src/lib/demo-utils` to determine the link target
    - If `demoUrl` is defined on the category, link directly; if not, construct from `/demo-{slug}/main`
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 9. Final checkpoint - Ensure all tests pass and integration works
  - Run `pnpm test` and verify all tests pass
  - Verify demo catalog page loads at `/demo/industries`
  - Verify demo microsites render with DemoBadge
  - Verify read-only protection blocks non-SUPER_ADMIN modifications
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- No schema changes are required — all demo data fits existing Prisma models
- Test runner command: `pnpm test` (runs `vitest --run`)
- `fast-check` ^4.7.0 and `vitest` ^4.1.4 are already in devDependencies

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.2", "3.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "3.4", "5.1"] },
    { "id": 3, "tasks": ["5.2", "5.3", "6.1", "6.2"] },
    { "id": 4, "tasks": ["5.4", "6.3", "7.1", "8.1"] },
    { "id": 5, "tasks": ["7.2"] }
  ]
}
```
