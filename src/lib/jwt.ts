import jwt from 'jsonwebtoken';
import { UserRole } from '../generated/prisma';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is missing in production');
}

if (!process.env.JWT_REFRESH_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_REFRESH_SECRET environment variable is missing in production');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-keep-it-long-and-secure';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-keep-it-long-and-secure';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  brandId?: string;
}

export class JWTService {
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '15m',
      issuer: 'parichay',
    });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
      expiresIn: '30d',
      issuer: 'parichay-refresh',
    });
  }

  static verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
      return decoded;
    } catch {
      return null;
    }
  }
}
