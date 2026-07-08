# Design Document: Industry Demo Samples

## Overview

This feature expands the existing demo seed infrastructure to provide a dedicated, fully configured demo microsite for each of the 11 industry categories in the Parichay platform. It introduces a public Demo Catalog page at `/demo/industries`, a lightweight API endpoint for fetching demo microsites, and a read-only protection mechanism with a visual demo badge.

The current implementation creates exactly one demo brand+branch+user per industry category, using content from `src/data/industry-templates.ts` where template mappings exist (healthcare, restaurant, fitness, beauty/creatives) and generating realistic placeholder content for the remaining 7 industries via `prisma/demo-content.ts`.

Key design decisions:
- **No schema changes** — all demo data fits existing Prisma models (Brand, Branch, User, Lead, AnalyticsEvent, QRCode)
- **Convention-based demo detection** — demo brands are identified by the `demo-` slug prefix via utility functions in `src/lib/demo-utils.ts`
- **Server-side rendering** — the Demo Catalog page is a Next.js Server Component that queries the database directly
- **Minimal new API surface** — one GET endpoint at `/api/demo/microsites` for client-side use cases
- **Lazy-loaded seed dependencies** — PrismaClient and content generator are lazy-loaded so test files can import static maps without triggering DB connections
- **Separate content module** — industry-specific content generation lives in `prisma/demo-content.ts`, decoupled from the seed orchestration logic

## Architecture

```mermaid
graph TD
    subgraph "Seed Layer"
        A[prisma/seed-demo.ts] -->|orchestrates| B[11 Demo Brands]
        A -->|creates| C[11 Demo Branches]
        A -->|creates| D[11 Demo Users]
        A -->|creates| E[5 Sample Leads each]
        A -->|creates| F[30 Analytics Events each]
        A -->|creates| G[1 QR Code each]
        DC[prisma/demo-content.ts] -->|generates micrositeConfig| A
    end

    subgraph "Data Sources"
        H[src/data/categories.ts] -->|11 categories| A
        I[src/data/industry-templates.ts] -->|4 template categories| DC
        J[src/data/layout-options.ts] -->|15 layouts| A
    end

    subgraph "Utilities"
        U[src/lib/demo-utils.ts] -->|buildDemoSlug, buildDemoEmail| A
        U -->|isDemoBrand, getCategoryFromDemoSlug| K
        U -->|getCategoryFromDemoSlug| Q
        U -->|resolveDemoUrl| LP[Landing/Onboarding pages]
    end

    subgraph "Presentation Layer"
        K[/demo/industries page] -->|SSR query: slug startsWith demo-| L[Prisma]
        K -->|renders| M[IndustryCatalogGrid]
        M -->|links to| N[/{demo-slug}/{branch-slug}]
        N -->|renders| O[MicrositeRenderer]
        O -->|shows| P[DemoBadge component]
    end

    subgraph "API Layer"
        Q[GET /api/demo/microsites] -->|optional ?category filter| R[Demo brand+branch list]
    end

    subgraph "Protection Layer"
        S[isDemoBrand util] -->|checks slug prefix| T[Read-only guard in admin API]
        S -->|injects badge| O
    end
```

## Components and Interfaces

### 1. Seed Script (`prisma/seed-demo.ts`)

The seed script iterates over all 11 industry categories with idempotent cleanup. It uses lazy-loaded dependencies to allow test imports of static maps without instantiating PrismaClient.

