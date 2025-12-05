# SMS Notifications Implementation

## Overview

The SMS notification feature enables the OneTouch BizCard platform to send critical alerts to users via SMS using Twilio as the service provider. This feature is designed to complement email and in-app notifications for time-sensitive alerts.

## Features Implemented

### 1. SMS Service Integration (Twilio)

- **Service Provider**: Twilio
- **Library**: `twilio` npm package
- **Configuration**: Environment variables for account credentials
- **Phone Number Formatting**: Automatic international format handling

### 2. SMS Templates

Pre-configured templates for various notification types:

- **Payment Success**: Confirmation of successful payment
- **Payment Failed**: Alert for failed payment (critical)
- **Subscription Renewal**: Reminder for upcoming subscription expiry
- **License Expiring**: Warning for license expiration
- **New Lead**: Notification for new lead capture
- **System Alert**: Critical system notifications
- **Subscription Suspended**: Alert for suspended subscription
- **Subscription Activated**: Confirmation of subscription activation

### 3. User SMS Preferences

- **Phone Number Management**: Users can add/update their phone number
- **SMS Toggle**: Enable/disable SMS notifications
- **Preference Storage**: Stored in User model (phone, smsEnabled fields)
- **Validation**: Phone number format validation (international format)

### 4. Branch Notification Preferences

- **Multi-Channel Support**: Email, WhatsApp, SMS, and In-App notifications
- **Per-Branch Configuration**: Each branch can configure notification preferences
- **Preference Storage**: Stored in Branch model (notificationPreferences JSON field)

### 5. Template Management

- **Dynamic Templates**: Template system with parameter substitution
- **Admin Management**: Super admins can view, add, and remove templates
- **Template Preview**: Preview templates with sample data
- **Custom Templates**: Support for adding custom SMS templates

### 6. Smart Notification Logic

SMS notifications are sent strategically to minimize costs:

- **Payment Failures**: Always sent (critical)
- **Subscription Renewal**: Sent only when ≤7 days remaining
- **License Expiry**: Sent only when ≤3 days remaining
- **System Alerts**: Sent only for critical alerts (metadata.critical = true)
- **New Leads**: Configurable per branch preferences

## Database Schema Changes

### User Model Updates

```prisma
model User {
  // ... existing fields

  // SMS notifications
  phone            String?
  smsEnabled       Boolean   @default(false)

  // ... relationships
}
```

### Branch Model Updates

```prisma
model Branch {
  // ... existing fields

  // Notification preferences
  notificationPreferences Json? // {email: boolean, whatsapp: boolean, sms: boolean, inApp: boolean}

  // ... relationships
}
```

## Environment Variables

Add the following to your `.env` file:

```env
# SMS Service (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

## API Endpoints

### 1. User SMS Preferences

**GET** `/api/users/sms-preferences`
- Get current user's SMS preferences
- Returns: `{ phone, smsEnabled }`

**PUT** `/api/users/sms-preferences`
- Update user's SMS preferences
- Body: `{ phone, smsEnabled }`
- Validates phone number format

### 2. SMS Templates (Admin Only)

**GET** `/api/sms/templates`
- List all SMS templates with previews
- Requires: Super Admin role

**POST** `/api/sms/templates`
- Add a new SMS template
- Body: `{ type, template }`
- Requires: Super Admin role

**DELETE** `/api/sms/templates?type={type}`
- Remove an SMS template
- Requires: Super Admin role

### 3. Test SMS

**POST** `/api/sms/test`
- Send a test SMS
- Body: `{ phone, message }`
- Requires: Authentication

## Components

### 1. SMSPreferences Component

**Location**: `src/components/SMSPreferences.tsx`

**Purpose**: User-facing component for managing SMS notification settings

**Features**:
- Phone number input with validation
- SMS enable/disable toggle
- List of SMS alert types
- Save preferences functionality

**Usage**:
```tsx
import SMSPreferences from '@/components/SMSPreferences';

<SMSPreferences />
```

### 2. NotificationPreferences Component (Updated)

**Location**: `src/components/NotificationPreferences.tsx`

**Updates**:
- Added SMS notification toggle
- Updated to support 4 notification channels (Email, WhatsApp, SMS, In-App)

**Usage**:
```tsx
import NotificationPreferences from '@/components/NotificationPreferences';

<NotificationPreferences branchId={branchId} />
```

### 3. SMSTemplateManager Component

**Location**: `src/components/SMSTemplateManager.tsx`

**Purpose**: Admin component for managing SMS templates and testing

**Features**:
- View all SMS templates with previews
- Send test SMS messages
- Character count for SMS messages
- Template status indicators

**Usage** (Admin Dashboard):
```tsx
import SMSTemplateManager from '@/components/SMSTemplateManager';

<SMSTemplateManager />
```

## Service Layer

### SMS Service

**Location**: `src/lib/sms-service.ts`

**Key Methods**:

```typescript
// Send basic SMS
smsService.sendSMS({ to: '+1234567890', message: 'Hello' })

// Send templated SMS
smsService.sendTemplatedSMS('+1234567890', 'payment_success', { amount: 100, invoiceNumber: 'INV-001' })

