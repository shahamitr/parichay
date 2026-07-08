# Contributing to Parichay

## Development Setup

```bash
# Clone the repo
git clone https://github.com/your-org/parichay.git
cd parichay

# Start dev environment (PostgreSQL + Redis + Next.js with hot reload)
./dev.sh        # Mac/Linux
dev.bat         # Windows

# Or manually:
docker compose up -d            # Start DB + Redis
pnpm install                    # Install dependencies
npx prisma db push              # Create tables
npx tsx prisma/seed-demo.ts     # Seed demo data
pnpm dev                        # Start dev server at http://localhost:3000
```

## Branch Strategy

- `main` — Production (auto-deploys via GitHub Actions)
- `feature/*` — New features
- `fix/*` — Bug fixes
- `hotfix/*` — Urgent production fixes

## Before Submitting a PR

```bash
pnpm test           # Unit tests pass
pnpm type-check     # No TypeScript errors
pnpm lint           # No lint errors
```

## Code Standards

- TypeScript strict mode (no `any` without justification)
- Tailwind CSS for styling (no inline styles, no custom CSS unless necessary)
- Prisma for all database operations (no raw SQL in app code)
- Zod for input validation on all API routes
- Server Components by default; `'use client'` only when needed
- Error boundaries on every route segment

## Adding a New Feature

1. Create the API route in `src/app/api/`
2. Add input validation with Zod schema
3. Use `withApiHandler` or `withErrorHandler` for error handling
4. Add bot protection for public endpoints
5. Add rate limiting for sensitive endpoints
6. Write tests in `src/__tests__/`
7. Update `docs/` if user-facing

## Adding a New Microsite Section

1. Create component in `src/components/microsites/sections/`
2. Register in `src/lib/feature-registry.ts`
3. Add to `MicrositeRenderer.tsx` section render map
4. Set default-enabled business types
5. Set required plan tier
