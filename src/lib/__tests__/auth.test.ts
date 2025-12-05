import { AuthService } from '../auth';
import { UserRole } from '../../generated/prisma';

describe('AuthService', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await AuthService.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await AuthService.hashPassword(password);
      const hash2 = await AuthService.hashPassword(password);

      // bcrypt uses salt, so same password should produce different hashes
      expect(hash1).not.toBe(hash2);
    });

    it('should generate different hashes for different passwords', async () => {
      const hash1 = await AuthService.hashPassword('password1');
      const hash2 = await AuthService.hashPassword('password2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await AuthService.hashPassword(password);
      const isValid = await AuthService.verifyPassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await AuthService.hashPassword(password);
      const isValid = await AuthService.verifyPassword(wrongPassword, hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should reject empty password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await AuthService.hashPassword(password);
      const isValid = await AuthService.verifyPassword('', hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should handle case-sensitive passwords', async () => {
      const password = 'TestPassword123';
      const hashedPassword = await AuthService.hashPassword(password);
      const isValid = await AuthService.verifyPassword('testpassword123', hashedPassword);

      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a token with valid payload', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'BRAND_MANAGER' as UserRole,
        brandId: 'brand-123',
      };

      const token = AuthService.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'BRAND_MANAGER' as UserRole,
        brandId: 'brand-123',
      };

      const token = AuthService.generateToken(payload);
      const decoded = AuthService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe(payload.role);
    });

    it('should return null for invalid token', () => {
      const decoded = AuthService.verifyToken('invalid-token');

      expect(decoded).toBeNull();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const userId = 'user-123';
      const refreshToken = AuthService.generateRefreshToken(userId);

      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe('string');
      expect(refreshToken.length).toBeGreaterThan(0);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const userId = 'user-123';
      const refreshToken = AuthService.generateRefreshToken(userId);
      const decoded = AuthService.verifyRefreshToken(refreshToken);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(userId);
    });

    it('should return null for invalid refresh token', () => {
      const decoded = AuthService.verifyRefreshToken('invalid-refresh-token');

      expect(decoded).toBeNull();
    });
  });
});
