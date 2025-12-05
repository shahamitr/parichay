# Project Structure

## Root Directory
```
onetouch-bizcard/
├── src/                    # Source code
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── setup/                  # Setup files (SQL, configs)
└── examples/               # Example configurations
```

## Source Structure (`src/`)

### Application (`src/app/`)
Next.js 14 App Router structure with route groups and API routes.

**Key patterns:**
- `page.tsx`: Route pages
- `layout.tsx`: Shared layouts
- `api/*/route.ts`: API endpoints
- `[brand]/`: Dynamic brand routes
- `dashboard/`: Protected admin area
- `executive/`: Executive portal

### Components (`src/components/`)
Organized by feature/domain:
- `admin/`: Admin-specific components
- `agency/`: White-label/tenant components
- `analytics/`: Analytics dashboards
- `branches/`: Branch management
- `brands/`: Brand management
- `dashboard/`: Dashboard components
- `executive/`: Executive portal components
- `landing/`: Landing page components
- `leads/`: Lead management
- `microsites/`: Microsite builder components
- `navigation/`: Navigation components
- `ui/`: Reusable UI components
- `themes/`: Theme customization

### Library (`src/lib/`)
Core utilities and services:
- `auth.ts`, `auth-context.tsx`: Authentication
- `prisma.ts`: Database client (singleton pattern)
- `jwt.ts`, `jwt-edge.ts`: JWT handling (Node.js and Edge)
- `redis.ts`, `cache.ts`: Caching layer
- `email-service.ts`: Email functionality
- `sms-service.ts`: SMS notifications
- `notification-service.ts`: In-app notifications
- `stripe.ts`, `razorpay.ts`: Payment gateways
- `qrcode-generator.ts`: QR code generation
- `vcard-generator.ts`: vCard generation
- `logger.ts`: Structured logging
- `rate-limiter.ts`: API rate limiting
- `security-headers.ts`: Security middleware
- `theme-context.tsx`, `dark-mode-context.tsx`: Theme management
- `validations.ts`: Zod schemas
- `utils.ts`: General utilities

### Configuration (`src/config/`)
- `design-tokens.ts`: Design system tokens
- `animations.ts`: Animation configurations
- `code-splitting.ts`: Bundle optimization

### Data (`src/data/`)
Static data and configurations:
- `categories.ts`: Industry categories
- `templates.ts`: Microsite templates
- `themes.ts`: Theme presets
- `fonts.ts`: Font configurations

### Types (`src/types/`)
TypeScript type definitions:
- `auth.ts`: Authentication types
- `microsite.ts`: Microsite configuration types
- `subscription.ts`: Subscription types
- `template.ts`: Template types
- `theme.ts`: Theme types

### Middleware (`src/middleware.ts`)
Global middleware for:
- Authentication checks
- Rate limiting
- Custom domain routing
- Security headers
- Correlation ID tracking

## Database (`prisma/`)
- `schema.prisma`: Database schema (MySQL)
- `migrations/`: Migration history
- `seed.ts`: Production seed data
- `seed-demo.ts`: Demo data seeding

**Generated client location:** `src/generated/prisma`

## Key Conventions

### Import Aliases
- `@/*`: Maps to `src/*` (configured in tsconfig.json)

### API Routes
- Pattern: `src/app/api/{resource}/route.ts`
- Use Next.js Route Handlers (not Express)
- Return `NextResponse.json()` for responses

### Authentication
- JWT tokens stored in httpOnly cookies
- Access token: 7 days
- Refresh token: 30 days
- Edge-compatible JWT verification in middleware

### Database Access
- Always use the singleton Prisma client from `src/lib/prisma.ts`
- Never instantiate new PrismaClient instances
- Use transactions for multi-step operations

### Error Handling
- Use structured logging with Pino
- Track errors with Sentry in production
- Return consistent error responses from API routes

### Styling
- Tailwind utility classes (no CSS modules)
- Custom design tokens in `tailwind.config.ts`
- Dark mode via `class` strategy
- Responsive: mobile-first approach

### Component Patterns
- Server Components by default
- Client Components: Use `'use client'` directive
- Async Server Components for data fetching
- Context providers for client-side state
