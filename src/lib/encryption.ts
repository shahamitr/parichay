/**
 * Field-Level Encryption for Sensitive PII
 *
 * Uses AES-256-GCM for encrypting sensitive fields (phone, email, etc.)
 * stored in the database. Data is encrypted at rest and decrypted only
 * when needed by authorized code paths.
 *
 * Key management:
 * - ENCRYPTION_KEY env var: 32-byte hex key (64 hex characters)
 * - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * Format: encrypted data is stored as "iv:authTag:ciphertext" (all hex-encoded)
 */

import crypto from 'crypto';
import logger from './logger';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Get the encryption key from environment.
 * Falls back gracefully in development if not set.
 */
function getEncryptionKey(): Buffer | null {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('ENCRYPTION_KEY environment variable is not set!');
    }
    return null;
  }
  if (keyHex.length !== 64) {
    logger.error('ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)');
    return null;
  }
  return Buffer.from(keyHex, 'hex');
}

// =============================================================================
// Core Encrypt / Decrypt
// =============================================================================

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns the encrypted value in format: "iv:authTag:ciphertext" (hex-encoded)
 * Returns the original value if encryption key is not available (dev fallback).
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;

  const key = getEncryptionKey();
  if (!key) return plaintext; // Graceful fallback in dev

  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:ciphertext
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    logger.error({ error }, 'Encryption failed');
    return plaintext; // Don't lose data on encryption failure
  }
}

/**
 * Decrypt an encrypted string (format: "iv:authTag:ciphertext").
 * Returns the original plaintext.
 * Returns the input as-is if it doesn't look encrypted (migration-safe).
 */
export function decrypt(encryptedValue: string): string {
  if (!encryptedValue) return encryptedValue;

  // Check if this looks like our encrypted format (3 hex segments separated by colons)
  const parts = encryptedValue.split(':');
  if (parts.length !== 3) {
    // Not encrypted — return as-is (handles unencrypted legacy data)
    return encryptedValue;
  }

  const key = getEncryptionKey();
  if (!key) return encryptedValue; // Can't decrypt without key

  try {
    const [ivHex, authTagHex, ciphertext] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // If decryption fails, the data might not be encrypted (legacy)
    // or the key might have rotated
    logger.warn({ error }, 'Decryption failed — returning raw value');
    return encryptedValue;
  }
}

// =============================================================================
// Field-Level Helpers (for specific PII types)
// =============================================================================

/**
 * Encrypt a phone number for database storage.
 */
export function encryptPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  return encrypt(phone);
}

/**
 * Decrypt a phone number from database storage.
 */
export function decryptPhone(encryptedPhone: string | null | undefined): string | null {
  if (!encryptedPhone) return null;
  return decrypt(encryptedPhone);
}

/**
 * Encrypt an email for database storage.
 * Note: Only encrypt when you DON'T need to query by email.
 * For login (where you query by email), keep email plaintext but encrypt phone/address.
 */
export function encryptEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  return encrypt(email);
}

/**
 * Decrypt an email from database storage.
 */
export function decryptEmail(encryptedEmail: string | null | undefined): string | null {
  if (!encryptedEmail) return null;
  return decrypt(encryptedEmail);
}

// =============================================================================
// Batch Operations (for encrypting/decrypting objects)
// =============================================================================

/** Fields that should be encrypted when stored */
export const SENSITIVE_FIELDS = ['phone', 'whatsapp', 'alternatePhone'] as const;

/**
 * Encrypt all sensitive fields in a contact object.
 * Used before saving to database.
 */
export function encryptContactFields(
  contact: Record<string, unknown> | null
): Record<string, unknown> | null {
  if (!contact) return null;
  const result = { ...contact };
  for (const field of SENSITIVE_FIELDS) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = encrypt(result[field] as string);
    }
  }
  return result;
}

/**
 * Decrypt all sensitive fields in a contact object.
 * Used after reading from database.
 */
export function decryptContactFields(
  contact: Record<string, unknown> | null
): Record<string, unknown> | null {
  if (!contact) return null;
  const result = { ...contact };
  for (const field of SENSITIVE_FIELDS) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = decrypt(result[field] as string);
    }
  }
  return result;
}

// =============================================================================
// Hash for searchable encrypted fields
// =============================================================================

/**
 * Create a deterministic hash of a value for searching.
 * Use this to create a searchable index alongside the encrypted value.
 * E.g., store `phoneHash` = hashForSearch(phone) alongside encrypted `phone`.
 */
export function hashForSearch(value: string): string {
  if (!value) return '';
  const secret = process.env.ENCRYPTION_KEY || 'dev-fallback-key';
  return crypto
    .createHmac('sha256', secret)
    .update(value.toLowerCase().trim())
    .digest('hex')
    .slice(0, 32); // First 32 chars for index efficiency
}

// =============================================================================
// Key Rotation Helper
// =============================================================================

/**
 * Re-encrypt a value with the current key.
 * Used during key rotation: decrypt with old key, encrypt with new key.
 */
export function reEncrypt(encryptedValue: string, oldKeyHex: string): string | null {
  if (!encryptedValue) return null;

  const parts = encryptedValue.split(':');
  if (parts.length !== 3) return encryptedValue; // Not encrypted

  try {
    // Decrypt with old key
    const oldKey = Buffer.from(oldKeyHex, 'hex');
    const [ivHex, authTagHex, ciphertext] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, oldKey, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);
    let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');

    // Re-encrypt with current key
    return encrypt(plaintext);
  } catch (error) {
    logger.error({ error }, 'Key rotation re-encryption failed');
    return null;
  }
}
