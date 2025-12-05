# SMS Notifications - Quick Setup Guide

## Prerequisites

- Twilio account (sign up at https://www.twilio.com)
- Node.js and npm installed
- PostgreSQL database running

## Step 1: Install Dependencies

```bash
cd onetouch-bizcard
npm install twilio
```

## Step 2: Configure Twilio

1. **Sign up for Twilio**:
   - Go to https://www.twilio.com/try-twilio
   - Create a free account (includes trial credits)

2. **Get Your Credentials**:
   - Navigate to Twilio Console Dashboard
   - Copy your **Account SID**
   - Copy your **Auth Token**

3. **Get a Phone Number**:
   - Go to Phone Numbers → Manage → Buy a number
   - Or use the trial number provided

4. **Add to Environment Variables**:

Edit your `.env` file and add:

```env
# SMS Service (Twilio)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+1234567890"
```

## Step 3: Update Database Schema

Run the Prisma migration to add SMS fields:

```bash
npx prisma migrate dev --name add_sms_notifications
npx prisma generate
```

This adds:
- `phone` and `smsEnabled` fields to User model
- `notificationPreferences` field to Branch model

## Step 4: Test SMS Service

### Option A: Using the Test API

```bash
# Replace YOUR_TOKEN with your actual JWT token
curl -X POST http://localhost:3000/api/sms/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "phone": "+1234567890",
    "message": "Test SMS from OneTouch BizCard"
  }'
```

### Option B: Using the Admin Dashboard

1. Log in as Super Admin
2. Navigate to Settings → SMS Templates
3. Use the "Test SMS Sender" section
4. Enter your phone number and a test message
5. Click "Send Test SMS"

## Step 5: Enable SMS for Users

### For End Users:

1. Log in to your account
2. Go to Profile → SMS Preferences
3. Enter your phone number (international format: +1234567890)
4. Toggle "Enable SMS Notifications" to ON
5. Click "Save SMS Preferences"

### For Branch Admins:

1. Go to Branch Settings
2. Navigate to Notification Preferences
3. Toggle SMS notifications ON
4. Ensure branch contact phone number is configured

## Step 6: Verify SMS Notifications

Trigger a test notification to verify SMS is working:

1. **Payment Failure**: Attempt a payment with a test card that fails
2. **Subscription Renewal**: Manually trigger a renewal reminder (admin)
3. **System Alert**: Send a critical system alert (admin)

## SMS Notification Types

| Notification Type | When Sent | Critical |
|------------------|-----------|----------|
| Payment Success | Always | No (Email only) |
| Payment Failed | Always | Yes (SMS + Email) |
| Subscription Renewal | ≤7 days before expiry | Yes (SMS + Email) |
| License Expiring | ≤3 days before expiry | Yes (SMS + Email) |
| New Lead | Per branch preferences | No |
| System Alert | When critical flag set | Yes (SMS + Email) |

## Cost Estimates

### Twilio Trial Account
- **Free Credits**: $15.50 (US accounts)
- **Trial Limitations**:
  - Can only send to verified phone numbers
  - Messages include "Sent from a Twilio trial account"

### Paid Account Pricing
- **US SMS**: ~$0.0075 per message
- **India SMS**: ~$0.0065 per message
- **International**: Varies by country

### Monthly Cost Example (1000 users)
- Payment failures: ~10 SMS = $0.08
- Renewals: ~50 SMS = $0.38
- License expiry: ~30 SMS = $0.23
- System alerts: ~5 SMS = $0.04
- **Total**: ~$0.73/month

## Troubleshooting

### "SMS client not initialized"

**Cause**: Twilio credentials not configured

**Solution**:
1. Check `.env` file has all three Twilio variables
2. Restart the application after adding credentials
3. Verify credentials are correct in Twilio Console

### "Invalid phone number format"

**Cause**: Phone number not in international format

**Solution**:
- Use format: `+[country_code][number]`
- Examples:
  - US: `+12025551234`
  - India: `+919876543210`
  - UK: `+447911123456`

### "Failed to send SMS"

**Possible Causes**:
1. Insufficient Twilio credits
2. Phone number not verified (trial account)
3. Invalid phone number
4. Twilio service outage

**Solution**:
1. Check Twilio account balance
2. Verify phone number in Twilio Console (trial accounts)
3. Check Twilio status page: https://status.twilio.com
4. Review Twilio error logs in Console

### SMS Not Received

**Checklist**:
- [ ] User has SMS enabled in preferences
- [ ] Phone number is correct and verified
- [ ] Twilio account has credits
- [ ] Check Twilio logs for delivery status
- [ ] Check phone carrier spam filters
- [ ] Verify phone number can receive SMS

## Best Practices

1. **Keep Messages Short**: Under 160 characters to avoid multi-part SMS
2. **Use Templates**: Consistent messaging across notifications
3. **Test Thoroughly**: Test with different phone numbers and carriers
4. **Monitor Costs**: Track SMS usage in Twilio Console
5. **Respect Opt-Outs**: Honor user preferences immediately
6. **Secure Credentials**: Never commit Twilio credentials to version control

## Production Checklist

Before going live:

- [ ] Upgrade to paid Twilio account
- [ ] Remove trial account limitations
- [ ] Set up billing alerts in Twilio
- [ ] Configure webhook for delivery status
- [ ] Implement rate limiting on SMS endpoints
- [ ] Set up monitoring for SMS failures
- [ ] Document SMS opt-out process
- [ ] Ensure TCPA/GDPR compliance
- [ ] Test with multiple carriers
- [ ] Set up backup SMS provider (optional)

## Support Resources

- **Twilio Documentation**: https://www.twilio.com/docs/sms
- **Twilio Console**: https://console.twilio.com
- **Twilio Support**: https://support.twilio.com
- **Status Page**: https://status.twilio.com

## Next Steps

1. Review full documentation: `docs/SMS_NOTIFICATIONS.md`
2. Configure SMS templates for your brand
3. Set up monitoring and alerts
4. Train support team on SMS features
5. Communicate SMS feature to users

---

**Need Help?** Check the full documentation in `docs/SMS_NOTIFICATIONS.md` or contact your system administrator.
