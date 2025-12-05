# Payment Gateways Setup - Quick Reference

## Stripe Setup

### 1. Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Sign up with business email
3. Complete business verification
4. Activate your account

### 2. Get API Keys

#### Test Mode Keys (for development)
1. Go to Developers → API keys
2. Copy Publishable key: `pk_test_...`
3. Copy Secret key: `sk_test_...`

#### Live Mode Keys (for production)
1. Toggle to "Live mode" in dashboard
2. Go to Developers → API keys
3. Copy Publishable key: `pk_live_...`
4. Copy Secret key: `sk_live_...`
5. **Important**: Keep secret key secure, never expose in client-side code

### 3. Configure Webhooks

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://onetouchbizcard.in/api/webhooks/stripe`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `charge.refunded`
5. Click "Add endpoint"
6. Copy webhook signing secret: `whsec_...`

### 4. Test Webhooks Locally

```bash
# Install Stripe CLI
# Windows (using Scoop)
scoop install stripe

# Or download from https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger customer.subscription.created
```

### 5. Environment Variables

```env
# Test Mode
STRIPE_PUBLIC_KEY="pk_test_51..."
STRIPE_SECRET_KEY="sk_test_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Production Mode
STRIPE_PUBLIC_KEY="pk_live_51..."
STRIPE_SECRET_KEY="sk_live_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 6. Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

### 7. Stripe Integration Code

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export async function createPaymentIntent(
  amount: number,
  currency: string = 'inr',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to smallest currency unit
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata,
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
}

export async function createCustomer(
  email: string,
  name: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

export default stripe;
```

### 8. Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const event = await verifyWebhookSignature(body, signature);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionCancellation(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handleInvoicePayment(invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
```

### 9. Test Cards

```
# Successful payment
4242 4242 4242 4242

# Requires authentication (3D Secure)
4000 0025 0000 3155

# Declined card
4000 0000 0000 9995

# Insufficient funds
4000 0000 0000 9995

# Expired card
4000 0000 0000 0069

# Use any future expiry date, any 3-digit CVC, any postal code
```

---

## Razorpay Setup

### 1. Create Razorpay Account

1. Go to https://dashboard.razorpay.com/signup
2. Sign up with business email
3. Complete KYC verification
4. Submit business documents

### 2. Get API Keys

#### Test Mode Keys
1. Go to Settings → API Keys
2. Click "Generate Test Keys"
3. Copy Key ID: `rzp_test_...`
4. Copy Key Secret

#### Live Mode Keys
1. Complete KYC and account activation
2. Go to Settings → API Keys
3. Click "Generate Live Keys"
4. Copy Key ID: `rzp_live_...`
5. Copy Key Secret
6. **Important**: Keep secret key secure

### 3. Configure Webhooks

1. Go to Settings → Webhooks
2. Click "Add New Webhook"
3. Webhook URL: `https://onetouchbizcard.in/api/webhooks/razorpay`
4. Secret: Generate strong secret (save it)
5. Select events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.cancelled`
   - `subscription.completed`
   - `subscription.paused`
   - `subscription.resumed`
6. Click "Create Webhook"

### 4. Environment Variables

```env
# Test Mode
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="test_secret_key"
RAZORPAY_WEBHOOK_SECRET="webhook_secret"

# Production Mode
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="live_secret_key"
RAZORPAY_WEBHOOK_SECRET="webhook_secret"
```

### 5. Install Razorpay SDK

```bash
npm install razorpay
```

### 6. Razorpay Integration Code

```typescript
// lib/razorpay.ts
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(
  amount: number,
  currency: string = 'INR',
  receipt: string,
  notes: Record<string, string> = {}
): Promise<any> {
  return await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency,
    receipt,
    notes,
  });
}

export async function createSubscription(
  planId: string,
  totalCount: number,
  customerId: string,
  notes: Record<string, string> = {}
): Promise<any> {
  return await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: totalCount,
    customer_notify: 1,
    notes,
  });
}

export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const text = `${orderId}|${paymentId}`;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex');

  return generated_signature === signature;
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');

  return generated_signature === signature;
}

export async function capturePayment(
  paymentId: string,
  amount: number,
  currency: string = 'INR'
): Promise<any> {
  return await razorpay.payments.capture(paymentId, amount * 100, currency);
}

