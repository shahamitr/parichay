# Email Service Setup - Quick Reference

## SendGrid Setup (Recommended)

### 1. Create SendGrid Account

1. Go to https://signup.sendgrid.com/
2. Sign up with business email
3. Complete account verification
4. Choose free plan (100 emails/day) or paid plan

### 2. Verify Domain

1. Go to Settings → Sender Authentication
2. Click "Authenticate Your Domain"
3. Select your DNS host
4. Add the following DNS records:

```
# CNAME Records for Domain Authentication
Type: CNAME
Host: em1234.onetouchbizcard.in
Value: u1234567.wl123.sendgrid.net
TTL: 300

Type: CNAME
Host: s1._domainkey.onetouchbizcard.in
Value: s1.domainkey.u1234567.wl123.sendgrid.net
TTL: 300

Type: CNAME
Host: s2._domainkey.onetouchbizcard.in
Value: s2.domainkey.u1234567.wl123.sendgrid.net
TTL: 300
```

4. Wait for DNS propagation (up to 48 hours)
5. Click "Verify" in SendGrid dashboard

### 3. Verify Single Sender (Quick Start)

1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Enter sender details:
   - From Name: OneTouch BizCard
   - From Email: noreply@onetouchbizcard.in
   - Reply To: support@onetouchbizcard.in
4. Check email and click verification link

### 4. Create API Key

1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: "OneTouch BizCard Production"
4. Permissions: "Full Access" or "Mail Send" only
5. Click "Create & View"
6. Copy API key (starts with `SG.`)
7. **Important**: Save immediately, you won't see it again

### 5. Environment Variables

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.your_api_key_here"
SMTP_FROM="noreply@onetouchbizcard.in"
SMTP_FROM_NAME="OneTouch BizCard"
```

### 6. Install Nodemailer

```bash
npm install nodemailer @types/nodemailer
```

### 7. Email Service Implementation

```typescript
// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

// Email templates
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Welcome to OneTouch BizCard',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining OneTouch BizCard.</p>
      <p>Get started by creating your first microsite.</p>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
  await sendEmail({
    to,
    subject: 'Reset Your Password',
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
}

export async function sendPaymentReceiptEmail(
  to: string,
  amount: number,
  invoiceUrl: string
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Payment Receipt',
    html: `
      <h1>Payment Successful</h1>
      <p>Thank you for your payment of ₹${amount}.</p>
      <p><a href="${invoiceUrl}">Download Invoice</a></p>
    `,
  });
}

export async function sendSubscriptionRenewalReminder(
  to: string,
  expiryDate: Date
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Subscription Renewal Reminder',
    html: `
      <h1>Subscription Expiring Soon</h1>
      <p>Your subscription expires on ${expiryDate.toLocaleDateString()}.</p>
      <p>Renew now to continue using OneTouch BizCard.</p>
    `,
  });
}

export async function sendLeadNotification(
  to: string,
  leadData: any
): Promise<void> {
  await sendEmail({
    to,
    subject: 'New Lead Received',
    html: `
      <h1>New Lead</h1>
      <p><strong>Name:</strong> ${leadData.name}</p>
      <p><strong>Email:</strong> ${leadData.email}</p>
      <p><strong>Phone:</strong> ${leadData.phone}</p>
      <p><strong>Message:</strong> ${leadData.message}</p>
    `,
  });
}

export default transporter;
```

### 8. Test Email Sending

```typescript
// scripts/test-email.ts
import { sendEmail } from '../lib/email';

async function testEmail() {
  try {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Test Email</h1><p>This is a test email.</p>',
    });
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Test email failed:', error);
  }
}

testEmail();
```

Run test:
```bash
npx tsx scripts/test-email.ts
```

### 9. Monitor Email Delivery

1. Go to Activity → Activity Feed
2. View email delivery status
3. Check bounce and spam reports
4. Monitor email engagement (opens, clicks)

---

## AWS SES Setup (Alternative)

### 1. Set Up AWS SES

1. Go to AWS SES Console
2. Select region (e.g., ap-south-1)
3. Verify email address or domain

### 2. Verify Domain

```bash
# Verify domain identity
aws ses verify-domain-identity --domain onetouchbizcard.in --region ap-south-1
```

Add DNS records:
```
# TXT Record for Domain Verification
Type: TXT
Name: _amazonses.onetouchbizcard.in
Value: [verification token from AWS]
TTL: 300

# MX Record for Receiving Emails (optional)
Type: MX
Name: onetouchbizcard.in
Value: 10 inbound-smtp.ap-south-1.amazonaws.com
TTL: 300

# CNAME Records for DKIM
Type: CNAME
Name: [token1]._domainkey.onetouchbizcard.in
Value: [token1].dkim.amazonses.com
TTL: 300

Type: CNAME
Name: [token2]._domainkey.onetouchbizcard.in
Value: [token2].dkim.amazonses.com
TTL: 300

