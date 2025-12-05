import { JWTService, JWTPayload } from '../jwt';
import { UserRole } from '../../generated/prisma';

describe('JWTService', () => {
  const mockPayload: JWTPayload = {
    userId: 'user-123',
    email: 'test@example.com',
    role: 'BRAND_MANAGER' as UserRole,
    brandId: 'brand-123',
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = JWTService.generateToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different payloads', () => {
      const token1 = JWTService.generateToken(mockPayload);
      const token2 = JWTService.generateToken({
        ...mockPayload,
        userId: 'user-456',
      });

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = JWTService.generateToken(mockPayload);
      const decoded = JWTService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(mockPayload.userId);
      expect(decoded?.email).toBe(mockPayload.email);
      expect(decoded?.role).toBe(mockPayload.role);
      expect(decoded?.brandId).toBe(mockPayload.brandId);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = JWTService.verifyToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it('should return null for expired token', () => {
      // Create a token with immediate expiration
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        mockPayload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '0s' }
      );

      // Wait a moment to ensure expiration
      const decoded = JWTService.verifyToken(expiredToken);
      expect(decoded).toBeNull();
    });

    it('should return null for tampered token', () => {
      const token = JWTService.generateToken(mockPayload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      const decoded = JWTService.verifyToken(tamperedToken);

      expect(decoded).toBeNull();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const userId = 'user-123';
      const refreshToken = JWTService.generateRefreshToken(userId);

      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe('string');
      expect(refreshToken.split('.')).toHaveLength(3);
    });

    it('should generate different refresh tokens for different users', () => {
      const token1 = JWTService.generateRefreshToken('user-123');
      const token2 = JWTService.generateRefreshToken('user-456');

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and decode a valid refresh token', () => {
      const userId = 'user-123';
      const refreshToken = JWTService.generateRefreshToken(userId);
      const decoded = JWTService.verifyRefreshToken(refreshToken);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(userId);
    });

    it('should return null for invalid refresh token', () => {
      const invalidToken = 'invalid.refresh.token';
      const decoded = JWTService.verifyRefreshToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it('should return null for tampered refresh token', () => {
      const userId = 'user-123';
      const refreshToken = JWTService.generateRefreshToken(userId);
      const tamperedToken = refreshToken.slice(0, -5) + 'xxxxx';
      const decoded = JWTService.verifyRefreshToken(tamperedToken);

      expect(decoded).toBeNull();
    });
  });
});
