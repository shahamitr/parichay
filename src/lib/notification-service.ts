import { prisma } from './prisma';
import { NotificationType } from '@/generated/prisma';
import { emailService } from './email-service';
import { smsService } from './sms-service';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  static async createNotification(params: CreateNotificationParams) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: params.userId,
          type: params.type,
          title: params.title,
          message: params.message,
          metadata: params.metadata || {},
        },
      });

      return notification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  static async notifyPaymentSuccess(userId: string, amount: number, invoiceNumber: string) {
    // Create in-app notification
    const notification = await this.createNotification({
      userId,
      type: 'PAYMENT_SUCCESS',
      title: 'Payment Successful',
      message: `Your payment of ₹${amount.toFixed(2)} has been processed successfully. Invoice: ${invoiceNumber}`,
      metadata: { amount, invoiceNumber },
    });

    // Send email notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true, smsEnabled: true },
    });

    if (user?.email) {
      await emailService.sendPaymentReceiptEmail(
        user.email,
        invoiceNumber,
        amount,
        'INR'
      );
    }

    return notification;
  }

  static async notifyPaymentFailed(userId: string, amount: number, reason?: string) {
    // Create in-app notification
    const notification = await this.createNotification({
      userId,
      type: 'PAYMENT_FAILED',
      title: 'Payment Failed',
      message: `Your payment of ₹${amount.toFixed(2)} could not be processed. ${reason || 'Please try again.'}`,
      metadata: { amount, reason },
    });

    // Send SMS for critical payment failure
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, smsEnabled: true },
    });

    if (user?.phone && user.smsEnabled) {
      await smsService.sendPaymentFailedSMS(user.phone, amount, reason);
    }

    return notification;
  }

  static async notifySubscriptionRenewal(userId: string, planName: string, daysUntilExpiry: number) {
    // Create in-app notification
    const notification = await this.createNotification({
      userId,
      type: 'SUBSCRIPTION_RENEWAL',
      title: 'Subscription Renewal Reminder',
      message: `Your ${planName} subscription will expire in ${daysUntilExpiry} days. Please renew to continue using the service.`,
      metadata: { planName, daysUntilExpiry },
    });

    // Send email notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true, smsEnabled: true },
    });

    if (user?.email) {
      await emailService.sendSubscriptionRenewalReminder(
        user.email,
        daysUntilExpiry,
        planName
      );
    }

    // Send SMS for critical renewal (7 days or less)
    if (daysUntilExpiry <= 7 && user?.phone && user.smsEnabled) {
      await smsService.sendSubscriptionRenewalSMS(user.phone, planName, daysUntilExpiry);
    }

    return notification;
  }

  static async notifySubscriptionExpiring(userId: string, planName: string, expiryDate: Date) {
    return this.createNotification({
      userId,
      type: 'SUBSCRIPTION_EXPIRING',
      title: 'Subscription Expiring Soon',
      message: `Your ${planName} subscription will expire on ${expiryDate.toLocaleDateString()}. Renew now to avoid service interruption.`,
      metadata: { planName, expiryDate: expiryDate.toISOString() },
    });
  }

  static async notifyLicenseExpiring(userId: string, licenseKey: string, daysUntilExpiry: number) {
    // Create in-app notification
    const notification = await this.createNotification({
      userId,
      type: 'LICENSE_EXPIRING',
      title: 'License Expiring Soon',
      message: `Your license (${licenseKey}) will expire in ${daysUntilExpiry} days. Renew to maintain access to your microsites.`,
      metadata: { licenseKey, daysUntilExpiry },
    });

    // Send email notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true, smsEnabled: true },
    });

    if (user?.email) {
      await emailService.sendLicenseExpiryAlert(
        user.email,
        daysUntilExpiry,
        licenseKey
      );
    }

    // Send SMS for critical license expiry (3 days or less)
    if (daysUntilExpiry <= 3 && user?.phone && user.smsEnabled) {
      await smsService.sendLicenseExpiringSMS(user.phone, daysUntilExpiry);
    }

    return notification;
  }

  static async notifyNewLead(userId: string, leadName: string, branchName: string) {
    return this.createNotification({
      userId,
      type: 'NEW_LEAD',
      title: 'New Lead Received',
      message: `You have a new lead from ${leadName} for ${branchName}.`,
      metadata: { leadName, branchName },
    });
  }

  static async notifySystemAlert(userId: string, title: string, message: string, metadata?: Record<string, any>) {
    // Create in-app notification
    const notification = await this.createNotification({
      userId,
      type: 'SYSTEM_ALERT',
      title,
      message,
      metadata,
    });

    // Send SMS for critical system alerts
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, smsEnabled: true },
    });

    if (user?.phone && user.smsEnabled && metadata?.critical === true) {
      await smsService.sendSystemAlertSMS(user.phone, message);
    }

    return notification;
  }
}
