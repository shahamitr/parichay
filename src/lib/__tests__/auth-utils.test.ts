import { NextRequest } from 'next/server';
import {
  getUserFromRequest,
  requireAuth,
  requireRole,
  requireSuperAdmin,
  requireBrandAccess,
} from '../auth-utils';
import { UserRole } from '../../generated/prisma';

// Helper function to create mock NextRequest
function createMockRequest(headers: Record<string, string> = {}): NextRequest {
  const url = 'http://localhost:3000/api/test';
  const request = new NextRequest(url);

  // Add custom headers
  Object.entries(headers).forEach(([key, value]) => {
    request.headers.set(key, value);
  });

  return request;
}

describe('auth-utils', () => {
  describe('getUserFromRequest', () => {
    it('should extract user from request headers', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'BRAND_MANAGER',
        'x-brand-id': 'brand-123',
      });

      const user = getUserFromRequest(request);

      expect(user).toBeDefined();
      expect(user?.id).toBe('user-123');
      expect(user?.userId).toBe('user-123');
      expect(user?.role).toBe('BRAND_MANAGER');
      expect(user?.brandId).toBe('brand-123');
    });

    it('should return null when user-id header is missing', () => {
      const request = createMockRequest({
        'x-user-role': 'BRAND_MANAGER',
      });

      const user = getUserFromRequest(request);

      expect(user).toBeNull();
    });

    it('should return null when role header is missing', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
      });

      const user = getUserFromRequest(request);

      expect(user).toBeNull();
    });

    it('should handle missing brand-id header', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'SUPER_ADMIN',
      });

      const user = getUserFromRequest(request);

      expect(user).toBeDefined();
      expect(user?.brandId).toBeUndefined();
    });
  });

  describe('requireAuth', () => {
    it('should return user when authenticated', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'BRAND_MANAGER',
      });

      const user = requireAuth(request);

      expect(user).toBeDefined();
      expect(user.id).toBe('user-123');
    });

    it('should throw error when not authenticated', () => {
      const request = createMockRequest();

      expect(() => requireAuth(request)).toThrow('Authentication required');
    });
  });

  describe('requireRole', () => {
    it('should return user when role is allowed', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'BRAND_MANAGER',
      });

      const user = requireRole(request, ['BRAND_MANAGER', 'SUPER_ADMIN']);

      expect(user).toBeDefined();
      expect(user.role).toBe('BRAND_MANAGER');
    });

    it('should throw error when role is not allowed', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'BRANCH_ADMIN',
      });

      expect(() => requireRole(request, ['SUPER_ADMIN'])).toThrow('Insufficient permissions');
    });

    it('should throw error when not authenticated', () => {
      const request = createMockRequest();

      expect(() => requireRole(request, ['BRAND_MANAGER'])).toThrow('Authentication required');
    });
  });

  describe('requireSuperAdmin', () => {
    it('should return user when user is super admin', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'SUPER_ADMIN',
      });

      const user = requireSuperAdmin(request);

      expect(user).toBeDefined();
      expect(user.role).toBe('SUPER_ADMIN');
    });

    it('should throw error when user is not super admin', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'BRAND_MANAGER',
      });

      expect(() => requireSuperAdmin(request)).toThrow('Insufficient permissions');
    });
  });

  describe('requireBrandAccess', () => {
    it('should allow super admin to access any brand', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'SUPER_ADMIN',
      });

      const user = requireBrandAccess(request, 'any-brand-id');

      expect(user).toBeDefined();
      expect(user.role).toBe('SUPER_ADMIN');
    });

    it('should allow brand manager to access their own brand', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'BRAND_MANAGER',
        'x-brand-id': 'brand-123',
      });

      const user = requireBrandAccess(request, 'brand-123');

      expect(user).toBeDefined();
      expect(user.brandId).toBe('brand-123');
    });

    it('should deny brand manager access to other brands', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'BRAND_MANAGER',
        'x-brand-id': 'brand-123',
      });

      expect(() => requireBrandAccess(request, 'brand-456')).toThrow('Access denied to this brand');
    });

    it('should throw error when not authenticated', () => {
      const request = createMockRequest();

      expect(() => requireBrandAccess(request, 'brand-123')).toThrow('Authentication required');
    });
  });
});
