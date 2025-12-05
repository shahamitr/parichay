import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export interface MFASetupResult {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export class MFAService {
  /**
   * Generate a new MFA secret and QR code for TOTP setup
   */
  static async generateMFASecret(userEmail: string, issuer: string = 'OneTouch BizCard'): Promise<MFASetupResult> {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${issuer} (${userEmail})`,
      issuer: issuer,
      length: 32,
    });

    if (!secret.base32) {
      throw new Error('Failed to generate MFA secret');
    }

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(10);

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Verify a TOTP token against a secret
   */
  static verifyTOTP(token: string, secret: string): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2, // Allow 2 time steps before and after for clock drift
    });
  }

  /**
   * Generate backup codes for account recovery
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
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
   */
  static async verifyBackupCode(code: string, hashedCodes: string[]): Promise<{ valid: boolean; remainingCodes: string[] }> {
    for (let i = 0; i < hashedCodes.length; i++) {
      const isValid = await bcrypt.compare(code, hashedCodes[i]);
      if (isValid != null) {
        // Remove the used backup code
        const remainingCodes = [...hashedCodes];
        remainingCodes.splice(i, 1);
        return { valid: true, remainingCodes };
      }
    }
    return { valid: false, remainingCodes: hashedCodes };
  }

  /**
   * Check if MFA is required for a sensitive operation
   */
  static isSensitiveOperation(operation: string): boolean {
    const sensitiveOperations = [
      'change_password',
      'update_email',
      'delete_account',
      'update_payment_method',
      'disable_mfa',
      'export_data',
    ];
    return sensitiveOperations.includes(operation);
  }
}