```typescript
// Lazy-loaded PrismaClient — avoids DB connection during test imports
let _prisma: any = null;
function getPrisma() { /* ... */ }

// Lazy-loaded content generator — falls back to inline buildFallbackContent
let _generateMicrositeContent: (...) => Record<string, unknown> | null = null;
function getGenerateMicrositeContent() { /* ... */ }

// Core seed function signature
async function seedDemoData(): Promise<SeedResult>

interface SeedResult {
  brandsCreated: number;
  branchesCreated: number;
  usersCreated: number;
  leadsCreated: number;
  eventsCreated: number;
  qrCodesCreated: number;
  errors: string[];
}

// Industry-to-layout mapping (all 11 unique layouts)
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

// Industry-to-demo-business-name mapping
const INDUSTRY_DEMO_NAMES: Record<string, { name: string; tagline: string }> = {
  'business-owners': { name: 'Pinnacle Enterprises', tagline: 'Building Success Together' },
  'corporate-professionals': { name: 'Apex Corporate Solutions', tagline: 'Excellence in Every Engagement' },
  'event-planners': { name: 'Stellar Events Co.', tagline: 'Creating Unforgettable Moments' },
  'freelancers-consultants': { name: 'ProConsult Hub', tagline: 'Expert Solutions On Demand' },
  'educational-institutions': { name: 'Bright Horizons Academy', tagline: 'Shaping Future Leaders' },
  'creatives-designers': { name: 'Artisan Design Studio', tagline: 'Where Creativity Meets Craft' },
  'real-estate-agents': { name: 'Prime Realty Group', tagline: 'Your Dream Property Awaits' },
  'healthcare-professionals': { name: 'CareFirst Medical Center', tagline: 'Your Health, Our Priority' },
  'restaurants-cafes': { name: 'The Golden Spoon', tagline: 'A Culinary Journey Awaits' },
  'fitness-wellness': { name: 'VitalFit Studio', tagline: 'Transform Your Body & Mind' },
  'legal-services': { name: 'Sterling Law Associates', tagline: 'Justice With Integrity' },
};
```

**Seed execution flow:**
1. Delete all existing `demo-` prefixed brands (manual cascade: leads → analytics → QR codes → branches → brands)
2. Delete all `@demo.parichay.io` users
3. Hash the shared password `Demo@123` once with bcryptjs
4. For each of the 11 categories from `industryCategories`:
   a. Create Brand with slug from `buildDemoSlug(category.slug)`, colorTheme from `category.colorScheme`, layoutId from `INDUSTRY_LAYOUT_MAP`, auto-generated logo via ui-avatars.com
   b. Create Branch with slug `main`, micrositeConfig from `generateMicrositeContent()`, default address/contact/businessHours
   c. Create User with email from `buildDemoEmail(category.slug)`, role `BRANCH_ADMIN`, industryCategory = `category.id`
   d. Create 5 leads with rotated statuses (NEW/CONTACTED/QUALIFIED/CONVERTED) and sources (qr_code/direct_visit/social_share)
   e. Create 30 analytics events distributed across 5 event types (PAGE_VIEW/CLICK/QR_SCAN/LEAD_SUBMIT/VCARD_DOWNLOAD) over 30 days
   f. Create 1 QR code pointing to `/{brandSlug}/main`
5. Log summary with counts and any per-category errors

**Direct execution guard:** The script only calls `main()` when executed directly (not when imported by tests), detected via `process.argv[1]` suffix check.

### 2. Content Generator (`prisma/demo-content.ts`)

Generates industry-specific micrositeConfig JSON for each category. Uses a two-tier approach:

```typescript
// Template category mapping (4 categories have existing templates)
const CATEGORY_TO_TEMPLATE: Record<string, string> = {
  'healthcare-professionals': 'healthcare',
  'restaurants-cafes': 'restaurant',
  'fitness-wellness': 'fitness',
  'creatives-designers': 'beauty',
};

// 7 categories have rich placeholder content defined inline:
// business-owners, corporate-professionals, event-planners,
// freelancers-consultants, educational-institutions, real-estate-agents, legal-services

export function generateMicrositeContent(
  categorySlug: string,
  businessName: string,
  tagline: string,
): Record<string, unknown>
```

