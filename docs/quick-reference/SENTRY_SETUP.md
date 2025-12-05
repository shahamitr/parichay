# Sentry Error Tracking Setup - Quick Reference

## Sentry Account Setup

### 1. Create Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up with business email
3. Choose plan:
   - Developer (Free): 5K errors/month
   - Team ($26/month): 50K errors/month
   - Business ($80/month): 100K errors/month

### 2. Create Organization

1. Organization name: "OneTouch BizCard"
2. Choose your team size
3. Select primary use case: "Web Application"

### 3. Create Project

1. Click "Create Project"
2. Platform: Next.js
3. Project name: "onetouch-bizcard-production"
4. Alert frequency: "Alert me on every new issue"
5. Click "Create Project"

### 4. Get DSN

After project creation, you'll see:
```
DSN: https://examplePublicKey@o0.ingest.sentry.io/0
```

Save this DSN - you'll need it for configuration.

## Installation

### 1. Install Sentry SDK

```bash
npm install @sentry/nextjs
```

### 2. Run Sentry Wizard

```bash
npx @sentry/wizard@latest -i nextjs
```

This will:
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Update `next.config.js`
- Create `.sentryclirc`

### 3. Environment Variables

```env
# Sentry Configuration
SENTRY_DSN="https://examplePublicKey@o0.ingest.sentry.io/0"
SENTRY_ENVIRONMENT="production"
SENTRY_TRACES_SAMPLE_RATE="0.1"
SENTRY_RELEASE="onetouch-bizcard@1.0.0"

# Sentry Auth Token (for source maps upload)
SENTRY_AUTH_TOKEN="your_auth_token_here"
SENTRY_ORG="onetouch-bizcard"
SENTRY_PROJECT="onetouch-bizcard-production"
```

## Configuration

### 1. Client Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'production',
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Adjust this value in production
  tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1'),

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/onetouchbizcard\.in/],
    }),
  ],

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Filter out sensitive information
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }

    return event;
  },

  // Ignore certain errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Network request failed',
  ],
});
```

### 2. Server Configuration

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'production',
  release: process.env.SENTRY_RELEASE,

  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),

  debug: false,

  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Prisma({ client: prisma }),
  ],

  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
    }

    // Add custom context
    event.contexts = {
      ...event.contexts,
      app: {
        name: 'OneTouch BizCard',
        version: process.env.SENTRY_RELEASE,
      },
    };

    return event;
  },
});
```

### 3. Edge Configuration

```typescript
// sentry.edge.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'production',
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  debug: false,
});
```

### 4. Next.js Configuration

```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // Your existing Next.js config
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload source maps
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
```

## Usage

### 1. Capture Errors

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
  throw new Error('Something went wrong');
} catch (error) {
  Sentry.captureException(error);
  console.error(error);
}
```

### 2. Capture Messages

```typescript
Sentry.captureMessage('User completed onboarding', 'info');
```

### 3. Add Context

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});

Sentry.setContext('brand', {
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
});

Sentry.setTag('payment_gateway', 'stripe');
Sentry.setTag('subscription_plan', 'premium');
```

### 4. Add Breadcrumbs

```typescript
Sentry.addBreadcrumb({
  category: 'payment',
  message: 'Payment initiated',
  level: 'info',
  data: {
    amount: 1000,
    currency: 'INR',
  },
});
```

### 5. Error Boundaries (React)

```typescript
// components/ErrorBoundary.tsx
import * as Sentry from '@sentry/nextjs';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 6. API Route Error Handling

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  try {
    // Your API logic
    const data = await request.json();

    // Process data
    const result = await processData(data);

    return NextResponse.json(result);
  } catch (error) {
    // Capture error with context
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/example',
        method: 'POST',
      },
      extra: {
        requestBody: await request.text(),
      },
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 7. Performance Monitoring

```typescript
import * as Sentry from '@sentry/nextjs';

// Start transaction
const transaction = Sentry.startTransaction({
  op: 'payment',
  name: 'Process Payment',
});

try {
  // Create span for specific operation
  const span = transaction.startChild({
    op: 'stripe.createPaymentIntent',
    description: 'Create Stripe payment intent',
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'inr',
  });

  span.finish();

  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  Sentry.captureException(error);
} finally {
  transaction.finish();
}
```

## Alert Configuration

### 1. Create Alert Rules

1. Go to Alerts → Create Alert
2. Choose alert type:
   - Issues: Alert on new or regressed issues
   - Metric: Alert on error rate, performance, etc.

### 2. Issue Alert Example

```yaml
Alert Name: Critical Errors in Production
Conditions:
  - When: An event is captured
  - If: level equals error
  - And: environment equals production
  - And: tags.priority equals critical
Actions:
  - Send email to: team@onetouchbizcard.in
  - Send Slack notification to: #alerts
  - Create PagerDuty incident
```

### 3. Metric Alert Example

```yaml
Alert Name: High Error Rate
Conditions:
  - When: Error rate
  - Is above: 1%
  - For: 5 minutes
  - In: production environment
Actions:
  - Send email to: team@onetouchbizcard.in
  - Send Slack notification to: #alerts
