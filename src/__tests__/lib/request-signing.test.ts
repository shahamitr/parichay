import { describe, it, expect, beforeAll } from 'vitest';
import {
  generateNonce,
  consumeNonce,
  signPayload,
  verifySignedRequest,
} from '@/lib/request-signing';

describe('Request Signing', () => {
  describe('generateNonce / consumeNonce', () => {
    it('should generate a 64-character hex nonce', async () => {
      const nonce = await generateNonce('user-123');
      expect(nonce.length).toBe(64);
      expect(/^[a-f0-9]{64}$/.test(nonce)).toBe(true);
    });

    it('should consume a valid nonce and return userId', async () => {
      const nonce = await generateNonce('user-456');
      const userId = await consumeNonce(nonce);
      expect(userId).toBe('user-456');
    });

    it('should return null for consumed nonce (single-use)', async () => {
      const nonce = await generateNonce('user-789');
      await consumeNonce(nonce); // First consume
      const secondConsume = await consumeNonce(nonce); // Second should fail
      expect(secondConsume).toBe(null);
    });

    it('should return null for invalid nonce', async () => {
      const result = await consumeNonce('nonexistent-nonce');
      expect(result).toBe(null);
    });

    it('should return null for empty nonce', async () => {
      const result = await consumeNonce('');
      expect(result).toBe(null);
    });
  });

  describe('signPayload', () => {
    it('should produce a hex signature', () => {
      const sig = signPayload({ amount: 100, planId: 'plan-1' }, 'test-nonce');
      expect(/^[a-f0-9]+$/.test(sig)).toBe(true);
      expect(sig.length).toBe(64); // SHA-256 = 64 hex chars
    });

    it('should produce consistent signature for same payload + nonce', () => {
      const payload = { a: 1, b: 2 };
      const sig1 = signPayload(payload, 'nonce-x');
      const sig2 = signPayload(payload, 'nonce-x');
      expect(sig1).toBe(sig2);
    });

    it('should produce different signature for different nonce', () => {
      const payload = { a: 1 };
      const sig1 = signPayload(payload, 'nonce-1');
      const sig2 = signPayload(payload, 'nonce-2');
      expect(sig1).not.toBe(sig2);
    });

    it('should be key-order independent (sorts keys)', () => {
      const sig1 = signPayload({ b: 2, a: 1 }, 'nonce');
      const sig2 = signPayload({ a: 1, b: 2 }, 'nonce');
      expect(sig1).toBe(sig2);
    });
  });

  describe('verifySignedRequest', () => {
    it('should verify a correctly signed request', async () => {
      const userId = 'user-test-verify';
      const nonce = await generateNonce(userId);
      const payload = { action: 'delete', confirmEmail: 'test@test.com' };
      const signature = signPayload(payload, nonce);

      const result = await verifySignedRequest(payload, nonce, signature, userId);
      expect(result.valid).toBe(true);
    });

    it('should reject tampered payload', async () => {
      const userId = 'user-tamper';
      const nonce = await generateNonce(userId);
      const originalPayload = { amount: 1000 };
      const signature = signPayload(originalPayload, nonce);
      const tamperedPayload = { amount: 999 }; // Changed!

      const result = await verifySignedRequest(tamperedPayload, nonce, signature, userId);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Invalid signature');
    });

    it('should reject wrong user', async () => {
      const nonce = await generateNonce('real-user');
      const payload = { test: true };
      const signature = signPayload(payload, nonce);

      const result = await verifySignedRequest(payload, nonce, signature, 'attacker');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('does not belong');
    });

    it('should reject expired/invalid nonce', async () => {
      const payload = { test: true };
      const signature = signPayload(payload, 'fake-nonce');

      const result = await verifySignedRequest(payload, 'fake-nonce', signature, 'user');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Invalid or expired nonce');
    });
  });
});
