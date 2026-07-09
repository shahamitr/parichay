# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Nginx (SSL + Proxy)    │
                    │   Port 80/443            │
                    │   • Rate limiting        │
                    │   • Gzip compression     │
                    │   • Static asset caching │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Next.js App (SSR)      │
                    │   Port 3000              │
                    │   ├── App Router         │
                    │   ├── API Routes (60+)   │
                    │   ├── Middleware          │
                    │   │   ├── Bot detection  │
                    │   │   ├── Auth (JWT)     │
                    │   │   ├── RBAC           │
                    │   │   └── CSP headers    │
                    │   └── Static Assets      │
                    └───┬────────────────┬────┘
                        │                │
           ┌────────────▼──┐    ┌───────▼───────┐
           │  PostgreSQL 16 │    │   Redis 7     │
           │  Port 5432     │    │   Port 6379   │
           │  ├── 30+ tables│    │   ├── Cache   │
           │  ├── Prisma ORM│    │   ├── OTP     │
           │  └── Encrypted │    │   ├── Rate    │
           │      PII fields│    │   │   limits  │
           └───────────────┘    │   └── Nonces  │
                                └───────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16, React 18, Tailwind CSS | Server-rendered UI |
| Animation | Framer Motion | Page transitions, micro-interactions |
| State | Zustand + React Query + Context | Client/server state management |
| Backend | Next.js API Routes | REST API endpoints |
| ORM | Prisma 5 | Type-safe database queries |
| Database | PostgreSQL 16 | Primary data store |
| Cache | Redis 7 (ioredis) | Sessions, rate limiting, feature flags |
| Auth | JWT (jsonwebtoken) + bcryptjs | Stateless auth with HTTP-only cookies |
| Payments | Razorpay + Stripe | Payment processing |
| Email | Nodemailer (SMTP) | Transactional emails |
| SMS | Twilio | OTP, reminders |
| Storage | AWS S3 | File uploads |
| Security | AES-256-GCM, HMAC, CSP | Encryption, signing, headers |

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # 404 page
│   ├── middleware.ts       # Auth, bot detection, security headers
│   ├── login/              # Auth pages
│   ├── register/
│   ├── admin/              # Admin panel (protected)
│   ├── [brand]/[branch]/   # Dynamic microsites
│   ├── find/[city]/[cat]/  # SEO city pages
│   ├── api/                # REST API endpoints
│   │   ├── auth/           # Login, register, OTP, token refresh
│   │   ├── leads/          # Lead capture + notifications
│   │   ├── analytics/      # Tracking, actions, dashboard
│   │   ├── payments/       # Razorpay, Stripe
│   │   ├── subscriptions/  # Plans, trials, renewals
│   │   ├── search/         # Directory, nearby, categories
│   │   ├── cron/           # Scheduled jobs
│   │   └── ...
│   └── ...
├── components/
│   ├── ui/                 # Design system (Button, Card, Badge, Dialog, etc.)
│   ├── microsites/         # Microsite renderer + 30+ sections
│   ├── landing/sections/   # Landing page sections
│   ├── admin/              # Admin panel components
│   ├── auth/               # Auth components (PhoneLogin, etc.)
│   └── layout/             # Layout wrappers
├── lib/                    # Server utilities
│   ├── auth.ts             # Password hashing, JWT generation
│   ├── auth-utils.ts       # Token verification, role guards
│   ├── prisma.ts           # Database client singleton
│   ├── cache.ts            # Redis + memory cache layer
│   ├── encryption.ts       # AES-256-GCM field encryption
│   ├── bot-protection.ts   # Bot detection, honeypot, timing
│   ├── rate-limiter.ts     # Redis-backed rate limiting
│   ├── request-signing.ts  # HMAC nonce-based request signing
│   ├── audit-trail.ts      # Security event logging
│   ├── email-service.ts    # SMTP email delivery
│   ├── whatsapp-notify.ts  # Twilio WhatsApp notifications
│   ├── razorpay.ts         # Payment gateway
│   ├── invoice-generator.ts # PDF invoice generation
│   ├── feature-registry.ts # Feature toggle config
│   ├── response-time.ts    # Response badge calculation
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── useBotProtection.ts # Client-side bot defense
│   ├── useRequestSigning.ts # Client-side HMAC signing
│   ├── useDataTable.ts     # Paginated data fetching
│   └── ...
├── types/                  # TypeScript interfaces
└── data/                   # Static data (categories, templates)

deploy/                     # Production deployment
├── nginx/                  # Reverse proxy config
├── postgres/               # DB initialization
└── scripts/                # EC2 setup, backup

prisma/
├── schema.prisma           # Database schema (PostgreSQL)
├── seed.ts                 # Production seed
├── seed-demo.ts            # Demo industry data
└── migrations/             # Schema migrations

e2e/                        # Playwright E2E tests
.github/workflows/          # CI/CD (auto-deploy on push)
```

## Security Architecture

```
Request → Middleware (bot detection + security headers + auth injection)
       → Rate Limiter (Redis-backed, per-IP/user)
       → Bot Protection (UA + honeypot + timing + captcha)
       → API Handler (auth check + role guard + error handling)
       → Encryption (PII encrypted at rest, AES-256-GCM)
       → Audit Trail (all sensitive actions logged with integrity hash)
```

## Data Flow: Lead Capture

```
Customer fills contact form on microsite
  ↓
Client-side: honeypot + timing + captcha validation
  ↓
POST /api/leads (server-side bot check + rate limit)
  ↓
Lead saved to PostgreSQL (phone encrypted)
  ↓
Analytics event created (LEAD_SUBMIT)
  ↓ (parallel, non-blocking)
Email notification → business owner
WhatsApp notification → business owner's phone
  ↓
