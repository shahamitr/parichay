import jwt from 'jsonwebtoken';
import { UserRole } from '../generated/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  brandId?: string;
}

export class JWTService {
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'onetouch-bizcard',
    });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      console.log('✅ JWT verified successfully');
      return decoded;
    } catch (error) {
      console.error('❌ JWT verification failed:', error instanceof Error ? error.message : error);
      return null;
    }
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: '30d',
      issuer: 'onetouch-bizcard-refresh',
    });
  }

  static verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
