import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
        console.warn('Email service not configured. SMTP credentials missing.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: parseInt(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      });

      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your OneTouch BizCard account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all;">${resetUrl}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} OneTouch BizCard. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password - OneTouch BizCard',
      html,
    });
  }

  async sendPaymentReceiptEmail(
    email: string,
    invoiceNumber: string,
    amount: number,
    currency: string,
    pdfUrl?: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10B981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .invoice-details { background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Received</h1>
            </div>
            <div class="content">
              <p>Thank you for your payment!</p>
              <div class="invoice-details">
                <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
                <p><strong>Amount:</strong> ${currency} ${amount.toFixed(2)}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              ${pdfUrl ? `<a href="${pdfUrl}" class="button">Download Invoice</a>` : ''}
              <p>Your subscription has been activated successfully.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} OneTouch BizCard. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Payment Receipt - Invoice ${invoiceNumber}`,
      html,
    });
  }

  async sendSubscriptionRenewalReminder(
    email: string,
    daysUntilExpiry: number,
    planName: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Subscription Renewal Reminder</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your <strong>${planName}</strong> subscription will expire in <strong>${daysUntilExpiry} days</strong>.</p>
              <p>To continue enjoying uninterrupted service, please renew your subscription.</p>
              <a href="${process.env.APP_URL}/dashboard/subscription" class="button">Renew Subscription</a>
              <p>If you have auto-renewal enabled, your subscription will be renewed automatically.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} OneTouch BizCard. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Subscription Renewal Reminder - ${daysUntilExpiry} Days Left`,
      html,
    });
  }

  async sendLicenseExpiryAlert(
    email: string,
    daysUntilExpiry: number,
    licenseKey: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #EF4444; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>License Expiry Alert</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your license (${licenseKey}) will expire in <strong>${daysUntilExpiry} days</strong>.</p>
              <p>After expiration, your microsites will be suspended until you renew your subscription.</p>
              <a href="${process.env.APP_URL}/dashboard/subscription" class="button">Renew Now</a>
              <p>Don't lose access to your digital business cards!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} OneTouch BizCard. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `License Expiry Alert - ${daysUntilExpiry} Days Left`,
      html,
    });
  }
}

export const emailService = new EmailService();

/**
 * Export sendEmail function for backward compatibility
 */
export const sendEmail = emailService.sendEmail.bind(emailService);
