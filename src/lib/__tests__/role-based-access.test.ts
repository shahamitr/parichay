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

  Object.entries(headers).forEach(([key, value]) => {
    request.headers.set(key, value);
  });

  return request;
}

describe('Role-Based Access Control', () => {
  describe('Super Admin Access', () => {
    it('should allow super admin to access all resources', () => {
      const request = createMockRequest({
        'x-user-id': 'admin-123',
        'x-user-role': 'SUPER_ADMIN',
      });

      const user = requireSuperAdmin(request);

      expect(user).toBeDefined();
      expect(user.role).toBe('SUPER_ADMIN');
    });

    it('should allow super admin to access any brand', () => {
      const request = createMockRequest({
        'x-user-id': 'admin-123',
        'x-user-role': 'SUPER_ADMIN',
      });

      const user = requireBrandAccess(request, 'any-brand-id');

      expect(user).toBeDefined();
      expect(user.role).toBe('SUPER_ADMIN');
    });

    it('should deny non-super-admin from super admin endpoints', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'BRAND_MANAGER',
      });

      expect(() => requireSuperAdmin(request)).toThrow('Insufficient permissions');
    });
  });

  describe('Brand Manager Access', () => {
    it('should allow brand manager to access their own brand', () => {
      const request = createMockRequest({
        'x-user-id': 'manager-123',
        'x-user-role': 'BRAND_MANAGER',
        'x-brand-id': 'brand-123',
      });

      const user = requireBrandAccess(request, 'brand-123');

      expect(user).toBeDefined();
      expect(user.role).toBe('BRAND_MANAGER');
      expect(user.brandId).toBe('brand-123');
    });

    it('should deny brand manager access to other brands', () => {
      const request = createMockRequest({
        'x-user-id': 'manager-123',
        'x-user-role': 'BRAND_MANAGER',
        'x-brand-id': 'brand-123',
      });

      expect(() => requireBrandAccess(request, 'brand-456')).toThrow(
        'Access denied to this brand'
      );
    });

    it('should allow brand manager role to access brand manager endpoints', () => {
      const request = createMockRequest({
        'x-user-id': 'manager-123',
        'x-user-role': 'BRAND_MANAGER',
        'x-brand-id': 'brand-123',
      });

      const user = requireRole(request, ['BRAND_MANAGER', 'SUPER_ADMIN']);

      expect(user).toBeDefined();
      expect(user.role).toBe('BRAND_MANAGER');
    });
  });

  describe('Branch Admin Access', () => {
    it('should allow branch admin to access branch admin endpoints', () => {
      const request = createMockRequest({
        'x-user-id': 'branch-admin-123',
        'x-user-role': 'BRANCH_ADMIN',
        'x-brand-id': 'brand-123',
      });

      const user = requireRole(request, ['BRANCH_ADMIN', 'BRAND_MANAGER', 'SUPER_ADMIN']);

      expect(user).toBeDefined();
      expect(user.role).toBe('BRANCH_ADMIN');
    });

    it('should deny branch admin from brand manager endpoints', () => {
      const request = createMockRequest({
        'x-user-id': 'branch-admin-123',
        'x-user-role': 'BRANCH_ADMIN',
      });

      expect(() => requireRole(request, ['BRAND_MANAGER', 'SUPER_ADMIN'])).toThrow(
        'Insufficient permissions'
      );
    });

    it('should deny branch admin from super admin endpoints', () => {
      const request = createMockRequest({
        'x-user-id': 'branch-admin-123',
        'x-user-role': 'BRANCH_ADMIN',
      });

      expect(() => requireSuperAdmin(request)).toThrow('Insufficient permissions');
    });
  });

  describe('Multi-Role Access', () => {
    it('should allow multiple roles to access shared endpoints', () => {
      const allowedRoles: UserRole[] = ['BRAND_MANAGER', 'SUPER_ADMIN'];

      // Test with BRAND_MANAGER
      const managerRequest = createMockRequest({
        'x-user-id': 'manager-123',
        'x-user-role': 'BRAND_MANAGER',
      });

      const manager = requireRole(managerRequest, allowedRoles);
      expect(manager.role).toBe('BRAND_MANAGER');

      // Test with SUPER_ADMIN
      const adminRequest = createMockRequest({
        'x-user-id': 'admin-123',
        'x-user-role': 'SUPER_ADMIN',
      });

      const admin = requireRole(adminRequest, allowedRoles);
      expect(admin.role).toBe('SUPER_ADMIN');
    });

    it('should deny unauthorized roles from multi-role endpoints', () => {
      const request = createMockRequest({
        'x-user-id': 'branch-admin-123',
        'x-user-role': 'BRANCH_ADMIN',
      });

      expect(() => requireRole(request, ['BRAND_MANAGER', 'SUPER_ADMIN'])).toThrow(
        'Insufficient permissions'
      );
    });
  });

  describe('Authentication Enforcement', () => {
    it('should reject requests without authentication', () => {
      const request = createMockRequest();

      expect(() => requireAuth(request)).toThrow('Authentication required');
    });

    it('should reject requests with missing user ID', () => {
      const request = createMockRequest({
        'x-user-role': 'BRAND_MANAGER',
      });

      expect(() => requireAuth(request)).toThrow('Authentication required');
    });

    it('should reject requests with missing role', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
      });

      expect(() => requireAuth(request)).toThrow('Authentication required');
    });

    it('should reject role-based access without authentication', () => {
      const request = createMockRequest();

      expect(() => requireRole(request, ['BRAND_MANAGER'])).toThrow('Authentication required');
    });

    it('should reject brand access without authentication', () => {
      const request = createMockRequest();

      expect(() => requireBrandAccess(request, 'brand-123')).toThrow('Authentication required');
    });
  });

  describe('Brand Isolation', () => {
    it('should enforce brand isolation for brand managers', () => {
      const request = createMockRequest({
        'x-user-id': 'manager-123',
        'x-user-role': 'BRAND_MANAGER',
        'x-brand-id': 'brand-123',
      });

      // Should allow access to own brand
      expect(() => requireBrandAccess(request, 'brand-123')).not.toThrow();

      // Should deny access to other brands
      expect(() => requireBrandAccess(request, 'brand-456')).toThrow(
        'Access denied to this brand'
      );
      expect(() => requireBrandAccess(request, 'brand-789')).toThrow(
        'Access denied to this brand'
      );
    });

    it('should not enforce brand isolation for super admins', () => {
      const request = createMockRequest({
        'x-user-id': 'admin-123',
        'x-user-role': 'SUPER_ADMIN',
      });

      // Should allow access to any brand
      expect(() => requireBrandAccess(request, 'brand-123')).not.toThrow();
      expect(() => requireBrandAccess(request, 'brand-456')).not.toThrow();
      expect(() => requireBrandAccess(request, 'brand-789')).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing brand ID for brand manager', () => {
      const request = createMockRequest({
        'x-user-id': 'manager-123',
        'x-user-role': 'BRAND_MANAGER',
        // Missing x-brand-id
      });

      expect(() => requireBrandAccess(request, 'brand-123')).toThrow(
        'Access denied to this brand'
      );
    });

    it('should handle empty brand ID', () => {
      const request = createMockRequest({
        'x-user-id': 'manager-123',
        'x-user-role': 'BRAND_MANAGER',
        'x-brand-id': '',
      });

      expect(() => requireBrandAccess(request, 'brand-123')).toThrow(
        'Access denied to this brand'
      );
    });

    it('should handle case-sensitive role comparison', () => {
      const request = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'SUPER_ADMIN',
      });

      const user = requireRole(request, ['SUPER_ADMIN']);
      expect(user.role).toBe('SUPER_ADMIN');
    });
  });
});
