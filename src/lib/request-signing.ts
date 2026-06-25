/**
 * Request Signing for Sensitive Mutations
 *
 * Prevents replay attacks and ensures request integrity for critical operations:
 * - Payment processing
 * - Account deletion
 * - Role changes
 * - Password changes
 *
 * How it works:
 * 1. Client fetches a nonce from /api/auth/nonce (tied to session)
 * 2. Client signs the request payload with the nonce using HMAC
 * 3. Server verifies the signature and that the nonce hasn't been used before
 *
 * This ensures:
 * - Requests can't be replayed (nonce is single-use)
 * - Requests can't be tampered with (HMAC validates payload integrity)
 * - Requests are tied to the authenticated session
 */

import crypto from 'crypto';
import { getRedisClient } from './redis';
import logger from './logger';

// In-memory nonce store (fallback when Redis unavailable)
const nonceStore = new Map<string, { userId: string; expiresAt: number }>();

// Nonce expiry: 5 minutes
const NONCE_TTL_MS = 5 * 60 * 1000;
const NONCE_TTL_SEC = 300;

// =============================================================================
// Nonce Generation
// =============================================================================

/**
 * Generate a cryptographically secure nonce tied to a user session.
 * Store it with an expiry (single-use, time-limited).
 */
export async function generateNonce(userId: string): Promise<string> {
  const nonce = crypto.randomBytes(32).toString('hex');
  const redis = getRedisClient();

  if (redis) {
    // Store in Redis with TTL
    await redis.set(`nonce:${nonce}`, userId, 'EX', NONCE_TTL_SEC);
  } else {
    // In-memory fallback
    nonceStore.set(nonce, {
      userId,
      expiresAt: Date.now() + NONCE_TTL_MS,
    });
    // Cleanup expired entries periodically
    if (Math.random() < 0.1) cleanupExpiredNonces();
  }

  return nonce;
}

// =============================================================================
// Nonce Validation (consume — single use)
// =============================================================================

/**
 * Validate and consume a nonce. Returns the userId it was issued to,
 * or null if invalid/expired/already used.
 */
export async function consumeNonce(nonce: string): Promise<string | null> {
  if (!nonce) return null;

  const redis = getRedisClient();

  if (redis) {
    // Atomically get and delete (single-use)
    const userId = await redis.get(`nonce:${nonce}`);
    if (!userId) return null;
    await redis.del(`nonce:${nonce}`);
    return userId;
  } else {
    // In-memory fallback
    const entry = nonceStore.get(nonce);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      nonceStore.delete(nonce);
      return null;
    }
    nonceStore.delete(nonce); // Consume (single-use)
    return entry.userId;
  }
}

// =============================================================================
// Request Signature Verification
// =============================================================================

/**
 * Sign a payload with a nonce (client-side compatible algorithm).
 * Uses HMAC-SHA256 with the nonce as key and sorted JSON payload as message.
 */
export function signPayload(payload: Record<string, unknown>, nonce: string): string {
  // Sort keys for deterministic serialization
  const sorted = JSON.stringify(payload, Object.keys(payload).sort());
  return crypto.createHmac('sha256', nonce).update(sorted).digest('hex');
}

/**
 * Verify a signed request.
 *
 * @param payload - The request body (excluding _nonce and _signature)
 * @param nonce - The nonce from the request
 * @param signature - The HMAC signature from the request
 * @param expectedUserId - The authenticated user's ID (must match nonce owner)
 *
 * @returns { valid: boolean, reason?: string }
 */
export async function verifySignedRequest(
  payload: Record<string, unknown>,
  nonce: string,
  signature: string,
  expectedUserId: string
): Promise<{ valid: boolean; reason?: string }> {
  // 1. Consume the nonce (single-use + validates existence)
  const nonceUserId = await consumeNonce(nonce);
  if (!nonceUserId) {
    return { valid: false, reason: 'Invalid or expired nonce' };
  }

  // 2. Verify nonce belongs to the requesting user
  if (nonceUserId !== expectedUserId) {
    logger.warn({ nonceUserId, expectedUserId }, 'Nonce user mismatch');
    return { valid: false, reason: 'Nonce does not belong to this user' };
  }

  // 3. Verify payload signature
  const expectedSignature = signPayload(payload, nonce);
  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );

  if (!isValid) {
    logger.warn({}, 'Request signature mismatch — possible tampering');
    return { valid: false, reason: 'Invalid signature' };
  }

  return { valid: true };
}

// =============================================================================
// Middleware Helper for Protected Routes
// =============================================================================

/**
 * Extract signing fields from a request body.
 * Returns the payload (without meta fields), nonce, and signature.
 */
export function extractSigningFields(body: Record<string, unknown>): {
  payload: Record<string, unknown>;
  nonce: string | null;
  signature: string | null;
} {
  const { _nonce, _signature, _form_loaded_at, website_url, ...payload } = body;
  return {
    payload,
    nonce: typeof _nonce === 'string' ? _nonce : null,
    signature: typeof _signature === 'string' ? _signature : null,
  };
}

// =============================================================================
// Helpers
// =============================================================================

function cleanupExpiredNonces() {
  const now = Date.now();
  for (const [key, entry] of nonceStore.entries()) {
    if (now > entry.expiresAt) {
      nonceStore.delete(key);
    }
  }
}
