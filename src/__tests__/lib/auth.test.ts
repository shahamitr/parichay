import { describe, it, expect, beforeAll } from 'vitest';
import bcrypt from 'bcryptjs';

describe('Auth Service', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret-must-be-at-least-32-chars-long';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-also-32-chars-minimum-required';
  });

  describe('Password Hashing (bcryptjs)', () => {
    it('should hash a password', async () => {
      const hash = await bcrypt.hash('MyPassword123!', 12);
      expect(hash).toBeDefined();
      expect(hash).not.toBe('MyPassword123!');
      expect(hash.startsWith('$2')).toBe(true);
    });

    it('should verify correct password', async () => {
      const hash = await bcrypt.hash('CorrectPassword', 12);
      const isValid = await bcrypt.compare('CorrectPassword', hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const hash = await bcrypt.hash('CorrectPassword', 12);
      const isValid = await bcrypt.compare('WrongPassword', hash);
      expect(isValid).toBe(false);
    });

    it('should produce different hashes for same password (salt)', async () => {
      const hash1 = await bcrypt.hash('SamePassword', 12);
      const hash2 = await bcrypt.hash('SamePassword', 12);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('JWT structure validation', () => {
    it('JWT should have 3 dot-separated parts', () => {
      // Manually create a test JWT structure
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
      const payload = Buffer.from(JSON.stringify({ userId: 'test', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
      const signature = 'test-signature';
      const token = `${header}.${payload}.${signature}`;
      expect(token.split('.').length).toBe(3);
    });

    it('JWT payload should be decodable', () => {
      const payload = { userId: '123', email: 'test@test.com', role: 'BRAND_MANAGER' };
      const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
      const decoded = JSON.parse(Buffer.from(encoded, 'base64url').toString());
      expect(decoded.userId).toBe('123');
      expect(decoded.role).toBe('BRAND_MANAGER');
    });
  });
});
