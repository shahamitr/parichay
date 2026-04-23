import { SignJWT, jwtVerify } from 'jose';
import { UserRole } from '../generated/prisma';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is missing in production');
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-key-keep-it-long-and-secure'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  brandId?: string;
}

export class JWTEdgeService {
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        issuer: 'parichay',
      });

      return payload as unknown as JWTPayload;
    } catch (error) {
      // Only log actual errors, not routine token expirations
      if (process.env.NODE_ENV === 'development') {
        console.error('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error');
      }
      return null;
    }
  }
}
