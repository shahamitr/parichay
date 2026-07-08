# Industry Demo Samples

## Overview

The Industry Demo Samples feature provides 11 pre-built, realistic demo microsites — one for every industry category supported by the Parichay platform. Each demo microsite is fully configured with industry-specific content, visual theming, sample leads, analytics data, and QR codes.

Sales teams can show prospects a live demo matching their industry with one click, and customers browsing the platform can evaluate exactly how Parichay would look for their business type.

## Supported Industries

| # | Industry | Demo URL | Demo Brand |
|---|----------|----------|------------|
| 1 | Business Owners | `/demo-business-owners/main` | Pinnacle Enterprises |
| 2 | Corporate Professionals | `/demo-corporate-professionals/main` | Apex Corporate Solutions |
| 3 | Event Planners | `/demo-event-planners/main` | Stellar Events Co. |
| 4 | Freelancers & Consultants | `/demo-freelancers-consultants/main` | ProConsult Hub |
| 5 | Educational Institutions | `/demo-educational-institutions/main` | Bright Horizons Academy |
| 6 | Creatives & Designers | `/demo-creatives-designers/main` | Artisan Design Studio |
| 7 | Real Estate Agents | `/demo-real-estate-agents/main` | Prime Realty Group |
| 8 | Healthcare Professionals | `/demo-healthcare-professionals/main` | CareFirst Medical Center |
| 9 | Restaurants & Cafes | `/demo-restaurants-cafes/main` | The Golden Spoon |
| 10 | Fitness & Wellness | `/demo-fitness-wellness/main` | VitalFit Studio |
| 11 | Legal Services | `/demo-legal-services/main` | Sterling Law Associates |

## Key Features

### Demo Catalog Page (`/demo/industries`)

A public-facing page that lists all industry demos in a filterable grid. Each card shows:
- Industry name and icon
- Category description
- Color-themed border
- "View Demo →" link (or "Coming Soon" for unavailable)
- Search/filter by industry name

### Industry-Specific Content

Each demo microsite includes all 8 sections with realistic data:
- **Hero** — Business name and tagline
- **About** — Industry-appropriate description
- **Services** — 3–4 services with pricing
- **Gallery** — 4–5 images
- **Team** — 2–3 team members with bios
- **Testimonials** — 2+ client reviews
- **Booking** — Appointment scheduling
- **Contact** — Lead capture form

### Visual Theming

Each industry gets a unique combination of:
- **Color Theme** — Pulled from the category's `colorScheme` in `src/data/categories.ts`
- **Layout Template** — One of 15 unique layouts from `src/data/layout-options.ts`

### Demo Badge

Demo microsites display a fixed-position top banner:
```
🎯 Demo Preview — {Industry Name} | Create Your Own →
```
The "Create Your Own" link navigates to `/register`.

### Read-Only Protection

- Demo microsites cannot be modified by non-SUPER_ADMIN users through the admin dashboard
- Lead form submissions still work (so the CRM demo functions)
- Returns HTTP 403 with "Demo microsites cannot be modified" if a non-admin attempts changes

### Sample Data per Demo

Each demo microsite comes with:
- **5 leads** — Varied statuses (NEW, CONTACTED, QUALIFIED, CONVERTED)
- **30 analytics events** — Distributed across PAGE_VIEW, CLICK, QR_SCAN, LEAD_SUBMIT, VCARD_DOWNLOAD over 30 days
- **1 QR code** — Points to the demo microsite URL

## Demo Credentials

All demo users share the same password pattern:

| Email | Password | Role |
|-------|----------|------|
| `{industry-slug}@demo.parichay.io` | `Demo@123` | BRANCH_ADMIN |

Examples:
- `business-owners@demo.parichay.io` / `Demo@123`
- `healthcare-professionals@demo.parichay.io` / `Demo@123`
- `restaurants-cafes@demo.parichay.io` / `Demo@123`

## Setup & Seeding

### Run the Demo Seed Script

```bash
npx tsx prisma/seed-demo.ts
```