export default razorpay;
```

### 7. Webhook Handler

```typescript
// app/api/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const isValid = await verifyWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(event.payload.payment.entity);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;

      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity);
        break;

      case 'subscription.charged':
        await handleSubscriptionCharged(event.payload.subscription.entity);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
```

### 8. Frontend Integration

```typescript
// components/RazorpayCheckout.tsx
'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayCheckout({ orderId, amount, onSuccess, onFailure }: any) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'OneTouch BizCard',
      description: 'Subscription Payment',
      order_id: orderId,
      handler: function (response: any) {
        onSuccess(response);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response: any) {
      onFailure(response);
    });
    razorpay.open();
  };

  return (
    <button onClick={handlePayment} className="btn btn-primary">
      Pay Now
    </button>
  );
}
```

### 9. Test Cards

```
# Successful payment
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date

# Failed payment
Card: 4111 1111 1111 1234
CVV: Any 3 digits
Expiry: Any future date

# 3D Secure authentication
Card: 5104 0600 0000 0008
CVV: Any 3 digits
Expiry: Any future date
OTP: 1234
```

---

## Common Payment Flows

### One-Time Payment Flow

```typescript
// 1. Create payment intent/order
const paymentIntent = await createPaymentIntent(amount, 'inr', {
  brandId: brand.id,
  subscriptionId: subscription.id,
});

// 2. Send client secret to frontend
return { clientSecret: paymentIntent.client_secret };

// 3. Frontend completes payment
// 4. Webhook receives payment.succeeded event
// 5. Update subscription status in database
```

### Subscription Flow

```typescript
// 1. Create customer
const customer = await createCustomer(email, name);

// 2. Create subscription
const subscription = await createSubscription(customer.id, priceId);

// 3. Send client secret to frontend
return { clientSecret: subscription.latest_invoice.payment_intent.client_secret };

// 4. Frontend completes payment
// 5. Webhook receives subscription.created event
// 6. Store subscription in database
```

## Monitoring and Testing

### Stripe Dashboard
- View all payments: https://dashboard.stripe.com/payments
- View subscriptions: https://dashboard.stripe.com/subscriptions
- View webhooks: https://dashboard.stripe.com/webhooks
- View logs: https://dashboard.stripe.com/logs

### Razorpay Dashboard
- View all payments: https://dashboard.razorpay.com/app/payments
- View subscriptions: https://dashboard.razorpay.com/app/subscriptions
- View webhooks: https://dashboard.razorpay.com/app/webhooks
- View logs: https://dashboard.razorpay.com/app/logs

## Security Best Practices

1. **Never expose secret keys**: Keep secret keys server-side only
2. **Verify webhook signatures**: Always verify webhook signatures
3. **Use HTTPS**: Only accept webhooks over HTTPS
4. **Validate amounts**: Always validate payment amounts server-side
5. **Idempotency**: Handle duplicate webhook events gracefully
6. **Log everything**: Log all payment events for audit trail
7. **Monitor failures**: Set up alerts for payment failures
8. **PCI compliance**: Never store card details on your server
9. **Test thoroughly**: Test all payment scenarios before going live
10. **Handle errors**: Implement proper error handling and user feedback

## Troubleshooting

### Webhook Not Receiving Events

```bash
# Check webhook endpoint is accessible
curl -X POST https://onetouchbizcard.in/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check webhook logs in dashboard
# Stripe: https://dashboard.stripe.com/webhooks
# Razorpay: https://dashboard.razorpay.com/app/webhooks

# Test webhook locally with CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Payment Failures

```typescript
// Log payment errors
console.error('Payment failed:', {
  paymentId: payment.id,
  error: payment.last_payment_error,
  amount: payment.amount,
  currency: payment.currency,
});

// Notify user
await sendEmail({
  to: user.email,
  subject: 'Payment Failed',
  body: 'Your payment could not be processed. Please try again.',
});
```

### Signature Verification Failures

```typescript
// Ensure you're using raw body
const body = await request.text(); // Not request.json()

// Check webhook secret is correct
console.log('Webhook secret:', process.env.STRIPE_WEBHOOK_SECRET);

// Verify signature manually
const signature = headers().get('stripe-signature');
console.log('Signature:', signature);
```
