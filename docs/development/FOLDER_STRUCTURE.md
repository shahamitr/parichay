# 📁 Zintro Folder Structure

**Platform**: Zintro - Your smart digital introduction
**Date**: October 29, 2025

---

## 🏗️ Complete Project Structure

```
zintro/
├── 📁 .git/                           # Git


---

## 🎯 Industry Demo Samples Architecture (Added June 2026)

```
parichay/
├── prisma/
│   ├── seed-demo.ts              # Demo seed script (creates 11 industry demos)
│   └── demo-content.ts           # Industry-specific content generator
│
├── src/
│   ├── lib/
│   │   └── demo-utils.ts         # Demo detection utilities (isDemoBrand, buildDemoSlug, etc.)
│   │
│   ├── data/
│   │   ├── categories.ts         # 11 industry categories with demoUrl fields
│   │   ├── industry-templates.ts # Template content (healthcare, restaurant, fitness, beauty)
│   │   └── layout-options.ts     # 15 layout configurations
│   │
│   ├── app/
│   │   ├── demo/
│   │   │   └── industries/
│   │   │       └── page.tsx      # Demo Catalog page (Server Component)
│   │   ├── api/
│   │   │   └── demo/
│   │   │       └── microsites/
│   │   │           └── route.ts  # GET /api/demo/microsites endpoint
│   │   └── [brand]/
│   │       └── [branch]/
│   │           └── page.tsx      # Microsite page (injects DemoBadge for demo brands)
│   │
│   ├── components/
│   │   ├── demo/
│   │   │   └── IndustryCatalogGrid.tsx  # Catalog grid with search filter
│   │   └── microsites/
│   │       └── DemoBadge.tsx            # Demo preview banner
│   │
│   └── __tests__/
│       └── demo/
│           ├── demo-utils.test.ts       # Properties 1, 2, 4, 6
│           ├── seed-content.test.ts     # Properties 3, 4 (unit)
│           ├── seed-data.test.ts        # Property 7 + data thresholds
│           ├── catalog-filter.test.ts   # Property 5
│           └── demo-guard.test.ts       # Property 8
```

### Key Design Decisions

- **No schema changes** — Demo data uses existing Brand, Branch, User, Lead, AnalyticsEvent, QRCode models
- **Convention-based detection** — Demo brands identified by `demo-` slug prefix
- **Lazy-loaded dependencies** — PrismaClient in seed-demo.ts is lazy-loaded so tests can import static maps
- **Separate content module** — `prisma/demo-content.ts` is decoupled from seed orchestration
- **Server-side catalog** — Demo Catalog page is a Next.js Server Component (no client-side data fetching)
