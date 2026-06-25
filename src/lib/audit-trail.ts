import { prisma } from './prisma';
import logger from './logger';
import crypto from 'crypto';

/**
 * Audit event types for sensitive operations
 */
export enum AuditEventType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGIN_FAILED = 'USER_LOGIN_FAILED',
  USER_LOCKED = 'USER_LOCKED',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_RESTORED = 'USER_RESTORED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
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
  ROLE_CHANGED = 'ROLE_CHANGED',
  // Data integrity events
  DATA_MODIFIED = 'DATA_MODIFIED',
  SENSITIVE_ACCESS = 'SENSITIVE_ACCESS',
  ENCRYPTION_KEY_ROTATED = 'ENCRYPTION_KEY_ROTATED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  REQUEST_SIGNATURE_FAILED = 'REQUEST_SIGNATURE_FAILED',
}

interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  resourceId?: string;
  resourceType?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  correlationId?: string;
}

/**
 * Log audit trail event to the dedicated AuditLog table.
 * Never throws — failures are logged but don't break the main flow.
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    // Write to dedicated audit_logs table
    await prisma.auditLog.create({
      data: {
        eventType: entry.eventType,
        userId: entry.userId || null,
        resourceId: entry.resourceId || null,
        resourceType: entry.resourceType || null,
        ipAddress: entry.ipAddress || null,
        userAgent: entry.userAgent || null,
        metadata: entry.metadata || null,
        correlationId: entry.correlationId || null,
      },
    });

    // Also log structured for external log aggregation (CloudWatch, Datadog, etc.)
    logger.info({
      type: 'AUDIT',
      eventType: entry.eventType,
      userId: entry.userId,
      resourceId: entry.resourceId,
      resourceType: entry.resourceType,
      correlationId: entry.correlationId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Don't throw — audit logging must never break the main flow
    logger.error({ error, entry }, 'Failed to log audit event');
  }
}

/**
 * Helper to extract IP address from request headers
 */
export function getIpAddress(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded != null) {
    return forwarded.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || 'unknown';
}

/**
 * Helper to extract user agent from request headers
 */
export function getUserAgent(headers: Headers): string {
  return headers.get('user-agent') || 'unknown';
}

// =============================================================================
// Data Integrity Hashing
// =============================================================================

/**
 * Create a tamper-detection hash of a record's critical fields.
 * Store this hash alongside the record. If the hash doesn't match
 * on read, the data was modified outside the application.
 *
 * @example
 * const hash = computeIntegrityHash({ id: user.id, email: user.email, role: user.role });
 * await prisma.user.update({ where: { id }, data: { ...updates, _integrityHash: hash } });
 */
export function computeIntegrityHash(data: Record<string, unknown>): string {
  const secret = process.env.JWT_SECRET || 'dev-integrity-key';
  const sorted = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHmac('sha256', secret).update(sorted).digest('hex').slice(0, 32);
}

/**
 * Verify a record's integrity hash matches its current data.
 * Returns true if data is intact, false if tampered.
 */
export function verifyIntegrity(
  data: Record<string, unknown>,
  storedHash: string | null | undefined
): boolean {
  if (!storedHash) return true; // No hash stored yet (legacy data)
  const currentHash = computeIntegrityHash(data);
  return crypto.timingSafeEqual(
    Buffer.from(currentHash, 'hex'),
    Buffer.from(storedHash, 'hex')
  );
}

// =============================================================================
// Change Tracking (before/after snapshots)
// =============================================================================

/**
 * Log a data modification with before/after snapshot.
 * Use this for any sensitive field change (role, email, subscription, etc.)
 */
export async function logDataChange(params: {
  eventType: AuditEventType;
  userId: string;
  resourceId: string;
  resourceType: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  // Compute a diff of what changed
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  for (const key of Object.keys(params.after)) {
    if (JSON.stringify(params.before[key]) !== JSON.stringify(params.after[key])) {
      changes[key] = { from: params.before[key], to: params.after[key] };
    }
  }

  await logAuditEvent({
    eventType: params.eventType,
    userId: params.userId,
    resourceId: params.resourceId,
    resourceType: params.resourceType,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    metadata: {
      changes,
      beforeHash: computeIntegrityHash(params.before),
      afterHash: computeIntegrityHash(params.after),
      changedFields: Object.keys(changes),
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log access to sensitive/encrypted data (for compliance).
 * Call this when decrypting PII to view it.
 */
export async function logSensitiveAccess(params: {
  userId: string;
  resourceId: string;
  resourceType: string;
  fieldsAccessed: string[];
  reason?: string;
  ipAddress?: string;
}): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.SENSITIVE_ACCESS,
    userId: params.userId,
    resourceId: params.resourceId,
    resourceType: params.resourceType,
    ipAddress: params.ipAddress,
    metadata: {
      fieldsAccessed: params.fieldsAccessed,
      reason: params.reason || 'routine-access',
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log a suspicious activity for security review.
 */
export async function logSuspiciousActivity(params: {
  userId?: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
    userId: params.userId,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    metadata: {
      description: params.description,
      severity: params.severity,
      ...params.metadata,
      timestamp: new Date().toISOString(),
    },
  });

  // For critical severity, log at error level for immediate alerting
  if (params.severity === 'critical') {
    logger.error({
      type: 'SECURITY_ALERT',
      description: params.description,
      userId: params.userId,
      ipAddress: params.ipAddress,
    }, `CRITICAL: ${params.description}`);
  }
}
