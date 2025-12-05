import { SignJWT, jwtVerify } from 'jose';
import { UserRole } from '../generated/prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
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
        issuer: 'onetouch-bizcard',
      });

      console.log('✅ JWT verified successfully (Edge Runtime)');
      return payload as unknown as JWTPayload;
    } catch (error) {
      console.error('❌ JWT verification failed (Edge):', error instanceof Error ? error.message : error);
      return null;
    }
  }
}
