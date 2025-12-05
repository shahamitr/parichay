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

 * Export verifyToken function for backward compatibility
 */
export const verifyToken = AuthService.verifyToken.bind(AuthService);