**Content generation strategy:**
1. If `CATEGORY_TO_TEMPLATE[categorySlug]` exists → adapt from `industry-templates.ts`
2. If `PLACEHOLDER_CONTENT[categorySlug]` exists → build from industry-specific placeholder
3. Otherwise → use generic fallback (buildFallbackContent)

**Minimum content guarantees** (enforced by `ensureMinimumContent()`):
- All 8 sections present with `enabled: true`
- Hero: `title = businessName`, `subtitle = tagline`
- Services: ≥ 3 items
- Gallery: ≥ 4 images
- Team: ≥ 2 members
- Testimonials: ≥ 2 items
- Booking & Contact: always enabled

### 3. Demo Catalog Page (`src/app/demo/industries/page.tsx`)

A Next.js Server Component that fetches demo brands and passes them to a client-side grid component.

```typescript
// Server Component - SSR with Prisma query
export default async function DemoIndustriesPage() {
  const demoBrands = await prisma.brand.findMany({
    where: { slug: { startsWith: 'demo-' } },
    include: { branches: { where: { isActive: true }, take: 1 } },
    orderBy: { name: 'asc' },
  });

  // Index by category slug using getCategoryFromDemoSlug
  // Map industryCategories → IndustryCategoryCard[]
  // demoUrl derived from brand.slug/branch.slug (not from categories.ts demoUrl field)
}
```

**Sub-components:**

```typescript
// Client component with search filtering (src/components/demo/IndustryCatalogGrid.tsx)
interface IndustryCatalogGridProps {
  categories: IndustryCategoryCard[];
}

interface IndustryCategoryCard {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  colorScheme: { primary: string; secondary: string; accent: string };
  demoUrl: string | null;    // null = "Coming Soon" state
  brandName: string | null;
}
```

The grid renders each category as a styled card with the category's color border, Lucide icon, description, and either a "View Demo →" link or "Coming Soon" badge. Search filtering uses a case-insensitive `includes()` on `cat.name`.

### 4. API Endpoint (`src/app/api/demo/microsites/route.ts`)

```typescript
// GET /api/demo/microsites
// Query params: ?category={slug} (optional filter)
// - Invalid/unknown category → returns empty array (not an error)
// - No filter → returns all demo- brands
// Returns: { success: boolean, data: DemoMicrositeListItem[] }

interface DemoMicrositeListItem {
  brandId: string;
  brandName: string;
  brandSlug: string;
  branchSlug: string;
  industryCategory: string;
  colorTheme: { primary: string; secondary: string; accent: string };
  demoUrl: string;
}
```

Error handling: wraps entire handler in try/catch, returns `{ success: false, error: message }` with HTTP 500 on unexpected errors.

### 5. Demo Badge Component (`src/components/microsites/DemoBadge.tsx`)

A fixed-position banner displayed at the top of demo microsites with a spacer div to prevent content overlap.

```typescript
interface DemoBadgeProps {
  brandName: string;
  categoryName: string;
}

// Renders a fixed top banner with:
// - role="banner" for accessibility
// - aria-label for screen readers
// - "Demo Preview" label with category name
// - Link to create your own (→ /register or /demo/industries)
// - Spacer div (h-10 sm:h-11) below to prevent content occlusion
```

### 6. Demo Detection Utilities (`src/lib/demo-utils.ts`)

```typescript
export function isDemoBrand(slug: string): boolean
// Returns true when slug starts with 'demo-'

export function getCategoryFromDemoSlug(slug: string): string | null
// Extracts category slug from demo brand slug, null if not a demo brand

export function buildDemoSlug(categorySlug: string): string
// Returns `demo-{categorySlug}`

export function buildDemoEmail(categorySlug: string): string
// Returns `{categorySlug}@demo.parichay.io`

export function resolveDemoUrl(category: { slug: string; demoUrl?: string }): string
// Returns category.demoUrl if defined, otherwise `/demo-{slug}/main`
```

### 7. Read-Only Protection (Partially Implemented)

