import { NotificationService } from '../notification-service';
import { prisma } from '../prisma';
import { emailService } from '../email-service';
import { smsService } from '../sms-service';
import { NotificationType } from '@/generated/prisma';

// Mock dependencies
jest.mock('../prisma', () => ({
  prisma: {
    notification: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../email-service', () => ({
  emailService: {
    sendPaymentReceiptEmail: jest.fn(),
    sendSubscriptionRenewalReminder: jest.fn(),
    sendLicenseExpiryAlert: jest.fn(),
  },
}));

jest.mock('../sms-service', () => ({
  smsService: {
    sendPaymentFailedSMS: jest.fn(),
    sendSubscriptionRenewalSMS: jest.fn(),
    sendLicenseExpiringSMS: jest.fn(),
    sendSystemAlertSMS: jest.fn(),
  },
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create in-app notification', async () => {
      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'PAYMENT_SUCCESS' as NotificationType,
        title: 'Payment Successful',
        message: 'Your payment has been processed',
        metadata: { amount: 1000 },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      const result = await NotificationService.createNotification({
        userId: 'user-123',
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Successful',
        message: 'Your payment has been processed',
        metadata: { amount: 1000 },
      });

      expect(result).toEqual(mockNotification);
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          type: 'PAYMENT_SUCCESS',
          title: 'Payment Successful',
          message: 'Your payment has been processed',
          metadata: { amount: 1000 },
        },
      });
    });

    it('should handle notification creation without metadata', async () => {
      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'NEW_LEAD' as NotificationType,
        title: 'New Lead',
        message: 'You have a new lead',
        metadata: {},
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      const result = await NotificationService.createNotification({
        userId: 'user-123',
        type: 'NEW_LEAD',
        title: 'New Lead',
        message: 'You have a new lead',
      });

      expect(result).toEqual(mockNotification);
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          type: 'NEW_LEAD',
          title: 'New Lead',
          message: 'You have a new lead',
          metadata: {},
        },
      });
    });
  });

  describe('notifyPaymentSuccess', () => {
    it('should create notification and send email for payment success', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        phone: '+1234567890',
        smsEnabled: false,
      };

      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'PAYMENT_SUCCESS' as NotificationType,
        title: 'Payment Successful',
        message: 'Your payment of ₹1000.00 has been processed successfully. Invoice: INV-001',
        metadata: { amount: 1000, invoiceNumber: 'INV-001' },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendPaymentReceiptEmail as jest.Mock).mockResolvedValue(true);

      const result = await NotificationService.notifyPaymentSuccess('user-123', 1000, 'INV-001');

      expect(result).toEqual(mockNotification);
      expect(prisma.notification.create).toHaveBeenCalled();
      expect(emailService.sendPaymentReceiptEmail).toHaveBeenCalledWith(
        'test@example.com',
        'INV-001',
        1000,
        'INR'
      );
    });

    it('should not send email if user has no email', async () => {
      const mockUser = {
        id: 'user-123',
        email: null,
        phone: '+1234567890',
        smsEnabled: false,
      };

      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'PAYMENT_SUCCESS' as NotificationType,
        title: 'Payment Successful',
        message: 'Your payment of ₹1000.00 has been processed successfully. Invoice: INV-001',
        metadata: { amount: 1000, invoiceNumber: 'INV-001' },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await NotificationService.notifyPaymentSuccess('user-123', 1000, 'INV-001');

      expect(emailService.sendPaymentReceiptEmail).not.toHaveBeenCalled();
    });
  });

  describe('notifyPaymentFailed', () => {
    it('should create notification and send SMS for payment failure', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        phone: '+1234567890',
        smsEnabled: true,
      };

      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'PAYMENT_FAILED' as NotificationType,
        title: 'Payment Failed',
        message: 'Your payment of ₹1000.00 could not be processed. Insufficient funds',
        metadata: { amount: 1000, reason: 'Insufficient funds' },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (smsService.sendPaymentFailedSMS as jest.Mock).mockResolvedValue(true);

      const result = await NotificationService.notifyPaymentFailed(
        'user-123',
        1000,
        'Insufficient funds'
      );

      expect(result).toEqual(mockNotification);
      expect(smsService.sendPaymentFailedSMS).toHaveBeenCalledWith(
        '+1234567890',
        1000,
        'Insufficient funds'
      );
    });

    it('should not send SMS if SMS is disabled', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        phone: '+1234567890',
        smsEnabled: false,
      };

      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'PAYMENT_FAILED' as NotificationType,
        title: 'Payment Failed',
        message: 'Your payment of ₹1000.00 could not be processed. Please try again.',
        metadata: { amount: 1000, reason: undefined },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await NotificationService.notifyPaymentFailed('user-123', 1000);

      expect(smsService.sendPaymentFailedSMS).not.toHaveBeenCalled();
    });
  });

  describe('notifySubscriptionRenewal', () => {
    it('should send email for subscription renewal reminder', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        phone: '+1234567890',
        smsEnabled: false,
      };

      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'SUBSCRIPTION_RENEWAL' as NotificationType,
        title: 'Subscription Renewal Reminder',
        message: 'Your Premium Plan subscription will expire in 15 days. Please renew to continue using the service.',
        metadata: { planName: 'Premium Plan', daysUntilExpiry: 15 },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendSubscriptionRenewalReminder as jest.Mock).mockResolvedValue(true);

      await NotificationService.notifySubscriptionRenewal('user-123', 'Premium Plan', 15);

      expect(emailService.sendSubscriptionRenewalReminder).toHaveBeenCalledWith(
        'test@example.com',
        15,
        'Premium Plan'
      );
      expect(smsService.sendSubscriptionRenewalSMS).not.toHaveBeenCalled();
    });

    it('should send SMS for critical renewal (7 days or less)', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        phone: '+1234567890',
        smsEnabled: true,
      };

      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'SUBSCRIPTION_RENEWAL' as NotificationType,
        title: 'Subscription Renewal Reminder',
        message: 'Your Premium Plan subscription will expire in 5 days. Please renew to continue using the service.',
        metadata: { planName: 'Premium Plan', daysUntilExpiry: 5 },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendSubscriptionRenewalReminder as jest.Mock).mockResolvedValue(true);
      (smsService.sendSubscriptionRenewalSMS as jest.Mock).mockResolvedValue(true);

      await NotificationService.notifySubscriptionRenewal('user-123', 'Premium Plan', 5);

      expect(emailService.sendSubscriptionRenewalReminder).toHaveBeenCalled();
      expect(smsService.sendSubscriptionRenewalSMS).toHaveBeenCalledWith(
        '+1234567890',
        'Premium Plan',
        5
      );
    });
  });

  describe('notifyLicenseExpiring', () => {
    it('should send email for license expiry alert', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        phone: '+1234567890',
        smsEnabled: false,
      };

      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'LICENSE_EXPIRING' as NotificationType,
        title: 'License Expiring Soon',
        message: 'Your license (LIC-123) will expire in 10 days. Renew to maintain access to your microsites.',
        metadata: { licenseKey: 'LIC-123', daysUntilExpiry: 10 },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendLicenseExpiryAlert as jest.Mock).mockResolvedValue(true);

      await NotificationService.notifyLicenseExpiring('user-123', 'LIC-123', 10);

      expect(emailService.sendLicenseExpiryAlert).toHaveBeenCalledWith(
        'test@example.com',
        10,
        'LIC-123'
      );
      expect(smsService.sendLicenseExpiringSMS).not.toHaveBeenCalled();
    });

    it('should send SMS for critical license expiry (3 days or less)', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        phone: '+1234567890',
        smsEnabled: true,
      };

      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'LICENSE_EXPIRING' as NotificationType,
        title: 'License Expiring Soon',
        message: 'Your license (LIC-123) will expire in 2 days. Renew to maintain access to your microsites.',
        metadata: { licenseKey: 'LIC-123', daysUntilExpiry: 2 },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendLicenseExpiryAlert as jest.Mock).mockResolvedValue(true);
      (smsService.sendLicenseExpiringSMS as jest.Mock).mockResolvedValue(true);

      await NotificationService.notifyLicenseExpiring('user-123', 'LIC-123', 2);

      expect(emailService.sendLicenseExpiryAlert).toHaveBeenCalled();
      expect(smsService.sendLicenseExpiringSMS).toHaveBeenCalledWith('+1234567890', 2);
    });
  });

  describe('notifyNewLead', () => {
    it('should create notification for new lead', async () => {
      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'NEW_LEAD' as NotificationType,
        title: 'New Lead Received',
        message: 'You have a new lead from John Doe for Downtown Branch.',
        metadata: { leadName: 'John Doe', branchName: 'Downtown Branch' },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      const result = await NotificationService.notifyNewLead(
        'user-123',
        'John Doe',
        'Downtown Branch'
      );

      expect(result).toEqual(mockNotification);
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          type: 'NEW_LEAD',
          title: 'New Lead Received',
          message: 'You have a new lead from John Doe for Downtown Branch.',
          metadata: { leadName: 'John Doe', branchName: 'Downtown Branch' },
        },
      });
    });
  });

  describe('notifySystemAlert', () => {
    it('should create system alert notification', async () => {
      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'SYSTEM_ALERT' as NotificationType,
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Sunday',
        metadata: { critical: false },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        phone: '+1234567890',
        smsEnabled: true,
      });

      await NotificationService.notifySystemAlert(
        'user-123',
        'System Maintenance',
        'Scheduled maintenance on Sunday',
        { critical: false }
      );

      expect(prisma.notification.create).toHaveBeenCalled();
      expect(smsService.sendSystemAlertSMS).not.toHaveBeenCalled();
    });

    it('should send SMS for critical system alerts', async () => {
      const mockUser = {
        id: 'user-123',
        phone: '+1234567890',
        smsEnabled: true,
      };

      const mockNotification = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'SYSTEM_ALERT' as NotificationType,
        title: 'Critical Alert',
        message: 'System outage detected',
        metadata: { critical: true },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (smsService.sendSystemAlertSMS as jest.Mock).mockResolvedValue(true);

      await NotificationService.notifySystemAlert(
        'user-123',
        'Critical Alert',
        'System outage detected',
        { critical: true }
      );

      expect(smsService.sendSystemAlertSMS).toHaveBeenCalledWith(
        '+1234567890',
        'System outage detected'
      );
    });
  });
});
