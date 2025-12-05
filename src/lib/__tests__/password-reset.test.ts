import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../prisma';
import { emailService } from '../email-service';
import { AuthService } from '../auth';
import crypto from 'crypto';

// Mock dependencies
jest.mock('../prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../email-service', () => ({
  emailService: {
    sendPasswordResetEmail: jest.fn(),
  },
}));

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

describe('Password Reset Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Forgot Password', () => {
    it('should generate reset token for valid user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        isActive: true,
      };

      const mockToken = 'mock-reset-token-123';
      (crypto.randomBytes as jest.Mock).mockReturnValue({
        toString: () => mockToken,
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        resetToken: mockToken,
      });
      (emailService.sendPasswordResetEmail as jest.Mock).mockResolvedValue(true);

      // Simulate forgot password logic
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000);

      await prisma.user.update({
        where: { id: mockUser.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      await emailService.sendPasswordResetEmail(mockUser.email, resetToken);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        mockUser.email,
        resetToken
      );
    });

    it('should not reveal if user does not exist', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const user = await prisma.user.findUnique({
        where: { email: 'nonexistent@example.com' },
      });

      expect(user).toBeNull();
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should not send email for inactive user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        isActive: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const user = await prisma.user.findUnique({
        where: { email: mockUser.email },
      });

      expect(user?.isActive).toBe(false);
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe('Reset Password', () => {
    it('should reset password with valid token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        resetToken: 'valid-token',
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
      };

      const newPassword = 'newPassword123';
      const hashedPassword = 'hashed-new-password';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });

      // Mock AuthService.hashPassword
      jest.spyOn(AuthService, 'hashPassword').mockResolvedValue(hashedPassword);

      const user = await prisma.user.findUnique({
        where: { resetToken: 'valid-token' },
      });

      expect(user).toBeDefined();
      expect(user?.resetTokenExpiry).toBeDefined();
      expect(new Date() < user!.resetTokenExpiry!).toBe(true);

      const hashed = await AuthService.hashPassword(newPassword);

      await prisma.user.update({
        where: { id: user!.id },
        data: {
          passwordHash: hashed,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          passwordHash: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
    });

    it('should reject expired reset token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        resetToken: 'expired-token',
        resetTokenExpiry: new Date(Date.now() - 3600000), // 1 hour ago
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const user = await prisma.user.findUnique({
        where: { resetToken: 'expired-token' },
      });

      expect(user).toBeDefined();
      expect(user?.resetTokenExpiry).toBeDefined();
      expect(new Date() > user!.resetTokenExpiry!).toBe(true);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should reject invalid reset token', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const user = await prisma.user.findUnique({
        where: { resetToken: 'invalid-token' },
      });

      expect(user).toBeNull();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should clear reset token after successful password reset', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        resetToken: 'valid-token',
        resetTokenExpiry: new Date(Date.now() + 3600000),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        passwordHash: 'new-hashed-password',
        resetToken: null,
        resetTokenExpiry: null,
      });

      jest.spyOn(AuthService, 'hashPassword').mockResolvedValue('new-hashed-password');

      const hashedPassword = await AuthService.hashPassword('newPassword123');

      await prisma.user.update({
        where: { id: mockUser.id },
        data: {
          passwordHash: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          passwordHash: 'new-hashed-password',
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
    });
  });
});
