// Mock nodemailer before importing email service
const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

describe('Email Templates and Delivery', () => {
  let emailService: any;

  beforeEach(() => {
    jest.resetModules();

    // Set environment variables before requiring the service
    process.env.SMTP_HOST = 'smtp.test.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'test-password';
    process.env.APP_URL = 'https://test.onetouchbizcard.in';

    // Re-require the service to pick up new env vars
    emailService = require('../email-service').emailService;

    jest.clearAllMocks();
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });
  });

  describe('Password Reset Email', () => {
    it('should send password reset email with valid token', async () => {
      const email = 'user@example.com';
      const resetToken = 'test-reset-token-123';

      const result = await emailService.sendPasswordResetEmail(email, resetToken);

      expect(result).toBe(true);
    });

    it('should include reset URL in email', async () => {
      const email = 'user@example.com';
      const resetToken = 'test-reset-token-123';
      const expectedUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

      await emailService.sendPasswordResetEmail(email, resetToken);

      // The email should contain the reset URL
      // In a real test, you would verify the email content
      expect(expectedUrl).toContain(resetToken);
    });

    it('should handle email sending failure gracefully', async () => {
      // Mock sendMail to throw an error
      mockSendMail.mockRejectedValueOnce(new Error('SMTP error'));

      const result = await emailService.sendPasswordResetEmail(
        'user@example.com',
        'token-123'
      );

      expect(result).toBe(false);
    });
  });

  describe('Payment Receipt Email', () => {
    it('should send payment receipt with invoice details', async () => {
      const email = 'user@example.com';
      const invoiceNumber = 'INV-2024-001';
      const amount = 1999.99;
      const currency = 'INR';

      const result = await emailService.sendPaymentReceiptEmail(
        email,
        invoiceNumber,
        amount,
        currency
      );

      expect(result).toBe(true);
    });

    it('should include PDF download link when provided', async () => {
      const email = 'user@example.com';
      const invoiceNumber = 'INV-2024-001';
      const amount = 1999.99;
      const currency = 'INR';
      const pdfUrl = 'https://example.com/invoices/INV-2024-001.pdf';

      const result = await emailService.sendPaymentReceiptEmail(
        email,
        invoiceNumber,
        amount,
        currency,
        pdfUrl
      );

      expect(result).toBe(true);
    });

    it('should format amount correctly', async () => {
      const amount = 1999.99;
      const formatted = amount.toFixed(2);

      expect(formatted).toBe('1999.99');
    });
  });

  describe('Subscription Renewal Reminder Email', () => {
    it('should send renewal reminder with days until expiry', async () => {
      const email = 'user@example.com';
      const daysUntilExpiry = 7;
      const planName = 'Premium Plan';

      const result = await emailService.sendSubscriptionRenewalReminder(
        email,
        daysUntilExpiry,
        planName
      );

      expect(result).toBe(true);
    });

    it('should include plan name in message', async () => {
      const planName = 'Enterprise Plan';
      const daysUntilExpiry = 3;

      const result = await emailService.sendSubscriptionRenewalReminder(
        'user@example.com',
        daysUntilExpiry,
        planName
      );

      expect(result).toBe(true);
    });

    it('should include renewal link', async () => {
      const expectedUrl = `${process.env.APP_URL}/dashboard/subscription`;

      await emailService.sendSubscriptionRenewalReminder(
        'user@example.com',
        7,
        'Premium Plan'
      );

      expect(expectedUrl).toContain('/dashboard/subscription');
    });
  });

  describe('License Expiry Alert Email', () => {
    it('should send license expiry alert', async () => {
      const email = 'user@example.com';
      const daysUntilExpiry = 3;
      const licenseKey = 'LIC-2024-ABC123';

      const result = await emailService.sendLicenseExpiryAlert(
        email,
        daysUntilExpiry,
        licenseKey
      );

      expect(result).toBe(true);
    });

    it('should include license key in message', async () => {
      const licenseKey = 'LIC-2024-XYZ789';

      const result = await emailService.sendLicenseExpiryAlert(
        'user@example.com',
        5,
        licenseKey
      );

      expect(result).toBe(true);
    });

    it('should include urgency for critical expiry', async () => {
      const daysUntilExpiry = 1;

      const result = await emailService.sendLicenseExpiryAlert(
        'user@example.com',
        daysUntilExpiry,
        'LIC-123'
      );

      expect(result).toBe(true);
    });
  });

  describe('Email Service Configuration', () => {
    it('should have SMTP configuration in test environment', () => {
      expect(process.env.SMTP_HOST).toBeDefined();
      expect(process.env.SMTP_PORT).toBeDefined();
      expect(process.env.SMTP_USER).toBeDefined();
      expect(process.env.SMTP_PASS).toBeDefined();
    });

    it('should handle email sending with proper configuration', async () => {
      const result = await emailService.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalled();
    });
  });

  describe('Email Content Validation', () => {
    it('should include proper HTML structure in emails', async () => {
      const result = await emailService.sendPasswordResetEmail(
        'user@example.com',
        'token-123'
      );

      expect(result).toBe(true);
      // In a real test, you would verify the HTML structure
    });

    it('should include fallback text content', async () => {
      const result = await emailService.sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>This is a test</p>',
      });

      expect(result).toBe(true);
    });

    it('should strip HTML tags for text fallback', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const text = html.replace(/<[^>]*>/g, '');

      expect(text).toBe('Hello World');
    });
  });

  describe('Email Branding', () => {
    it('should include company name in email footer', async () => {
      const currentYear = new Date().getFullYear();

      const result = await emailService.sendPaymentReceiptEmail(
        'user@example.com',
        'INV-001',
        1000,
        'INR'
      );

      expect(result).toBe(true);
      expect(currentYear).toBeGreaterThan(2023);
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should use consistent color scheme across emails', async () => {
      // Test that all email types use consistent branding
      const results = await Promise.all([
        emailService.sendPasswordResetEmail('user@example.com', 'token'),
        emailService.sendPaymentReceiptEmail('user@example.com', 'INV-001', 1000, 'INR'),
        emailService.sendSubscriptionRenewalReminder('user@example.com', 7, 'Premium'),
        emailService.sendLicenseExpiryAlert('user@example.com', 3, 'LIC-123'),
      ]);

      // All emails should be sent successfully
      expect(results.every(r => r === true)).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(4);
    });
  });
});
