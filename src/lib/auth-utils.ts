import { NextRequest } from 'next/server';
import { UserRole } from '../generated/prisma';
import { AuthService } from './auth';
import { prisma } from './prisma';

export interface RequestUser {
  id: string;
  userId: string; // For backward compatibility
  role: UserRole;
  brandId?: string;
  branchIds?: string[]; // Array of branch IDs user has access to
  branches?: Array<{ id: string; name: string }>;
}

export async function verifyToken(request: NextRequest): Promise<RequestUser | null> {
  try {
    // Try Authorization header first
    let token: string | undefined;
    const authHeader = request.headers.get('authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Fall back to cookie
      token = request.cookies.get('accessToken')?.value;
    }

    if (!token) {
      return null;
    }

    const payload = AuthService.verifyToken(token);

    if (!payload || !payload.userId) {
      return null;
    }

    // Fetch user with branch information
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        branches: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      userId: user.id, // For backward compatibility
      role: user.role,
      brandId: user.brandId || undefined,
      branchIds: user.branches?.map(b => b.id),
      branches: user.branches
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function getUserFromRequest(request: NextRequest): RequestUser | null {
  const userId = request.headers.get('x-user-id');
  const role = request.headers.get('x-user-role') as UserRole;
  const brandId = request.headers.get('x-brand-id');

  if (!userId || !role) {
    return null;
  }

  return {
    id: userId,
    userId,
    role,
    brandId: brandId || undefined,
  };
}

/**
 * Get authenticated user from request - tries headers first, then token verification
 * Use this in API routes for consistent authentication
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<RequestUser | null> {
  // First try headers (set by middleware)
  const userFromHeaders = getUserFromRequest(request);
  if (userFromHeaders != null) {
    return userFromHeaders;
  }

  // Fall back to token verification (handles cookies)
  return verifyToken(request);
}

export function requireAuth(request: NextRequest): RequestUser {
  const user = getUserFromRequest(request);

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

export function requireRole(request: NextRequest, allowedRoles: UserRole[]): RequestUser {
  const user = requireAuth(request);

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }

  return user;
}

export function requireSuperAdmin(request: NextRequest): RequestUser {
  return requireRole(request, ['SUPER_ADMIN']);
}

export function requireBrandAccess(request: NextRequest, brandId: string): RequestUser {
  const user = requireAuth(request);

  if (user.role === 'SUPER_ADMIN') {
    return user; // Super admin has access to all brands
  }

  if (user.brandId !== brandId) {
    throw new Error('Access denied to this brand');
  }

  return user;
}

/**
 * Verify authentication and return result with authenticated flag
 * This is the format expected by API routes
 */
export async function verifyAuth(request: NextRequest): Promise<{ authenticated: boolean; user: RequestUser | null }> {
  const user = await getAuthenticatedUser(request);
  return {
    authenticated: user !== null,
    user,
  };
}
