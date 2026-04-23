/**
 * Webhook Service
 * Handles webhook registration, delivery, and retry logic
 */

import { prisma } from './prisma';
import crypto from 'crypto';

// Webhook event types
export type WebhookEventType =
  | 'lead.created'
  | 'lead.updated'
  | 'lead.converted'
  | 'lead.deleted'
  | 'branch.created'
  | 'branch.updated'
  | 'qrcode.scanned'
  | 'form.submitted'
  | 'subscription.created'
  | 'subscription.renewed'
  | 'subscription.cancelled';

export const WEBHOOK_EVENTS: { type: WebhookEventType; label: string; description: string }[] = [
  { type: 'lead.created', label: 'Lead Created', description: 'When a new lead is created' },
  { type: 'lead.updated', label: 'Lead Updated', description: 'When a lead is updated' },
  { type: 'lead.converted', label: 'Lead Converted', description: 'When a lead is converted' },
  { type: 'lead.deleted', label: 'Lead Deleted', description: 'When a lead is deleted' },
  { type: 'branch.created', label: 'Branch Created', description: 'When a new branch is created' },
  { type: 'branch.updated', label: 'Branch Updated', description: 'When a branch is updated' },
  { type: 'qrcode.scanned', label: 'QR Code Scanned', description: 'When a QR code is scanned' },
  { type: 'form.submitted', label: 'Form Submitted', description: 'When a form is submitted' },
  { type: 'subscription.created', label: 'Subscription Created', description: 'When a subscription is created' },
  { type: 'subscription.renewed', label: 'Subscription Renewed', description: 'When a subscription is renewed' },
  { type: 'subscription.cancelled', label: 'Subscription Cancelled', description: 'When a subscription is cancelled' },
];

interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: any;
}

export class WebhookService {
  /**
   * Generate a secure webhook secret
   */
  static generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Sign a webhook payload
   */
  static signPayload(payload: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Verify a webhook signature
   */
  static verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = WebhookService.signPayload(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Dispatch an event to all registered webhooks
   */
  static async dispatch(
    eventType: WebhookEventType,
    data: any,
    options?: { brandId?: string; branchId?: string }
  ): Promise<void> {
    // Find all active webhooks listening for this event
    const webhooks = await prisma.webhook.findMany({
      where: {
        isActive: true,
        ...(options?.brandId && { brandId: options.brandId }),
        ...(options?.branchId && { branchId: options.branchId }),
      },
    });

    // Filter webhooks that are subscribed to this event
    const matchingWebhooks = webhooks.filter((webhook) => {
      const events = webhook.events as string[];
      return events.includes(eventType) || events.includes('*');
    });

    // Dispatch to all matching webhooks
    const deliveryPromises = matchingWebhooks.map((webhook) =>
      WebhookService.deliver(webhook.id, eventType, data)
    );

    // Fire and forget - don't wait for deliveries
    Promise.allSettled(deliveryPromises).catch((error) => {
      console.error('Webhook dispatch error:', error);
    });
  }

  /**
   * Deliver a webhook payload to a specific webhook
   */
  static async deliver(
    webhookId: string,
    eventType: WebhookEventType,
    data: any,
    attemptNumber: number = 1
  ): Promise<boolean> {
    const webhook = await prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook || !webhook.isActive) {
      return false;
    }

    const payload: WebhookPayload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data,
    };

    const payloadString = JSON.stringify(payload);
    const signature = WebhookService.signPayload(payloadString, webhook.secret);

    // Create delivery record
    const delivery = await prisma.webhookDelivery.create({
      data: {
        webhookId,
        eventType,
        payload,
        status: 'PENDING',
        attemptNumber,
      },
    });

    try {
      // Build headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': eventType,
        'X-Webhook-Delivery-Id': delivery.id,
        ...((webhook.headers as Record<string, string>) || {}),
      };

      // Make the HTTP request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), webhook.timeoutMs);

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: payloadString,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseBody = await response.text().catch(() => '');

      if (response.ok) {
        // Success
        await prisma.$transaction([
          prisma.webhookDelivery.update({
            where: { id: delivery.id },
            data: {
              status: 'SUCCESS',
              responseCode: response.status,
              responseBody: responseBody.substring(0, 5000),
              deliveredAt: new Date(),
            },
          }),
          prisma.webhook.update({
            where: { id: webhookId },
            data: {
              totalDeliveries: { increment: 1 },
              successfulDeliveries: { increment: 1 },
              lastDeliveryAt: new Date(),
              lastSuccessAt: new Date(),
            },
          }),
        ]);
        return true;
      } else {
        // HTTP error
        await WebhookService.handleFailure(
          delivery.id,
          webhookId,
          eventType,
          data,
          attemptNumber,
          webhook.retryCount,
          response.status,
          responseBody
        );
        return false;
      }
    } catch (error) {
      // Network or timeout error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await WebhookService.handleFailure(
        delivery.id,
        webhookId,
        eventType,
        data,
        attemptNumber,
        webhook.retryCount,
        undefined,
        undefined,
        errorMessage
      );
      return false;
    }
  }

  /**
   * Handle a failed delivery attempt
   */
  private static async handleFailure(
    deliveryId: string,
    webhookId: string,
    eventType: WebhookEventType,
    data: any,
    attemptNumber: number,
    maxRetries: number,
    responseCode?: number,
    responseBody?: string,
    errorMessage?: string
  ): Promise<void> {
    const shouldRetry = attemptNumber < maxRetries;

    await prisma.$transaction([
      prisma.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
          status: shouldRetry ? 'RETRYING' : 'FAILED',
          responseCode,
          responseBody: responseBody?.substring(0, 5000),
          errorMessage,
        },
      }),
      prisma.webhook.update({
        where: { id: webhookId },
        data: {
          totalDeliveries: { increment: 1 },
          failedDeliveries: { increment: shouldRetry ? 0 : 1 },
          lastDeliveryAt: new Date(),
          lastFailureAt: new Date(),
        },
      }),
    ]);

    // Schedule retry with exponential backoff
    if (shouldRetry) {
      const delayMs = Math.pow(2, attemptNumber) * 1000; // 2s, 4s, 8s, etc.
      setTimeout(() => {
        WebhookService.deliver(webhookId, eventType, data, attemptNumber + 1);
      }, delayMs);
    }
  }

  /**
   * Test a webhook endpoint
   */
  static async test(webhookId: string): Promise<{
    success: boolean;
    statusCode?: number;
    error?: string;
  }> {
    const webhook = await prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook) {
      return { success: false, error: 'Webhook not found' };
    }

    const testPayload: WebhookPayload = {
      event: 'lead.created' as WebhookEventType,
      timestamp: new Date().toISOString(),
      data: {
        test: true,
        message: 'This is a test webhook delivery',
      },
    };

    const payloadString = JSON.stringify(testPayload);
    const signature = WebhookService.signPayload(payloadString, webhook.secret);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), webhook.timeoutMs);

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': 'test',
          ...((webhook.headers as Record<string, string>) || {}),
        },
        body: payloadString,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return {
        success: response.ok,
        statusCode: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export default WebhookService;
