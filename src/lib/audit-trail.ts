import { prisma } from './prisma';
import logger from './logger';

/**
 * Audit event types for sensitive operations
 */
export enum AuditEventType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  BRAND_CREATED = 'BRAND_CREATED',
  BRAND_UPDATED = 'BRAND_UPDATED',
  BRAND_DELETED = 'BRAND_DELETED',
  SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_UPDATED = 'SUBSCRIPTION_UPDATED',
  SUBSCRIPTION_CANCELLED = 'SUBSCRIPTION_CANCELLED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  DATA_EXPORTED = 'DATA_EXPORTED',
  DATA_DELETED = 'DATA_DELETED',
}

interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  resourceId?: string;
  resourceType?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  correlationId?: string;
}

/**
 * Log audit trail for sensitive operations
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    // Log to console/file with structured logging
    logger.info({
      type: 'AUDIT',
      eventType: entry.eventType,
      userId: entry.userId,
      resourceId: entry.resourceId,
      resourceType: entry.resourceType,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      metadata: entry.metadata,
      correlationId: entry.correlationId,
      timestamp: new Date().toISOString(),
    });

    // In production, you might want to store audit logs in a separate table
    // or send to a dedicated audit logging service
    // For now, we'll use the notification system as a simple audit trail
    if (entry.userId) {
      await prisma.notification.create({
        data: {
          userId: entry.userId,
          type: 'SYSTEM_ALERT',
          title: `Audit: ${entry.eventType}`,
          message: `Action performed: ${entry.eventType}`,
          metadata: {
            auditEvent: entry.eventType,
            resourceId: entry.resourceId,
            resourceType: entry.resourceType,
            timestamp: new Date().toISOString(),
          },
        },
      });
    }
  } catch (error) {
    // Don't throw errors from audit logging to avoid breaking the main flow
    logger.error({ error, entry }, 'Failed to log audit event');
  }
}

/**
 * Helper to extract IP address from request
 */
export function getIpAddress(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded != null) {
    return forwarded.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || 'unknown';
}