This script:
1. Deletes all existing demo data (brands starting with `demo-`, users with `@demo.parichay.io`)
2. Creates 11 demo brands with branches, users, leads, analytics, and QR codes
3. Logs progress and summary to console
4. Completes within 60 seconds

The script is **idempotent** — run it multiple times to refresh demo data without manual cleanup.

### Verify Demo Data

After seeding, check:
- Visit `/demo/industries` — should show 11 industry cards
- Click any card — should navigate to a fully rendered microsite with DemoBadge
- Login as a demo user — should see leads and analytics in the dashboard

## Architecture

```
prisma/
├── seed-demo.ts          # Orchestrates demo data creation
├── demo-content.ts       # Industry-specific content generator

src/
├── lib/
│   └── demo-utils.ts     # isDemoBrand, buildDemoSlug, buildDemoEmail, resolveDemoUrl
├── data/
│   ├── categories.ts     # 11 industry categories with demoUrl fields
│   ├── industry-templates.ts  # Template content (healthcare, restaurant, fitness, beauty)
│   └── layout-options.ts      # 15 layout configurations
├── app/
│   ├── demo/industries/page.tsx  # Demo Catalog Server Component
│   └── api/demo/microsites/route.ts  # GET /api/demo/microsites
├── components/
│   ├── demo/IndustryCatalogGrid.tsx  # Catalog grid with search
│   └── microsites/DemoBadge.tsx      # Demo preview banner
```

### Demo Detection Convention

Demo brands are identified by the `demo-` slug prefix:
- `isDemoBrand(slug)` — Returns true if slug starts with `demo-`
- `getCategoryFromDemoSlug(slug)` — Extracts category from `demo-{category}` → `{category}`
- `buildDemoSlug(categorySlug)` — Constructs `demo-{categorySlug}`
- `buildDemoEmail(categorySlug)` — Constructs `{categorySlug}@demo.parichay.io`

### API Endpoint

**GET** `/api/demo/microsites`

Query params:
- `?category={slug}` — Filter by industry (optional)

Response:
```json
{
  "success": true,
  "data": [
    {
      "brandId": "...",
      "brandName": "Pinnacle Enterprises",
      "brandSlug": "demo-business-owners",
      "branchSlug": "main",
      "industryCategory": "business-owners",
      "colorTheme": { "primary": "#1E40AF", "secondary": "#3B82F6", "accent": "#60A5FA" },
      "demoUrl": "/demo-business-owners/main"
    }
  ]
}
```

## Testing

### Property-Based Tests (fast-check)

Located in `src/__tests__/demo/`:

| Test File | Properties Tested |
|-----------|------------------|
| `demo-utils.test.ts` | Slug generation, email generation, brand detection, URL resolution |
| `seed-content.test.ts` | Content completeness, layout assignment uniqueness |
| `seed-data.test.ts` | Timestamp bounds, data minimum thresholds |
| `catalog-filter.test.ts` | Search filter correctness |
| `demo-guard.test.ts` | Read-only modification guard |

Run all tests:
```bash
pnpm test
```

### Manual Testing

1. **Seed demo data**: `npx tsx prisma/seed-demo.ts`
2. **Start dev server**: `pnpm dev`
3. **Visit catalog**: http://localhost:3000/demo/industries
4. **Test search**: Type industry name in search box
5. **Visit demo**: Click any card to open the microsite
6. **Verify badge**: Demo banner should appear at top
7. **Test protection**: Login as demo user, try modifying config — should get 403
8. **Test lead form**: Submit a contact form on demo microsite — should succeed

## Troubleshooting

### Demo data not showing
- Ensure `npx tsx prisma/seed-demo.ts` ran successfully
- Check the console output for errors per category
- Verify database connection in `.env`

### "Coming Soon" on all cards
- The seed script may not have run or encountered errors
- Check that brands with `demo-` prefix exist in the database

### DemoBadge not appearing
- The badge only shows on brands with slugs starting with `demo-`
- Ensure the microsite page at `src/app/[brand]/[branch]/page.tsx` imports and checks `isDemoBrand`

### Lead form not working on demo
- Lead submissions are intentionally allowed on demo microsites
- If blocked, check the API guard isn't incorrectly filtering lead endpoints
