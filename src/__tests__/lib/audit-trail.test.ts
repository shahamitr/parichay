import { describe, it, expect } from 'vitest';
import {
  computeIntegrityHash,
  verifyIntegrity,
  AuditEventType,
} from '@/lib/audit-trail';

describe('Audit Trail — Data Integrity', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-integrity-key-at-least-32-chars-long';
  });

  describe('computeIntegrityHash', () => {
    it('should produce a 32-character hex hash', () => {
      const hash = computeIntegrityHash({ id: '123', email: 'test@test.com' });
      expect(hash.length).toBe(32);
      expect(/^[a-f0-9]{32}$/.test(hash)).toBe(true);
    });

    it('should produce consistent hash for same data', () => {
      const data = { id: '123', role: 'ADMIN', email: 'a@b.com' };
      const hash1 = computeIntegrityHash(data);
      const hash2 = computeIntegrityHash(data);
      expect(hash1).toBe(hash2);
    });

    it('should produce different hash for different data', () => {
      const hash1 = computeIntegrityHash({ id: '123', role: 'ADMIN' });
      const hash2 = computeIntegrityHash({ id: '123', role: 'USER' });
      expect(hash1).not.toBe(hash2);
    });

    it('should be order-independent (keys are sorted)', () => {
      const hash1 = computeIntegrityHash({ b: 2, a: 1 });
      const hash2 = computeIntegrityHash({ a: 1, b: 2 });
      expect(hash1).toBe(hash2);
    });
  });

  describe('verifyIntegrity', () => {
    it('should return true for valid hash', () => {
      const data = { id: '123', email: 'test@test.com' };
      const hash = computeIntegrityHash(data);
      expect(verifyIntegrity(data, hash)).toBe(true);
    });

    it('should return false for tampered data', () => {
      const original = { id: '123', role: 'USER' };
      const hash = computeIntegrityHash(original);
      const tampered = { id: '123', role: 'SUPER_ADMIN' };
      expect(verifyIntegrity(tampered, hash)).toBe(false);
    });

    it('should return true if no hash stored (legacy data)', () => {
      expect(verifyIntegrity({ id: '123' }, null)).toBe(true);
      expect(verifyIntegrity({ id: '123' }, undefined)).toBe(true);
    });
  });

  describe('AuditEventType enum', () => {
    it('should have all expected event types', () => {
      expect(AuditEventType.USER_LOGIN).toBe('USER_LOGIN');
      expect(AuditEventType.USER_DELETED).toBe('USER_DELETED');
      expect(AuditEventType.PAYMENT_PROCESSED).toBe('PAYMENT_PROCESSED');
      expect(AuditEventType.DATA_MODIFIED).toBe('DATA_MODIFIED');
      expect(AuditEventType.SUSPICIOUS_ACTIVITY).toBe('SUSPICIOUS_ACTIVITY');
      expect(AuditEventType.REQUEST_SIGNATURE_FAILED).toBe('REQUEST_SIGNATURE_FAILED');
    });
  });
});