**Status:** The `isDemoBrand` utility and `DemoBadge` component exist. The admin API guard in `POST /api/microsites` is **not yet implemented**.

**Design for the protection guard:**

**a. Admin Dashboard Guard** — In the microsite config update API (`POST /api/microsites`), add a check:
```typescript
if (isDemoBrand(brand.slug) && user.role !== 'SUPER_ADMIN') {
  return NextResponse.json(
    { error: 'Demo microsites cannot be modified' },
    { status: 403 }
  );
}
```

**b. Lead Forms Remain Functional** — Contact/booking forms on demo microsites continue to submit leads normally. This is intentional so the CRM demo works.

**c. Demo Badge Injection** — In the microsite page renderer, detect demo brands via `isDemoBrand(brand.slug)` and render `DemoBadge`.

### 8. Category `demoUrl` Updates (`src/data/categories.ts`)

All 11 entries have their `demoUrl` field set to `/demo-{slug}/main`:

```typescript
{ id: 'business-owners', ..., demoUrl: '/demo-business-owners/main' }
{ id: 'corporate-professionals', ..., demoUrl: '/demo-corporate-professionals/main' }
{ id: 'event-planners', ..., demoUrl: '/demo-event-planners/main' }
{ id: 'freelancers-consultants', ..., demoUrl: '/demo-freelancers-consultants/main' }
{ id: 'educational-institutions', ..., demoUrl: '/demo-educational-institutions/main' }
{ id: 'creatives-designers', ..., demoUrl: '/demo-creatives-designers/main' }
{ id: 'real-estate-agents', ..., demoUrl: '/demo-real-estate-agents/main' }
{ id: 'healthcare-professionals', ..., demoUrl: '/demo-healthcare-professionals/main' }
{ id: 'restaurants-cafes', ..., demoUrl: '/demo-restaurants-cafes/main' }
{ id: 'fitness-wellness', ..., demoUrl: '/demo-fitness-wellness/main' }
{ id: 'legal-services', ..., demoUrl: '/demo-legal-services/main' }
```

## Data Models

No schema changes are required. The feature uses existing models:

| Model | Usage | Key Fields |
|-------|-------|------------|
| Brand | One per industry demo | `slug: "demo-{category}"`, `colorTheme`, `layoutId`, `ownerId: "demo-owner-{slug}"` |
| Branch | One per demo brand | `slug: "main"`, `micrositeConfig` (JSON), `address`, `contact`, `businessHours` |
| User | One per demo brand | `email: "{slug}@demo.parichay.io"`, `industryCategory`, `role: BRANCH_ADMIN`, `brandId` |
| Lead | 5 per demo branch | `status` rotated across NEW/CONTACTED/QUALIFIED/CONVERTED, `source` rotated |
| AnalyticsEvent | 30 per demo branch | Distributed across 5 event types over 30 days |
| QRCode | 1 per demo branch | `url: "/{brandSlug}/main"`, `format: "PNG"` |

**Demo brand identification convention:**
- Brand slug starts with `demo-` (detected by `isDemoBrand()`)
- User email ends with `@demo.parichay.io`
- All demo users share password `Demo@123` (hashed with bcryptjs)
- Brand `ownerId` follows pattern `demo-owner-{category-slug}`

**MicrositeConfig JSON structure** (per branch) includes:
- `templateId`: layout identifier string
- `seoSettings`: `{ title, description, keywords }`
- `sections`: object with keys `hero`, `about`, `services`, `gallery`, `team`, `testimonials`, `booking`, `contact` — each with `enabled: true` and section-specific content

Each demo populates:
- Minimum 3 service items (most industries have 4)
- Minimum 2 team members (many have 3)
- Minimum 2 testimonials
- Minimum 4 gallery images (some have 5)
- Hero title = demo business name, subtitle = industry tagline

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Demo slug generation

