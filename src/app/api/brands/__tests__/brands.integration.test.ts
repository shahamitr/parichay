import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { GET as GET_BY_ID, PUT, DELETE } from '../[id]/route';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { UserRole } from '@/generated/prisma';

// Mock the prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    brand: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Brand Management Integration Tests', () => {
  let mockUser: any;
  let mockToken: string;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock user
    mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'BRAND_MANAGER' as UserRole,
      brandId: 'brand-123',
      isActive: true,
      branches: [],
    };

    // Generate real token for testing
    mockToken = AuthService.generateToken({ userId: mockUser.id, email: mockUser.email, role: mockUser.role, brandId: mockUser.brandId });

    // Mock user lookup for verifyToken
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
  });

  describe('POST /api/brands - Create Brand', () => {
    it('should create a new brand with valid data', async () => {
      const brandData = {
        name: 'Test Brand',
        tagline: 'Test Tagline',
        colorTheme: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#F59E0B',
        },
      };

      const mockCreatedBrand = {
        id: 'brand-456',
        name: 'Test Brand',
        slug: 'test-brand',
        tagline: 'Test Tagline',
        logo: null,
        customDomain: null,
        sslEnabled: false,
        colorTheme: brandData.colorTheme,
        ownerId: mockUser.id,
        subscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { branches: 0 },
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.brand.create as jest.Mock).mockResolvedValue(mockCreatedBrand);
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = new NextRequest('http://localhost:3000/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(brandData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.brand).toBeDefined();
      expect(data.brand.name).toBe('Test Brand');
      expect(data.brand.slug).toBe('test-brand');
      expect(prisma.brand.create).toHaveBeenCalled();
    });

    it('should generate unique slug when duplicate exists', async () => {
      const brandData = {
        name: 'Test Brand',
      };

      // First call returns existing brand, second returns null
      (prisma.brand.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 'existing-brand', slug: 'test-brand' })
        .mockResolvedValueOnce(null);

      (prisma.brand.create as jest.Mock).mockResolvedValue({
        id: 'brand-456',
        name: 'Test Brand',
        slug: 'test-brand-1',
        ownerId: mockUser.id,
        colorTheme: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' },
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { branches: 0 },
      });

      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = new NextRequest('http://localhost:3000/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(brandData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.brand.slug).toBe('test-brand-1');
    });

    it('should reject unauthorized requests', async () => {
      const brandData = {
        name: 'Test Brand',
      };

      const request = new NextRequest('http://localhost:3000/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should apply default color theme when not provided', async () => {
      const brandData = {
        name: 'Test Brand',
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.brand.create as jest.Mock).mockResolvedValue({
        id: 'brand-456',
        name: 'Test Brand',
        slug: 'test-brand',
        ownerId: mockUser.id,
        colorTheme: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#F59E0B',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { branches: 0 },
      });

      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = new NextRequest('http://localhost:3000/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(brandData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.brand.colorTheme).toEqual({
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#F59E0B',
      });
    });
  });

  describe('GET /api/brands - List Brands', () => {
    it('should return all brands for super admin', async () => {
      const superAdminUser = {
        ...mockUser,
        role: 'SUPER_ADMIN' as UserRole,
      };
      const superAdminToken = AuthService.generateToken({ userId: superAdminUser.id, email: superAdminUser.email, role: superAdminUser.role, brandId: superAdminUser.brandId });

      // Mock user lookup for super admin
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(superAdminUser);

      const mockBrands = [
        {
          id: 'brand-1',
          name: 'Brand 1',
          slug: 'brand-1',
          _count: { branches: 2 },
          subscription: {
            status: 'ACTIVE',
            endDate: new Date(),
            plan: { name: 'Pro' },
          },
        },
        {
          id: 'brand-2',
          name: 'Brand 2',
          slug: 'brand-2',
          _count: { branches: 1 },
          subscription: null,
        },
      ];

      (prisma.brand.findMany as jest.Mock).mockResolvedValue(mockBrands);

      const request = new NextRequest('http://localhost:3000/api/brands', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${superAdminToken}`,
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.brands).toHaveLength(2);
      expect(data.brands[0].name).toBe('Brand 1');
    });

    it('should return only user brand for brand manager', async () => {
      const mockBrands = [
        {
          id: 'brand-123',
          name: 'My Brand',
          slug: 'my-brand',
          _count: { branches: 3 },
          subscription: {
            status: 'ACTIVE',
            endDate: new Date(),
            plan: { name: 'Basic' },
          },
        },
      ];

      (prisma.brand.findMany as jest.Mock).mockResolvedValue(mockBrands);

      const request = new NextRequest('http://localhost:3000/api/brands', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockToken}`,
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.brands).toHaveLength(1);
      expect(data.brands[0].id).toBe('brand-123');
    });
  });

  describe('GET /api/brands/[id] - Get Brand Details', () => {
    it('should return brand details with branches', async () => {
      const mockBrand = {
        id: 'brand-123',
        name: 'Test Brand',
        slug: 'test-brand',
        logo: 'https://example.com/logo.png',
        tagline: 'Test Tagline',
        colorTheme: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#F59E0B',
        },
        branches: [
          {
            id: 'branch-1',
            name: 'Branch 1',
            slug: 'branch-1',
            isActive: true,
            createdAt: new Date(),
          },
        ],
        subscription: {
          id: 'sub-1',
          status: 'ACTIVE',
          plan: { name: 'Pro' },
        },
        _count: { branches: 1 },
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(mockBrand);

      const request = new NextRequest('http://localhost:3000/api/brands/brand-123', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockToken}`,
        },
      });

      const response = await GET_BY_ID(request, { params: Promise.resolve({ id: 'brand-123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.brand.id).toBe('brand-123');
      expect(data.brand.branches).toHaveLength(1);
    });

    it('should return 404 for non-existent brand', async () => {
      const superAdminUser = {
        ...mockUser,
        role: 'SUPER_ADMIN' as UserRole,
      };
      const superAdminToken = AuthService.generateToken({ userId: superAdminUser.id, email: superAdminUser.email, role: superAdminUser.role, brandId: superAdminUser.brandId });

      // Mock user lookup for super admin
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(superAdminUser);
      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/brands/non-existent', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${superAdminToken}`,
        },
      });

      const response = await GET_BY_ID(request, { params: Promise.resolve({ id: 'non-existent' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Brand not found');
    });

    it('should reject access to other brands for non-super-admin', async () => {
      const request = new NextRequest('http://localhost:3000/api/brands/other-brand', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockToken}`,
        },
      });

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue({
        id: 'other-brand',
        name: 'Other Brand',
        ownerId: 'other-user',
        _count: { branches: 0 },
        subscription: null,
      });

      const response = await GET_BY_ID(request, { params: Promise.resolve({ id: 'other-brand' }) });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden');
    });
  });

  describe('PUT /api/brands/[id] - Update Brand', () => {
    it('should update brand with valid data', async () => {
      const updateData = {
        name: 'Updated Brand Name',
        tagline: 'Updated Tagline',
        colorTheme: {
          primary: '#FF0000',
          secondary: '#00FF00',
          accent: '#0000FF',
        },
      };

      const mockUpdatedBrand = {
        id: 'brand-123',
        name: 'Updated Brand Name',
        slug: 'updated-brand-name',
        tagline: 'Updated Tagline',
        colorTheme: updateData.colorTheme,
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { branches: 2 },
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue({ id: 'brand-123' });
      (prisma.brand.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.brand.update as jest.Mock).mockResolvedValue(mockUpdatedBrand);

      const request = new NextRequest('http://localhost:3000/api/brands/brand-123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(updateData),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: 'brand-123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.brand.name).toBe('Updated Brand Name');
      expect(data.brand.slug).toBe('updated-brand-name');
      expect(prisma.brand.update).toHaveBeenCalled();
    });

    it('should update slug when name changes', async () => {
      const updateData = {
        name: 'New Brand Name',
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue({ id: 'brand-123' });
      (prisma.brand.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.brand.update as jest.Mock).mockResolvedValue({
        id: 'brand-123',
        name: 'New Brand Name',
        slug: 'new-brand-name',
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { branches: 0 },
      });

      const request = new NextRequest('http://localhost:3000/api/brands/brand-123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(updateData),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: 'brand-123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.brand.slug).toBe('new-brand-name');
    });

    it('should ensure slug uniqueness on update', async () => {
      const updateData = {
        name: 'Existing Brand',
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue({ id: 'brand-123' });
      // First call finds existing brand with same slug, second returns null
      (prisma.brand.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: 'other-brand', slug: 'existing-brand' })
        .mockResolvedValueOnce(null);

      (prisma.brand.update as jest.Mock).mockResolvedValue({
        id: 'brand-123',
        name: 'Existing Brand',
        slug: 'existing-brand-1',
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { branches: 0 },
      });

      const request = new NextRequest('http://localhost:3000/api/brands/brand-123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(updateData),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: 'brand-123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.brand.slug).toBe('existing-brand-1');
    });
  });

  describe('DELETE /api/brands/[id] - Delete Brand', () => {
    it('should delete brand without branches', async () => {
      const superAdminUser = {
        ...mockUser,
        role: 'SUPER_ADMIN' as UserRole,
      };
      const superAdminToken = AuthService.generateToken({ userId: superAdminUser.id, email: superAdminUser.email, role: superAdminUser.role, brandId: superAdminUser.brandId });

      // Mock user lookup for super admin
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(superAdminUser);

      const mockBrand = {
        id: 'brand-123',
        name: 'Test Brand',
        _count: { branches: 0 },
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(mockBrand);
      (prisma.brand.delete as jest.Mock).mockResolvedValue(mockBrand);

      const request = new NextRequest('http://localhost:3000/api/brands/brand-123', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${superAdminToken}`,
        },
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: 'brand-123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Brand deleted successfully');
      expect(prisma.brand.delete).toHaveBeenCalledWith({ where: { id: 'brand-123' } });
    });

    it('should prevent deletion of brand with branches', async () => {
      const superAdminUser = {
        ...mockUser,
        role: 'SUPER_ADMIN' as UserRole,
      };
      const superAdminToken = AuthService.generateToken({ userId: superAdminUser.id, email: superAdminUser.email, role: superAdminUser.role, brandId: superAdminUser.brandId });

      // Mock user lookup for super admin
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(superAdminUser);

      const mockBrand = {
        id: 'brand-123',
        name: 'Test Brand',
        _count: { branches: 3 },
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(mockBrand);

      const request = new NextRequest('http://localhost:3000/api/brands/brand-123', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${superAdminToken}`,
        },
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: 'brand-123' }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Cannot delete brand with existing branches');
      expect(prisma.brand.delete).not.toHaveBeenCalled();
    });

    it('should reject deletion by non-super-admin', async () => {
      const request = new NextRequest('http://localhost:3000/api/brands/brand-123', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${mockToken}`,
        },
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: 'brand-123' }) });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden');
    });

    it('should return 404 for non-existent brand', async () => {
      const superAdminUser = {
        ...mockUser,
        role: 'SUPER_ADMIN' as UserRole,
      };
      const superAdminToken = AuthService.generateToken({ userId: superAdminUser.id, email: superAdminUser.email, role: superAdminUser.role, brandId: superAdminUser.brandId });

      // Mock user lookup for super admin
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(superAdminUser);

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/brands/non-existent', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${superAdminToken}`,
        },
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: 'non-existent' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Brand not found');
    });
  });

  describe('Slug Generation and Validation', () => {
    it('should generate valid slug from brand name', async () => {
      const testCases = [
        { name: 'Test Brand', expectedSlug: 'test-brand' },
        { name: 'Brand With Spaces', expectedSlug: 'brand-with-spaces' },
        { name: 'Brand@#$%Special', expectedSlug: 'brandspecial' },
        { name: 'Brand___Multiple___Underscores', expectedSlug: 'brand-multiple-underscores' },
      ];

      for (const testCase of testCases) {
        (prisma.brand.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.brand.create as jest.Mock).mockResolvedValue({
          id: 'brand-test',
          name: testCase.name,
          slug: testCase.expectedSlug,
          ownerId: mockUser.id,
          colorTheme: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' },
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { branches: 0 },
        });

        (prisma.user.update as jest.Mock).mockResolvedValue({});

        const request = new NextRequest('http://localhost:3000/api/brands', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
          body: JSON.stringify({ name: testCase.name }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(data.brand.slug).toBe(testCase.expectedSlug);
      }
    });
  });

  describe('Theme Application', () => {
    it('should store and retrieve custom color theme', async () => {
      const customTheme = {
        primary: '#FF5733',
        secondary: '#33FF57',
        accent: '#3357FF',
      };

      const brandData = {
        name: 'Themed Brand',
        colorTheme: customTheme,
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.brand.create as jest.Mock).mockResolvedValue({
        id: 'brand-456',
        name: 'Themed Brand',
        slug: 'themed-brand',
        colorTheme: customTheme,
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { branches: 0 },
      });

      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = new NextRequest('http://localhost:3000/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(brandData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.brand.colorTheme).toEqual(customTheme);
    });

    it('should update color theme', async () => {
      const newTheme = {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#FF0000',
      };

      (prisma.brand.findUnique as jest.Mock).mockResolvedValue({ id: 'brand-123' });
      (prisma.brand.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.brand.update as jest.Mock).mockResolvedValue({
        id: 'brand-123',
        name: 'Test Brand',
        slug: 'test-brand',
        colorTheme: newTheme,
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { branches: 0 },
      });

      const request = new NextRequest('http://localhost:3000/api/brands/brand-123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify({ colorTheme: newTheme }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: 'brand-123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.brand.colorTheme).toEqual(newTheme);
    });
  });
});
