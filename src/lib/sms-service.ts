import twilio from 'twilio';

interface SMSOptions {
  to: string;
  message: string;
}

interface SMSTemplate {
  type: string;
  template: (params: Record<string, any>) => string;
}

class SMSService {
  private client: twilio.Twilio | null = null;
  private fromNumber: string | null = null;
  private templates: Map<string, SMSTemplate> = new Map();

  constructor() {
    this.initializeClient();
    this.initializeTemplates();
  }

  private initializeClient() {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        console.warn('SMS service not configured. Twilio credentials missing.');
        return;
      }

      this.client = twilio(accountSid, authToken);
      this.fromNumber = fromNumber;
      console.log('SMS service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SMS client:', error);
    }
  }

  private initializeTemplates() {
    // Payment Success Template
    this.templates.set('payment_success', {
      type: 'payment_success',
      template: (params) =>
        `OneTouch BizCard: Payment of ₹${params.amount} received successfully. Invoice: ${params.invoiceNumber}. Thank you!`,
    });

    // Payment Failed Template
    this.templates.set('payment_failed', {
      type: 'payment_failed',
      template: (params) =>
        `OneTouch BizCard: Payment of ₹${params.amount} failed. ${params.reason || 'Please try again.'}`,
    });

    // Subscription Renewal Template
    this.templates.set('subscription_renewal', {
      type: 'subscription_renewal',
      template: (params) =>
        `OneTouch BizCard: Your ${params.planName} subscription expires in ${params.daysUntilExpiry} days. Renew now: ${params.renewUrl}`,
    });

    // License Expiring Template
    this.templates.set('license_expiring', {
      type: 'license_expiring',
      template: (params) =>
        `OneTouch BizCard: Your license expires in ${params.daysUntilExpiry} days. Renew to avoid service interruption: ${params.renewUrl}`,
    });

    // New Lead Template
    this.templates.set('new_lead', {
      type: 'new_lead',
      template: (params) =>
        `OneTouch BizCard: New lead from ${params.leadName} for ${params.branchName}. Contact: ${params.leadContact}`,
    });

    // System Alert Template
    this.templates.set('system_alert', {
      type: 'system_alert',
      template: (params) =>
        `OneTouch BizCard Alert: ${params.message}`,
    });

    // Subscription Suspended Template
    this.templates.set('subscription_suspended', {
      type: 'subscription_suspended',
      template: (params) =>
        `OneTouch BizCard: Your subscription has been suspended due to payment failure. Please update payment details.`,
    });

    // Subscription Activated Template
    this.templates.set('subscription_activated', {
      type: 'subscription_activated',
      template: (params) =>
        `OneTouch BizCard: Your ${params.planName} subscription is now active. Welcome!`,
    });
  }

  async sendSMS(options: SMSOptions): Promise<boolean> {
    if (!this.client || !this.fromNumber) {
      console.error('SMS client not initialized');
      return false;
    }

    try {
      // Validate phone number format (basic validation)
      const phoneNumber = this.formatPhoneNumber(options.to);
      if (!phoneNumber) {
        console.error('Invalid phone number format:', options.to);
        return false;
      }

      const message = await this.client.messages.create({
        body: options.message,
        from: this.fromNumber,
        to: phoneNumber,
      });

      console.log(`SMS sent successfully to ${phoneNumber}. SID: ${message.sid}`);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  private formatPhoneNumber(phone: string): string | null {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // If number starts with country code, return as is with +
    if (cleaned.length >= 10) {
      // If it doesn't start with +, add it
      if (!phone.startsWith('+')) {
        // Assume Indian number if 10 digits
        if (cleaned.length === 10) {
          return `+91${cleaned}`;
        }
        return `+${cleaned}`;
      }
      return phone;
    }

    return null;
  }

  async sendTemplatedSMS(
    to: string,
    templateType: string,
    params: Record<string, any>
  ): Promise<boolean> {
    const template = this.templates.get(templateType);
    if (!template) {
      console.error(`SMS template not found: ${templateType}`);
      return false;
    }

    const message = template.template(params);
    return this.sendSMS({ to, message });
  }

  // Specific notification methods
  async sendPaymentSuccessSMS(
    phone: string,
    amount: number,
    invoiceNumber: string
  ): Promise<boolean> {
    return this.sendTemplatedSMS(phone, 'payment_success', {
      amount: amount.toFixed(2),
      invoiceNumber,
    });
  }

  async sendPaymentFailedSMS(
    phone: string,
    amount: number,
    reason?: string
  ): Promise<boolean> {
    return this.sendTemplatedSMS(phone, 'payment_failed', {
      amount: amount.toFixed(2),
      reason,
    });
  }

  async sendSubscriptionRenewalSMS(
    phone: string,
    planName: string,
    daysUntilExpiry: number
  ): Promise<boolean> {
    return this.sendTemplatedSMS(phone, 'subscription_renewal', {
      planName,
      daysUntilExpiry,
      renewUrl: `${process.env.APP_URL}/dashboard/subscription`,
    });
  }

  async sendLicenseExpiringSMS(
    phone: string,
    daysUntilExpiry: number
  ): Promise<boolean> {
    return this.sendTemplatedSMS(phone, 'license_expiring', {
      daysUntilExpiry,
      renewUrl: `${process.env.APP_URL}/dashboard/subscription`,
    });
  }

  async sendNewLeadSMS(
    phone: string,
    leadName: string,
    branchName: string,
    leadContact: string
  ): Promise<boolean> {
    return this.sendTemplatedSMS(phone, 'new_lead', {
      leadName,
      branchName,
      leadContact,
    });
  }

  async sendSystemAlertSMS(
    phone: string,
    message: string
  ): Promise<boolean> {
    return this.sendTemplatedSMS(phone, 'system_alert', {
      message,
    });
  }

  async sendSubscriptionSuspendedSMS(phone: string): Promise<boolean> {
    return this.sendTemplatedSMS(phone, 'subscription_suspended', {});
  }

  async sendSubscriptionActivatedSMS(
    phone: string,
    planName: string
  ): Promise<boolean> {
    return this.sendTemplatedSMS(phone, 'subscription_activated', {
      planName,
    });
  }

  // Template management methods
  addTemplate(type: string, template: (params: Record<string, any>) => string) {
    this.templates.set(type, { type, template });
  }

  getTemplate(type: string): SMSTemplate | undefined {
    return this.templates.get(type);
  }

  getAllTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  removeTemplate(type: string): boolean {
    return this.templates.delete(type);
  }
}

export const smsService = new SMSService();
