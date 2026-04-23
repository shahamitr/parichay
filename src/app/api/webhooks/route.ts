import { NextRequest, NextResponse } from 'next/server';

// Mock webhook data
const mockWebhooks = [
  {
    id: '1',
    name: 'Lead Notifications',
    url: 'https://example.com/webhooks/leads',
    events: ['lead.created', 'lead.updated'],
    isActive: true,
    totalDeliveries: 156,
    successfulDeliveries: 152,
    failedDeliveries: 4,
    lastDeliveryAt: '2024-01-18T10:30:00Z',
    secret: 'whsec_1234567890abcdef'
  },
  {
    id: '2',
    name: 'Payment Alerts',
    url: 'https://example.com/webhooks/payments',
    events: ['payment.completed', 'payment.failed'],
    isActive: false,
    totalDeliveries: 89,
    successfulDeliveries: 87,
    failedDeliveries: 2,
    lastDeliveryAt: '2024-01-17T14:15:00Z',
    secret: 'whsec_abcdef1234567890'
  }
];

const availableEvents = [
  { type: 'lead.created', label: 'Lead Created', description: 'When a new lead is generated' },
  { type: 'lead.updated', label: 'Lead Updated', description: 'When lead status changes' },
  { type: 'payment.completed', label: 'Payment Completed', description: 'When payment is successful' },
  { type: 'payment.failed', label: 'Payment Failed', description: 'When payment fails' },
  { type: 'user.registered', label: 'User Registered', description: 'When new user signs up' },
  { type: 'subscription.created', label: 'Subscription Created', description: 'When subscription starts' },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      webhooks: mockWebhooks,
      availableEvents
    });
  } catch (error) {
    console.error('Failed to fetch webhooks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, events } = body;

    // Generate a webhook secret
    const secret = 'whsec_' + Math.random().toString(36).substring(2, 18);

    const newWebhook = {
      id: Date.now().toString(),
      name,
      url,
      events,
      isActive: true,
      totalDeliveries: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
      lastDeliveryAt: null,
      secret
    };

    // In a real app, you would save to database
    // const webhook = await db.webhook.create({
    //   data: {
    //     name,
    //     url,
    //     events,
    //     secret,
    //     isActive: true
    //   }
    // });

    return NextResponse.json({
      success: true,
      webhook: newWebhook
    });
  } catch (error) {
    console.error('Failed to create webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create webhook' },
      { status: 500 }
    );
  }
}