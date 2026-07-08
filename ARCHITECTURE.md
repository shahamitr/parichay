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
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Next.js App (SSR)      │
                    │   Port 3000              │
                    │   ├── App Router         │
                    │   ├── API Routes         │
                    │   ├── Middleware          │
                    │   └── Static Assets      │
                    └───┬────────────────┬────┘
                        │                │
           ┌────────────▼──┐    ┌───────▼───────┐
           │  PostgreSQL 16 │    │   Redis 7     │
           │  Port 5432     │    │   Port 6379   │
           │  (Prisma ORM)  │    │   (Cache/OTP) │
           └───────────────┘    └───────────────┘
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