Type: CNAME
Name: [token3]._domainkey.onetouchbizcard.in
Value: [token3].dkim.amazonses.com
TTL: 300
```

### 3. Request Production Access

1. Go to Account Dashboard
2. Click "Request Production Access"
3. Fill out the form:
   - Use case: Transactional emails for SaaS platform
   - Website URL: https://onetouchbizcard.in
   - Expected sending volume: [your estimate]
   - Bounce/complaint handling: Describe your process
4. Submit request
5. Wait for approval (usually 24-48 hours)

### 4. Create SMTP Credentials

1. Go to SMTP Settings
2. Click "Create My SMTP Credentials"
3. Download credentials
4. Save username and password

### 5. Environment Variables

```env
SMTP_HOST="email-smtp.ap-south-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="AKIAIOSFODNN7EXAMPLE"
SMTP_PASS="your_smtp_password"
SMTP_FROM="noreply@onetouchbizcard.in"
SMTP_FROM_NAME="OneTouch BizCard"
```

### 6. Configure SNS for Bounce/Complaint Handling

```bash
# Create SNS topic
aws sns create-topic --name ses-bounces --region ap-south-1

# Subscribe to topic
aws sns subscribe \
  --topic-arn arn:aws:sns:ap-south-1:123456789012:ses-bounces \
  --protocol https \
  --notification-endpoint https://onetouchbizcard.in/api/webhooks/ses

# Configure SES to publish to SNS
aws ses set-identity-notification-topic \
  --identity onetouchbizcard.in \
  --notification-type Bounce \
  --sns-topic arn:aws:sns:ap-south-1:123456789012:ses-bounces
```

---

## Email Templates

### Welcome Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to OneTouch BizCard</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #3399cc; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 24px; background: #3399cc; color: white; text-decoration: none; border-radius: 4px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to OneTouch BizCard</h1>
    </div>
    <div class="content">
      <h2>Hi {{name}},</h2>
      <p>Thank you for joining OneTouch BizCard! We're excited to help you create stunning digital business cards.</p>
      <p>Get started by creating your first microsite:</p>
      <p style="text-align: center;">
        <a href="{{dashboardUrl}}" class="button">Go to Dashboard</a>
      </p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 OneTouch BizCard. All rights reserved.</p>
      <p><a href="{{unsubscribeUrl}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
```

### Password Reset Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hi {{name}},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <p style="text-align: center;">
        <a href="{{resetUrl}}" class="button">Reset Password</a>
      </p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 OneTouch BizCard. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### Payment Receipt Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payment Receipt</title>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Successful</h1>
    </div>
    <div class="content">
      <p>Hi {{name}},</p>
      <p>Thank you for your payment!</p>
      <table style="width: 100%; margin: 20px 0;">
        <tr>
          <td><strong>Amount:</strong></td>
          <td>{{amount}}</td>
        </tr>
        <tr>
          <td><strong>Date:</strong></td>
          <td>{{date}}</td>
        </tr>
        <tr>
          <td><strong>Invoice:</strong></td>
          <td><a href="{{invoiceUrl}}">Download PDF</a></td>
        </tr>
      </table>
      <p>Your subscription is now active.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 OneTouch BizCard. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

## Best Practices

### Email Deliverability

1. **Authenticate your domain**: Set up SPF, DKIM, and DMARC
2. **Use verified sender**: Always send from verified email address
3. **Avoid spam triggers**: Don't use all caps, excessive punctuation
4. **Include unsubscribe link**: Required by law in many countries
5. **Monitor bounce rates**: Keep bounce rate below 5%
6. **Handle complaints**: Process unsubscribe requests immediately
7. **Warm up IP**: Gradually increase sending volume for new IPs
8. **Segment your list**: Send relevant content to engaged users

### SPF Record

```
Type: TXT
Name: onetouchbizcard.in
Value: v=spf1 include:sendgrid.net ~all
TTL: 300
```

### DMARC Record

```
Type: TXT
Name: _dmarc.onetouchbizcard.in
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@onetouchbizcard.in
TTL: 300
```

### Email Testing

```bash
# Test SMTP connection
npm run test:email

# Send test email
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'

# Check email deliverability
# Use tools like mail-tester.com
```

## Monitoring

### Key Metrics

- **Delivery rate**: Should be > 95%
- **Open rate**: Typical range 15-25%
- **Click rate**: Typical range 2-5%
- **Bounce rate**: Should be < 5%
- **Complaint rate**: Should be < 0.1%
- **Unsubscribe rate**: Should be < 0.5%

### SendGrid Analytics

1. Go to Stats → Overview
2. View delivery metrics
3. Check engagement metrics
4. Monitor bounce and spam reports

### AWS SES Metrics

```bash
# Get sending statistics
aws ses get-send-statistics --region ap-south-1

# Get send quota
aws ses get-send-quota --region ap-south-1
```

## Troubleshooting

### Emails Not Sending

```typescript
// Enable debug logging
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // Enable debug output
  logger: true, // Log to console
});
```

### Emails Going to Spam

1. Check SPF, DKIM, DMARC records
2. Verify sender domain
3. Avoid spam trigger words
4. Include plain text version
5. Add unsubscribe link
6. Maintain good sender reputation

### High Bounce Rate

1. Validate email addresses before sending
2. Remove invalid addresses from list
3. Use double opt-in for subscriptions
4. Monitor bounce notifications
5. Clean your email list regularly

## Security

1. **Protect API keys**: Never expose in client-side code
2. **Use environment variables**: Store credentials securely
3. **Rotate credentials**: Change API keys periodically
4. **Monitor usage**: Watch for unusual activity
5. **Rate limiting**: Prevent abuse of email sending
6. **Validate recipients**: Ensure email addresses are valid
7. **Sanitize content**: Prevent email injection attacks
