import bcrypt from 'bcrypt';
import { JWTService } from './jwt';
import type { JWTPayload } from './jwt';

export type { JWTPayload };

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: JWTPayload): string {
    return JWTService.generateToken(payload);
  }

  static verifyToken(token: string): JWTPayload | null {
    return JWTService.verifyToken(token);
  }

  static generateRefreshToken(userId: string): string {
    return JWTService.generateRefreshToken(userId);
  }

  static verifyRefreshToken(token: string): { userId: string } | null {
    return JWTService.verifyRefreshToken(token);
  }
}
/**
 * Verify token from NextRequest for API routes
 */
export async function verifyToken(request: Request | string): Promise<JWTPayload | null> {
  try {
    const token = typeof request === 'string' 
      ? request 
      : request.headers.get('authorization')?.substring(7) || 
        request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];
        
    if (!token) return null;
    return AuthService.verifyToken(token);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Get the authenticated user record from the database
 */
export async function getAuthUser(request: Request | string): Promise<any | null> {
  const payload = await verifyToken(request);
  if (!payload) return null;

  const { prisma } = await import('./prisma');
  return prisma.user.findUnique({
    where: { id: payload.userId }
  });
}