// Specific notification methods
smsService.sendPaymentSuccessSMS(phone, amount, invoiceNumber)
smsService.sendPaymentFailedSMS(phone, amount, reason)
smsService.sendSubscriptionRenewalSMS(phone, planName, daysUntilExpiry)
smsService.sendLicenseExpiringSMS(phone, daysUntilExpiry)
smsService.sendNewLeadSMS(phone, leadName, branchName, leadContact)
smsService.sendSystemAlertSMS(phone, message)

// Template management
smsService.addTemplate(type, templateFunction)
smsService.getTemplate(type)
smsService.getAllTemplates()
smsService.removeTemplate(type)
```

### Notification Service (Updated)

**Location**: `src/lib/notification-service.ts`

**Updates**:
- Integrated SMS service for critical notifications
- Smart notification logic based on urgency
- Multi-channel notification support (In-App + Email + SMS)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install twilio
```

### 2. Configure Twilio

1. Sign up for a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number or use a trial number
4. Add credentials to `.env` file

### 3. Run Database Migration

```bash
npx prisma migrate dev --name add_sms_notifications
npx prisma generate
```

### 4. Test SMS Service

Use the test endpoint or admin component to verify SMS functionality:

```bash
curl -X POST http://localhost:3000/api/sms/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"phone": "+1234567890", "message": "Test SMS from OneTouch BizCard"}'
```

## Cost Considerations

### Twilio Pricing (Approximate)

- **SMS (US)**: ~$0.0075 per message
- **SMS (India)**: ~$0.0065 per message
- **SMS (International)**: Varies by country

### Cost Optimization Strategies

1. **Selective Sending**: SMS only sent for critical alerts
2. **Threshold-Based**: Renewal/expiry alerts only when urgent
3. **User Control**: Users can disable SMS notifications
4. **Template Optimization**: Keep messages under 160 characters to avoid multi-part SMS

### Estimated Monthly Costs

For a platform with 1000 active users:

- **Payment Failures**: ~10 SMS/month = $0.075
- **Critical Renewals**: ~50 SMS/month = $0.375
- **License Expiry**: ~30 SMS/month = $0.225
- **System Alerts**: ~5 SMS/month = $0.0375

**Total**: ~$0.71/month (very low cost for critical notifications)

## Security Considerations

1. **Phone Number Validation**: All phone numbers validated before sending
2. **Rate Limiting**: Consider implementing rate limits on SMS endpoints
3. **Credential Security**: Twilio credentials stored in environment variables
4. **User Consent**: Users must explicitly enable SMS notifications
5. **Audit Trail**: All SMS sends logged for tracking

## Testing

### Manual Testing

1. Configure Twilio credentials in `.env`
2. Add your phone number in user SMS preferences
3. Enable SMS notifications
4. Trigger a test notification (payment failure, etc.)
5. Verify SMS received

### Test Checklist

- [ ] Phone number validation works correctly
- [ ] SMS preferences save successfully
- [ ] Test SMS sends successfully
- [ ] Payment failure SMS received
- [ ] Subscription renewal SMS received (≤7 days)
- [ ] License expiry SMS received (≤3 days)
- [ ] System alert SMS received (critical only)
- [ ] SMS disabled when user toggles off
- [ ] Templates display correctly in admin panel
- [ ] Character count accurate

## Troubleshooting

### SMS Not Sending

1. **Check Twilio Credentials**: Verify Account SID, Auth Token, and Phone Number
2. **Check Phone Number Format**: Must be in international format (+1234567890)
3. **Check Twilio Balance**: Ensure account has sufficient credits
4. **Check Twilio Logs**: Review Twilio console for error messages
5. **Check User Preferences**: Verify SMS is enabled for the user

### Invalid Phone Number

- Ensure phone number includes country code
- Use international format without spaces or special characters
- Example: +919876543210 (India), +12025551234 (US)

### Template Not Found

- Verify template type exists in SMS service
- Check template name matches exactly (case-sensitive)
- Use `getAllTemplates()` to list available templates

## Future Enhancements

1. **SMS Analytics**: Track delivery rates, open rates, and costs
2. **Bulk SMS**: Support for sending SMS to multiple users
3. **SMS Scheduling**: Schedule SMS for specific times
4. **Two-Way SMS**: Support for receiving SMS responses
5. **SMS Campaigns**: Marketing SMS campaigns for promotions
6. **Multi-Provider Support**: Add support for other SMS providers (AWS SNS, MessageBird)
7. **SMS Verification**: Phone number verification via OTP
8. **Rich SMS**: Support for MMS (images, videos)

## Compliance

### TCPA Compliance (US)

- Users must explicitly opt-in to SMS notifications
- Provide clear opt-out instructions in every SMS
- Maintain records of user consent
- Honor opt-out requests immediately

### GDPR Compliance (EU)

- Phone numbers are personal data - handle securely
- Users can request data deletion
- Provide transparency about SMS usage
- Obtain explicit consent before sending SMS

## Support

For issues or questions:

1. Check Twilio documentation: https://www.twilio.com/docs
2. Review error logs in application
3. Check Twilio console for delivery status
4. Contact Twilio support for provider-specific issues

## Conclusion

The SMS notification feature provides a reliable way to send critical alerts to users, complementing the existing email and in-app notification systems. The implementation is cost-effective, secure, and user-friendly, with comprehensive admin controls for template management and testing.