Response badge recalculated on next request
```

## Data Flow: Payment

```
User clicks "Subscribe" → POST /api/payments/razorpay/create-order
  ↓ (signed request)
Razorpay order created with plan + voucher metadata
  ↓
Razorpay Checkout modal opens (client-side)
  ↓
Payment completed → POST /api/payments/razorpay/verify
  ↓
Signature verified → Amount verified → Transaction committed:
  - Subscription created/upgraded
  - Payment record saved
  - Invoice generated (with GST)
  - Voucher usage incremented
  - Notification created
  - Audit event logged
  ↓
Response: subscription + invoice download URL
```


## UX Component System

### Design Primitives (`src/components/ui/`)

| Component | Purpose | Usage Pattern |
|-----------|---------|---------------|
| `Button` | Primary actions | Variants: primary, secondary, danger |
| `Card` | Content containers | With header, footer, hover effects |
| `Badge` | Status indicators | success, warning, error, info |
| `Dialog` | Modal confirmations | Escape-close, backdrop, body-scroll-lock |
| `Tabs` | Section navigation | Underline or pills variant |
| `Switch` | Toggle on/off | Accessible role="switch" |
| `DatePicker` | Date selection | Calendar dropdown, min/max, today button |
| `TimePicker` | Time selection | 15-min intervals, 12h display |
| `DragDropList` | Reorderable lists | Services, sections, menu items |
| `Skeleton` | Loading states | Text, circle, rect, card patterns |
| `EmptyState` | No-data messaging | Icon + title + description + action |
| `HoneypotField` | Bot prevention | Hidden field for form protection |
| `MathCaptcha` | Human verification | Arithmetic challenge |

### Interaction Patterns

- **Drag-and-drop**: Services reordering, section ordering in microsite builder
- **Calendar pickers**: Appointment booking, offer validity dates
- **Time pickers**: Business hours, appointment slots
- **Auto-save**: Edit pages save on blur/change with debounce
- **Optimistic updates**: UI updates immediately, reverts on API failure
- **Progressive disclosure**: Complex forms split into steps (onboarding wizard)
- **Skeleton loading**: Every data-fetching page shows structure while loading

## User Roles & Flows

### Role Hierarchy

```
SUPER_ADMIN
  ├── Full system access
  ├── User management (CRUD, bulk actions)
  ├── Verification queue
  ├── Announcements
  ├── Database console
  └── All brands/branches

BRAND_MANAGER
  ├── Own brand management
  ├── All branches under brand
  ├── Subscription management
  ├── Lead management
  └── Analytics

BUSINESS_OWNER (self-serve)
  ├── Edit own profile
  ├── View own leads
  ├── Reply to reviews
  ├── Share profile
  ├── View analytics
  └── Manage subscription

BRANCH_ADMIN
  ├── Edit assigned branch
  ├── View branch leads
  └── Branch analytics

EXECUTIVE
  ├── Onboard new businesses
  └── View onboarded stats

CUSTOMER
  ├── View business profiles
  ├── Submit reviews
  ├── Save favorites
  └── Book appointments
```

### Critical User Flows

**New Business Onboarding (60 seconds)**
```
Register (email/phone) → Onboarding wizard (3 steps) → AI generates content → Profile live
```

**Lead Capture → Notification**
```
Customer visits microsite → Fills contact form → Lead saved (encrypted) → Email + WhatsApp notification to owner
```

**Payment & Subscription**
```
Choose plan → Razorpay checkout → Signature verified → Subscription activated → Invoice PDF generated → Email sent
```

**Review Lifecycle**
```
Customer writes review → Pending moderation → Owner approves/rejects → Published on microsite → Owner can reply
```

## API Design Patterns

### Standard Response Shapes

```typescript
// Success
{ success: true, data: {...} }
{ success: true, message: "Action completed" }

// Error
{ error: "Human-readable message", correlationId: "abc123" }
{ error: "Validation error", details: [...zodErrors] }

// List
{ items: [...], total: 100, page: 1, totalPages: 5 }
```

### Middleware Chain (per request)

```
1. Bot detection (UA check)
2. Security headers (CSP, HSTS, etc.)
3. Auth context injection (x-user-id, x-user-role headers)
4. Route-level: Rate limiting → Auth check → Role guard → Handler
5. Response: Correlation ID → Cache headers
```

### Error Handling Strategy

```
API Route → try/catch → handleError()
  ├── ZodError → 400 with field details
  ├── Auth errors → 401/403
  ├── DB connection → 503
  ├── Known AppError → status from error
  └── Unknown → 500 with correlationId (stack only in dev)

Page → error.tsx boundary → user-friendly message + retry button
Global → global-error.tsx → renders own <html> (last resort)
```

## Database Schema Highlights

### Key Models (30+ total)

| Model | Records | Purpose |
|-------|---------|---------|
| User | Multi-role | Auth, profiles, team management |
| Brand | Multi-tenant | Business identity (1 brand = 1 business) |
| Branch | Location | Physical location with microsite config |
| Lead | CRM | Customer enquiries from microsites |
| Review | Trust | Star ratings + text + photo + business reply |
| Subscription | Billing | Plans, trials, payments, invoices |
| AnalyticsEvent | Tracking | Views, clicks, calls, searches |
| AuditLog | Security | Every sensitive action logged |
| Notification | Engagement | System alerts, lead notifications |
| QRCode | Distribution | Generated QR codes with scan tracking |

### Data Privacy

- Phone numbers: AES-256-GCM encrypted at rest
- Passwords: bcrypt (12 rounds)
- JWT tokens: HTTP-only, secure, SameSite cookies
- PII: searchable via deterministic HMAC hash (no plaintext index)
- Audit: integrity hash on sensitive records (tamper detection)