*For any* valid category slug string, `buildDemoSlug(slug)` should return a string that equals `"demo-" + slug`, and `isDemoBrand(buildDemoSlug(slug))` should always return `true`.

**Validates: Requirements 1.2, 4.4**

### Property 2: Demo email generation

*For any* valid category slug string, `buildDemoEmail(slug)` should return a string that equals `slug + "@demo.parichay.io"`, contains exactly one `@` character, and has a non-empty local part.

**Validates: Requirements 1.3**

### Property 3: Microsite content completeness

*For any* valid category slug, business name, and tagline, `generateMicrositeContent(slug, name, tagline)` should produce a config object where: all 8 sections (hero, about, services, gallery, team, testimonials, booking, contact) are present with `enabled: true`; services has ≥ 3 items; gallery has ≥ 4 images; team has ≥ 2 members; testimonials has ≥ 2 items; hero.title equals the business name; and hero.subtitle equals the tagline.

**Validates: Requirements 2.1, 2.4, 2.5**

### Property 4: Demo brand detection

*For any* string, `isDemoBrand(s)` should return `true` if and only if `s` starts with the prefix `"demo-"`. For any non-demo slug, `getCategoryFromDemoSlug(s)` should return `null`. For any demo slug `"demo-X"`, `getCategoryFromDemoSlug("demo-X")` should return `"X"`.

**Validates: Requirements 4.4, 7.1**

### Property 5: Search filter correctness

*For any* array of category objects and any search query string, filtering by case-insensitive substring match on the `name` field should return exactly those categories whose name contains the query as a case-insensitive substring, preserving the original order.

**Validates: Requirements 4.6**

### Property 6: Demo URL resolution

*For any* category object, if `demoUrl` is defined and non-empty, `resolveDemoUrl(category)` should return that exact `demoUrl` value unchanged. If `demoUrl` is undefined or empty, it should return `/demo-{category.slug}/main`.

**Validates: Requirements 5.2, 5.3**

### Property 7: Timestamp distribution within bounds

*For any* invocation of the random date generator with parameter N days, the resulting Date should be no earlier than N days before the current time and no later than the current time.

**Validates: Requirements 6.4**

### Property 8: Demo config modification guard

*For any* user role and brand slug combination: if the brand slug starts with `"demo-"` and the user role is not `SUPER_ADMIN`, the modification attempt should be rejected (403). If the brand slug does not start with `"demo-"`, the modification should be allowed regardless of role. If the user role is `SUPER_ADMIN`, the modification should be allowed regardless of slug.

**Validates: Requirements 7.1, 7.4**

## Error Handling

| Scenario | Handling |
|----------|----------|
| Seed script fails mid-execution for a specific category | Log error with category name (`❌ {category.name}: {message}`), continue with remaining categories, collect errors in `result.errors` array |
| Database connection failure during seed | Catch at top level in `main()`, log descriptive error, exit with `process.exit(1)` |
| Missing industry template for a category | Fall back to `PLACEHOLDER_CONTENT` → then to `buildFallbackContent()` (not an error) |
| Content generator module fails to load | `getGenerateMicrositeContent()` catches the import error and falls back to inline `buildFallbackContent` |
| Demo brand not found for a category in catalog | Render card with `demoUrl: null` → "Coming Soon" label |
| Non-SUPER_ADMIN attempts to modify demo config | Return 403 with message "Demo microsites cannot be modified" |
| Demo API endpoint called with unknown category filter | Return `{ success: true, data: [] }` (empty array, not an error) |
| Demo API endpoint throws unexpected error | Return `{ success: false, error: "Failed to fetch demo microsites" }` with HTTP 500 |
| Lead form submission on demo microsite | Process normally — leads are stored against the demo branch |

The seed script wraps each category's creation in a try/catch so that a failure in one industry doesn't prevent the others from being seeded. The outer function collects errors and logs a summary at the end.

## Testing Strategy

### Property-Based Testing