```

### 4. Performance Alert Example

```yaml
Alert Name: Slow API Response
Conditions:
  - When: P95 response time
  - Is above: 2 seconds
  - For: 10 minutes
  - In: production environment
Actions:
  - Send email to: devops@onetouchbizcard.in
```

## Integration with Slack

### 1. Install Slack Integration

1. Go to Settings → Integrations
2. Search for "Slack"
3. Click "Install"
4. Authorize Sentry to access your Slack workspace
5. Choose channel for notifications (e.g., #alerts)

### 2. Configure Notifications

1. Go to Alerts → Alert Rules
2. Edit alert rule
3. Add action: "Send a Slack notification"
4. Choose channel
5. Customize message format

## Source Maps

### 1. Generate Auth Token

1. Go to Settings → Account → API → Auth Tokens
2. Click "Create New Token"
3. Scopes: `project:releases`, `org:read`
4. Copy token

### 2. Configure Source Maps Upload

```javascript
// next.config.js
const sentryWebpackPluginOptions = {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Upload source maps
  widenClientFileUpload: true,

  // Hide source maps from public
  hideSourceMaps: true,

  // Automatically create releases
  automaticVercelMonitors: true,
};
```

### 3. Manual Source Maps Upload

```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Create release
sentry-cli releases new onetouch-bizcard@1.0.0

# Upload source maps
sentry-cli releases files onetouch-bizcard@1.0.0 upload-sourcemaps .next

# Finalize release
sentry-cli releases finalize onetouch-bizcard@1.0.0
```

## Monitoring Dashboard

### Key Metrics to Monitor

1. **Error Rate**: Should be < 1%
2. **Response Time**: P95 should be < 2 seconds
3. **Crash-Free Sessions**: Should be > 99%
4. **User Impact**: Number of users affected by errors
5. **Release Health**: Compare error rates across releases

### Custom Dashboard

1. Go to Dashboards → Create Dashboard
2. Add widgets:
   - Error rate over time
   - Most common errors
   - Affected users
   - Performance metrics
   - Release comparison

## Best Practices

### 1. Error Grouping

```typescript
// Group similar errors together
Sentry.captureException(error, {
  fingerprint: ['payment-failed', paymentGateway],
});
```

### 2. Sensitive Data Filtering

```typescript
Sentry.init({
  beforeSend(event) {
    // Remove sensitive data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.creditCard;
    }
    return event;
  },
});
```

### 3. Environment Separation

```typescript
// Don't send errors from development
if (process.env.NODE_ENV === 'development') {
  return null;
}
```

### 4. Rate Limiting

```typescript
Sentry.init({
  // Sample 10% of transactions
  tracesSampleRate: 0.1,

  // Sample 10% of sessions for replay
  replaysSessionSampleRate: 0.1,

  // Sample 100% of sessions with errors
  replaysOnErrorSampleRate: 1.0,
});
```

### 5. Context Enrichment

```typescript
// Add custom context to all events
Sentry.configureScope((scope) => {
  scope.setTag('deployment', 'production');
  scope.setContext('server', {
    name: 'web-1',
    region: 'ap-south-1',
  });
});
```

## Troubleshooting

### Events Not Appearing

```bash
# Check DSN is correct
echo $SENTRY_DSN

# Test Sentry connection
npx @sentry/wizard@latest test

# Check network requests in browser DevTools
# Look for requests to sentry.io
```

### Source Maps Not Working

```bash
# Verify source maps are uploaded
sentry-cli releases files onetouch-bizcard@1.0.0 list

# Check release is associated with events
# In Sentry dashboard, check if release appears in event details
```

### Too Many Events

```typescript
// Increase sample rate
Sentry.init({
  tracesSampleRate: 0.01, // Sample 1% instead of 10%
});

// Ignore specific errors
ignoreErrors: [
  'ResizeObserver loop limit exceeded',
  'Non-Error promise rejection captured',
],
```

## Environment Variables Summary

```env
# Required
SENTRY_DSN="https://examplePublicKey@o0.ingest.sentry.io/0"
SENTRY_ENVIRONMENT="production"

# Optional but recommended
SENTRY_TRACES_SAMPLE_RATE="0.1"
SENTRY_RELEASE="onetouch-bizcard@1.0.0"

# For source maps upload
SENTRY_AUTH_TOKEN="your_auth_token"
SENTRY_ORG="onetouch-bizcard"
SENTRY_PROJECT="onetouch-bizcard-production"

# Public (exposed to client)
NEXT_PUBLIC_SENTRY_DSN="https://examplePublicKey@o0.ingest.sentry.io/0"
NEXT_PUBLIC_SENTRY_ENVIRONMENT="production"
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE="0.1"
NEXT_PUBLIC_SENTRY_RELEASE="onetouch-bizcard@1.0.0"
```

## Testing

```typescript
// Test error capture
Sentry.captureException(new Error('Test error'));

// Test message capture
Sentry.captureMessage('Test message', 'info');

// Trigger error in UI
throw new Error('Test UI error');
```

Check Sentry dashboard to verify events are received.
