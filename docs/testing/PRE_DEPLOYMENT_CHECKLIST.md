# Pre-Deployment Testing Checklist

Run this checklist before every production deployment to ensure nothing is broken.

## Quick Commands

```bash
# 1. Run all backend unit tests
pnpm test

# 2. Run E2E tests (requires app running)
pnpm test:e2e

# 3. Type check
pnpm type-check

# 4. Lint
pnpm lint
```

---

## Phase 1: Automated Tests (5 min)

### Backend Unit Tests
```bash
pnpm test
```

Expected: **260+ tests passing**, 0 failures.

| Module | Tests | Covers |
|--------|-------|--------|
| Encryption | 14 | AES-256-GCM encrypt/decrypt, phone encryption, hash for search |
| Bot Protection | 14 | UA detection, honeypot, timing, form validation |
| Rate Limiter | 5 | Blocking, window expiry, independent tracking |
| Subscription Utils | 14 | License keys, dates, grace period, invoices, tax |
| Auth | 6 | Password hashing, JWT structure |
| Feature Registry | 16 | Plan gating, business type defaults, categories |
| Sanitization | 14 | XSS, input cleaning, URL/email/phone validation |
| Audit Trail | 7 | Integrity hashing, tamper detection |
| Request Signing | 9 | Nonce lifecycle, HMAC signing, anti-tampering |

### E2E Tests
```bash
pnpm test:e2e
```

| Test File | Covers |
|-----------|--------|
| `landing-page.spec.ts` | Hero, nav, pricing, FAQ, footer |
| `auth-flow.spec.ts` | Email login, phone OTP, registration |
| `microsite.spec.ts` | Demo pages, profiles, error handling |
| `search-directory.spec.ts` | Search, SEO city pages |
| `onboarding.spec.ts` | Quick card wizard |
| `api-health.spec.ts` | Health check, plans API, auth rejection, bot blocking |

---

## Phase 2: Manual Smoke Tests (10 min)

### Landing Page
- [ ] Homepage loads at `/` without errors
- [ ] All sections visible (Hero, Problem, Demo, How It Works, Features, Industries, Pricing, FAQ, CTA, Footer)
- [ ] "Start Free" button → `/register`
- [ ] Mobile responsive (resize browser to 375px width)
- [ ] Dark pricing card text is readable (white on dark)

### Authentication
- [ ] `/login` — Email/password login works
- [ ] `/login/phone` — Phone OTP flow works (check console for OTP in dev)
- [ ] `/register` — New user registration works
- [ ] `/forgot-password` — Sends reset email (check SMTP or console)
- [ ] After login, redirects to correct dashboard based on role

### Microsite / Demo
- [ ] `/demo-business-owners/main` — Loads with services, gallery, contact
- [ ] `/demo-restaurants-cafes/main` — Restaurant template loads
- [ ] `/demo-healthcare-professionals/main` — Healthcare template loads
- [ ] Business hours show correctly (no NaN)
- [ ] "Call Now" and "WhatsApp" buttons work
- [ ] Contact form submits successfully
- [ ] Review form with captcha works

### Admin Panel
- [ ] `/admin/dashboard` — Shows real stats (not mock data)
- [ ] `/admin/features` — Feature toggles load and save
- [ ] `/admin/subscription` — Shows plans and current subscription
- [ ] `/admin/leads` — Shows leads table

### Search & Directory
- [ ] `/search` — Search page loads with location prompt
- [ ] `/demo/industries` — All industry categories shown
- [ ] `/find/mumbai/dentist` — SEO page renders correctly

### Onboarding
- [ ] `/onboarding` — 3-step wizard works end-to-end
- [ ] Creates brand + branch after completion
- [ ] Shows success with profile URL

### Payments (Test Mode)
- [ ] Razorpay checkout opens when "Subscribe Now" clicked
- [ ] Test payment completes (use Razorpay test card: 4111 1111 1111 1111)
- [ ] Invoice generated after payment
- [ ] Invoice PDF downloads from `/api/invoices/[id]/download`

---

## Phase 3: Security Checks (5 min)

- [ ] Visit `/api/auth/login` with curl — verify rate limiting works after 5 attempts
- [ ] Submit contact form with `website_url` field filled — verify silent rejection
- [ ] Check browser DevTools Network tab — no sensitive data in responses
- [ ] Verify HTTPS redirect works (if SSL configured)
- [ ] Check `X-Frame-Options`, `CSP` headers in browser DevTools → Network → Response Headers

---

## Phase 4: Performance Checks (3 min)

- [ ] Landing page loads in < 3 seconds (check DevTools Performance tab)
- [ ] Lighthouse score > 80 (run in Chrome DevTools → Lighthouse)
- [ ] No console errors on any page
- [ ] Images load (no broken images on microsites)

---

## Phase 5: Database & Infrastructure

- [ ] `GET /api/health` returns `{ status: "healthy" }`
- [ ] Database migrations are applied: `npx prisma db push` exits cleanly
- [ ] Demo data is seeded: `npx tsx prisma/seed-demo.ts`
- [ ] Redis is connected (check health endpoint services.redis)

---

## If a Test Fails

1. **Unit test failure** → Fix the code, re-run `pnpm test`
2. **E2E failure** → Check if the dev server is running, check DB connection
3. **Manual test failure** → Document the issue, fix before deploying
4. **Security test failure** → BLOCK DEPLOYMENT until fixed

---

## Deployment Go/No-Go

| Criteria | Required |
|----------|----------|
| Unit tests pass | ✅ All pass |
| E2E tests pass | ✅ All pass |
| Type check clean | ✅ No errors |
| Manual smoke test | ✅ All checked |
| Security checks | ✅ All pass |
| `/api/health` is healthy | ✅ |

**If all ✅ → Deploy.** If any ❌ → Fix first.