Use `fast-check` (already installed as `^4.7.0` dev dependency) as the property-based testing library. Each property test runs a minimum of 100 iterations.

Tests should be organized in `src/__tests__/demo/` and tagged with comments referencing the design property:

```typescript
// Feature: industry-demo-samples, Property 1: Demo slug generation
// Feature: industry-demo-samples, Property 2: Demo email generation
// etc.
```

**Key property tests:**

1. **Slug generation** (Property 1): Generate random non-empty strings via fast-check, pass through `buildDemoSlug`, verify output matches `demo-{input}` pattern and `isDemoBrand` returns true.
2. **Email generation** (Property 2): Generate random non-empty strings, verify `buildDemoEmail` output matches `{slug}@demo.parichay.io` format with single `@`.
3. **Content completeness** (Property 3): Generate random category slugs from the 11 known values plus random strings, random business names, and random taglines. Verify `generateMicrositeContent` output meets all minimum thresholds and hero values.
4. **Demo brand detection** (Property 4): Generate random strings (some with `demo-` prefix, some without), verify `isDemoBrand` and `getCategoryFromDemoSlug` return correct results.
5. **Search filter** (Property 5): Generate random arrays of objects with `name` fields and random query strings, verify filter returns exactly the matching subset in order.
6. **Demo URL resolution** (Property 6): Generate random category objects with and without `demoUrl`, verify `resolveDemoUrl` returns the correct URL.
7. **Timestamp bounds** (Property 7): Run `randomDateWithinDays(N)` with random N values, verify result is within `[now - N*days, now]`.
8. **Config guard** (Property 8): Generate random user roles and brand slugs, verify the guard logic allows only SUPER_ADMIN on demo brands and allows everyone on non-demo brands.

### Unit Tests (Example-Based)

Unit tests cover specific examples and edge cases:

1. **Template vs. placeholder routing** (Requirement 2.2/2.3): Verify healthcare-professionals uses `healthcare` template, business-owners uses placeholder content.
2. **Layout uniqueness** (Requirement 3.3): Verify all values in `INDUSTRY_LAYOUT_MAP` are unique.
3. **All categories mapped** (Requirement 3.2): Verify `INDUSTRY_LAYOUT_MAP` has an entry for every `industryCategories[].slug`.
4. **All demoUrls defined** (Requirement 5.4): Verify all 11 `industryCategories` entries have a `demoUrl` field.
5. **Coming Soon state** (Requirement 4.5): Render a CategoryCard with `demoUrl: null`, verify "Coming Soon" text.
6. **Error logging format** (Requirement 8.4): Mock a DB error for one category, verify the seed's error array includes the category name.
7. **API empty result for unknown category** (API endpoint): Call GET `/api/demo/microsites?category=unknown`, verify `{ success: true, data: [] }`.

### Integration Tests

1. **Full seed run** (Requirements 1.1, 1.4, 1.5, 6.1–6.3): Run seed against a test database, verify exactly 11 brands, 11 branches, 11 users, ≥55 leads, ≥330 events, ≥11 QR codes.
2. **Idempotence** (Requirement 8.1/8.2): Run seed twice, compare database state — should be identical after both runs.
3. **Color theme passthrough** (Requirement 3.1): Verify each seeded brand's `colorTheme` matches its category's `colorScheme`.
4. **Lead submission on demo** (Requirement 7.2): Submit a lead via the API to a demo branch, verify it's stored.

### Test Configuration

- `fast-check` version `^4.7.0` (already in devDependencies)
- `vitest` version `^4.1.4` (already in devDependencies, configured in `vitest.config.ts`)
- Test runner command: `pnpm test` (runs `vitest --run`)
- Path aliases: `@` → `./src` (already configured in `vitest.config.ts`)
- Property tests: minimum 100 iterations via `fc.assert(fc.property(...), { numRuns: 100 })`
- Each property test tagged with: `Feature: industry-demo-samples, Property {N}: {title}`
