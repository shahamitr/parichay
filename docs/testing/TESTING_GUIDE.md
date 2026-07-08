# Testing Guide

## Overview

Parichay uses a 3-layer testing strategy:

| Layer | Tool | Location | Command |
|-------|------|----------|---------|
| Unit Tests | Vitest | `src/__tests__/` | `pnpm test` |
| Component Tests | Vitest + Testing Library | `src/__tests__/components/` | `pnpm test` |
| E2E Tests | Playwright | `e2e/` | `pnpm test:e2e` |

---

## Running Tests

### All Unit + Component Tests
```bash
pnpm test           # Run once
pnpm test:watch     # Watch mode (re-runs on save)
```

### Single Test File
```bash
npx vitest run src/__tests__/lib/encryption.test.ts
```

### E2E Tests
```bash
# Start the app first (in another terminal)
pnpm dev

# Run E2E tests
pnpm test:e2e

# Run with UI (visual debugger)
pnpm test:e2e:ui
```

### Type Checking (no tests, just validates types)
```bash
pnpm type-check
```

---

## Test Structure

```
src/__tests__/
├── lib/                      # Backend utility tests
│   ├── encryption.test.ts    # AES-256-GCM encryption module
│   ├── bot-protection.test.ts # Bot detection & honeypot
│   ├── rate-limiter.test.ts  # Rate limiting logic
│   ├── subscription-utils.test.ts # Subscription lifecycle
│   ├── auth.test.ts          # Password hashing & JWT
│   ├── feature-registry.test.ts # Feature toggle config
│   ├── sanitization.test.ts  # Input sanitization & XSS
│   ├── audit-trail.test.ts   # Data integrity hashing
│   └── request-signing.test.ts # HMAC request signing
├── components/               # UI component tests
│   ├── MathCaptcha.test.tsx
│   ├── HoneypotField.test.tsx
│   └── Badge.test.tsx
└── demo/                     # Demo data tests
    ├── seed-data.test.ts
    ├── demo-utils.test.ts
    └── ...

e2e/                          # End-to-end browser tests
├── landing-page.spec.ts      # Homepage & landing sections
├── auth-flow.spec.ts         # Login, registration, OTP
├── microsite.spec.ts         # Demo microsites & error pages
├── search-directory.spec.ts  # Search & SEO city pages
├── onboarding.spec.ts        # Quick card wizard
├── api-health.spec.ts        # API endpoint validation
├── admin-panel.spec.ts       # Admin panel flows
├── payment-flow.spec.ts      # Subscription & payment
└── security.spec.ts          # Security headers & CORS
```

---

## Writing New Tests

### Unit Test Template
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/my-module';

describe('Module Name', () => {
  describe('myFunction', () => {
    it('should do X when given Y', () => {
      const result = myFunction(input);
      expect(result).toBe(expected);
    });

    it('should handle edge case', () => {
      expect(myFunction(null)).toBe(null);
    });
  });
});
```

### Component Test Template
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render content', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle click', () => {
    const onClick = vi.fn();
    render(<MyComponent onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do X', async ({ page }) => {
    await page.goto('/path');
    await expect(page.locator('text=Expected')).toBeVisible();
  });
});
```

---

## Coverage Goals

| Area | Target | Current |
|------|--------|---------|
| Security modules | 95% | ~95% |
| Business logic | 85% | ~85% |
| API endpoints (E2E) | 80% | ~80% |
| UI components | 60% | ~40% (growing) |

---

## CI/CD Integration

Tests run automatically on every `git push` via GitHub Actions:

```yaml
# .github/workflows/test.yml
- pnpm test (unit + component)
- pnpm type-check
- pnpm lint
```

E2E tests run on PR creation (not every push, to save CI minutes).

---

## Debugging Failed Tests

### Unit Test Fails
```bash
# Run with verbose output
npx vitest run --reporter=verbose path/to/test.ts

# Run single test
npx vitest run -t "should do X"
```

### E2E Test Fails
```bash
# Run with headed browser (see what's happening)
npx playwright test --headed e2e/auth-flow.spec.ts

# Show trace after failure
npx playwright show-trace test-results/auth-flow-spec-ts/trace.zip
```

### Common Issues
- **"Cannot find module"** → Run `pnpm prisma generate` (regenerates Prisma client)
- **"ECONNREFUSED"** → Start Docker containers: `docker compose -f docker-compose.dev.yml up -d`
- **E2E timeout** → Increase timeout in `playwright.config.ts` or check if dev server is running
