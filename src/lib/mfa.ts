/**
 * MFA (Multi-Factor Authentication) Service
 * Handles TOTP-based two-factor authentication
 */

import * as speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';

const APP_NAME = 'Parichay';

interface MFASetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export class MFAService {
  /**
   * Generate a new MFA secret and QR code for setup
   */
  static async generateMFASecret(email: string): Promise<MFASetup> {
    // Generate secret
    const secretObj = speakeasy.generateSecret({
      name: email,
      issuer: APP_NAME,
      length: 32
    });

    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(secretObj.otpauth_url!);

    // Generate backup codes
    const backupCodes = MFAService.generateBackupCodes(8);

    return {
      secret: secretObj.base32,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Verify a TOTP token
   */
  static verifyTOTP(token: string, secret: string): boolean {
    try {
      return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2 // Allow 2 time steps before/after for clock drift
      });
    } catch (error) {
      console.error('TOTP verification error:', error);
      return false;
    }
  }

  /**
   * Generate random backup codes
   */
  static generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = Array.from(
        { length: 8 },
        () => '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 36)]
      ).join('');
      codes.push(code);
    }
    return codes;
  }

  /**
   * Hash backup codes for secure storage
   */
  static async hashBackupCodes(codes: string[]): Promise<string[]> {
    const hashedCodes = await Promise.all(
      codes.map(code => bcrypt.hash(code, 10))
    );
    return hashedCodes;
  }

  /**
   * Verify a backup code against stored hashed codes
   * Returns the index of the matched code, or -1 if no match
   */
  static async verifyBackupCode(
    code: string,
    hashedCodes: string[]
  ): Promise<number> {
    for (let i = 0; i < hashedCodes.length; i++) {
      const isMatch = await bcrypt.compare(code.toUpperCase(), hashedCodes[i]);
      if (isMatch) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Remove a used backup code from the list
   */
  static removeBackupCode(hashedCodes: string[], index: number): string[] {
    const newCodes = [...hashedCodes];
    newCodes.splice(index, 1);
    return newCodes;
  }

  /**
   * Check if user has MFA enabled and needs verification
   */
  static isMFARequired(user: { mfaEnabled: boolean }): boolean {
    return user.mfaEnabled === true;
  }

  /**
   * Generate a temporary MFA verification token for login flow
   */
  static generateMFASessionToken(): string {
    return Array.from(
      { length: 32 },
      () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[
        Math.floor(Math.random() * 62)
      ]
    ).join('');
  }
}

export default MFAService;
