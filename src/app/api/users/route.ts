import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';
import { withApiHandler, apiSuccess, apiError } from '@/lib/api-handler';
import { Prisma, UserRole } from '@/generated/prisma';
import { z } from 'zod';
import { withCache, cacheDelPattern } from '@/lib/cache';

// =============================================================================
// Validation Schemas
// =============================================================================
const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole).optional().default('BRANCH_ADMIN'),
  brandId: z.string().optional(),
  phone: z.string().optional(),
});

// =============================================================================
// GET /api/users - List users with pagination, search, filtering & stats
// =============================================================================
export const GET = withApiHandler(
  { auth: { roles: ['SUPER_ADMIN'] }, rateLimit: 'api' },
  async (request, _context, user) => {
    const { searchParams } = new URL(request.url);

    // Pagination params
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    // Filter params
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
    const includeStats = searchParams.get('includeStats') === 'true';

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    if (status === 'deleted') {
      where.deletedAt = { not: null };
    } else if (status === 'active') {
      where.deletedAt = null;
      where.isActive = true;
    } else if (status === 'inactive') {
      where.deletedAt = null;
      where.isActive = false;
    } else {
      where.deletedAt = null;
    }

    if (role && Object.values(UserRole).includes(role as UserRole)) {
      where.role = role as UserRole;
    }

    if (search.trim()) {
      where.OR = [
        { firstName: { contains: search.trim() } },
        { lastName: { contains: search.trim() } },
        { email: { contains: search.trim() } },
        { brand: { name: { contains: search.trim() } } },
      ];
    }

    const allowedSortFields = ['createdAt', 'firstName', 'lastName', 'email', 'role', 'lastLoginAt'];
    const orderByField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderBy: Prisma.UserOrderByWithRelationInput = { [orderByField]: sortOrder };

    const [users, total, stats] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          phone: true,
          lastLoginAt: true,
          lastLogoutAt: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
          emailVerified: true,
          mfaEnabled: true,
          brandId: true,
          brand: { select: { id: true, name: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
      includeStats ? withCache('api:user-stats', getUserStats, 60) : null,
    ]);

    const response = NextResponse.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      ...(stats ? { stats } : {}),
    });

    response.headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
    return response;
  }
);

// =============================================================================
// POST /api/users - Create a new user
// =============================================================================
export const POST = withApiHandler(
  { auth: { roles: ['SUPER_ADMIN'] }, rateLimit: 'api' },
  async (request, _context, _user) => {
    const body = await request.json();
    const parsed = createUserSchema.parse(body); // Throws ZodError if invalid

    const { email, firstName, lastName, password, role, brandId, phone } = parsed;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return apiError('A user with this email already exists', 409);
    }

    // Hash password
    const { AuthService } = await import('@/lib/auth');
    const passwordHash = await AuthService.hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
        role,
        brandId: brandId || null,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        brand: { select: { id: true, name: true } },
      },
    });

    await cacheDelPattern('api:user-stats*');

    return NextResponse.json({ user: newUser }, { status: 201 });
  }
);

// =============================================================================
// Helper: Get aggregate stats for the user management dashboard
// =============================================================================
async function getUserStats() {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    deletedUsers,
    roleCounts,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, isActive: true } }),
    prisma.user.count({ where: { deletedAt: null, isActive: false } }),
    prisma.user.count({ where: { deletedAt: { not: null } } }),
    prisma.user.groupBy({
      by: ['role'],
      where: { deletedAt: null },
      _count: { role: true },
    }),
  ]);

  const roleMap: Record<string, number> = {};
  for (const entry of roleCounts) {
    roleMap[entry.role] = entry._count.role;
  }

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    deletedUsers,
    byRole: roleMap,
  };
}
