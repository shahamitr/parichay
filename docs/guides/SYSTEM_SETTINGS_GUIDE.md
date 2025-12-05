# System Settings - Complete Guide

## Overview

A comprehensive System Settings page has been implemented for Super Admins to configure all system-wide settings from a single interface.

## Features

### 1. General Settings ⚙️
Configure basic system information:
- **Site Name**: The name of your application
- **Site URL**: The primary URL of your application
- **Support Email**: Email address for support inquiries

### 2. Email Configuration 📧
Configure SMTP settings for sending emails:
- **SMTP Host**: Mail server hostname (e.g., smtp.gmail.com)
- **SMTP Port**: Mail server port (default: 587)
- **SMTP Username**: Authentication username
- **SMTP Password**: Authentication password (hidden)
- **From Email**: Default sender email address

### 3. Storage Configuration 💾
Configure file storage provider:
- **Storage Provider**: Choose between:
  - Local Storage (default)
  - Amazon S3
  - Cloudinary

**Amazon S3 Settings** (when selected):
- S3 Bucket Name
- S3 Region
- S3 Access Key
- S3 Secret Key

**Cloudinary Settings** (when selected):
- Cloud Name
- API Key
- API Secret

### 4. Feature Flags 🎯
Enable/disable system features:
- **User Registration**: Allow new users to register
- **Custom Domains**: Allow brands to use custom domains
- **Analytics**: Enable analytics tracking
- **Notifications**: Enable system notifications

### 5. System Limits 📊
Configure system-wide limits:
- **Max Brands Per User**: Maximum brands a user can create (default: 10)
- **Max Branches Per Brand**: Maximum branches per brand (default: 50)
- **Max File Size**: Maximum upload size in MB (default: 5)

### 6. Payment Configuration 💳
Configure payment processing:
- **Enable Payments**: Toggle payment functionality
- **Stripe Public Key**: Stripe publishable key
- **Stripe Secret Key**: Stripe secret key (hidden)

## Access Control

- **Super Admin Only**: Only users with SUPER_ADMIN role can access
- **Unauthorized Access**: Shows error message for non-admin users

## User Interface

### Tab Navigation
Settings are organized into 6 tabs for easy navigation:
1. General
2. Email
3. Storage
4. Features
5. Limits
6. Payment

### Features
- ✅ Tabbed interface for organization
- ✅ Real-time form updates
- ✅ Toggle switches for boolean settings
- ✅ Conditional fields (show/hide based on selection)
- ✅ Toast notifications for save operations
- ✅ Loading states
- ✅ Validation
- ✅ Security warnings for sensitive data

## API Endpoints

### GET /api/system/settings
**Description**: Retrieve current system settings

**Auth**: Super Admin only

**Response**:
```json
{
  "settings": {
    "siteName": "OneTouch BizCard",
    "siteUrl": "http://localhost:3000",
    "supportEmail": "support@onetouchbizcard.in",
    ...
  }
}
```

### PUT /api/system/settings
**Description**: Update system settings

**Auth**: Super Admin only

**Body**: Complete settings object

**Response**:
```json
{
  "success": true,
  "message": "Settings saved successfully",
  "settings": { ... }
}
```

## Data Storage

Settings are stored in a JSON file: `system-settings.json` in the project root.

**Benefits**:
- No database schema changes needed
- Easy to backup
- Version control friendly
- Fast read/write operations

**Default Settings**:
```json
{
  "siteName": "OneTouch BizCard",
  "siteUrl": "http://localhost:3000",
  "supportEmail": "support@onetouchbizcard.in",
  "smtpHost": "",
  "smtpPort": 587,
  "smtpUser": "",
  "smtpPassword": "",
  "smtpFrom": "noreply@onetouchbizcard.in",
  "storageProvider": "local",
  "enableRegistration": true,
  "enableCustomDomains": true,
  "enableAnalytics": true,
  "enableNotifications": true,
  "maxBrandsPerUser": 10,
  "maxBranchesPerBrand": 50,
  "maxFileSize": 5,
  "stripePublicKey": "",
  "stripeSecretKey": "",
  "enablePayments": false
}
```

## Usage

### Accessing System Settings

1. Login as Super Admin
2. Navigate to Dashboard → System
3. Select a tab to configure specific settings
4. Make changes
5. Click "Save Changes" button
6. Toast notification confirms save

### Configuring Email

1. Go to Email tab
2. Enter SMTP server details
3. Configure authentication
4. Set from email address
5. Save changes

### Configuring Storage

1. Go to Storage tab
2. Select storage provider
3. If S3 or Cloudinary:
   - Enter provider-specific credentials
   - Configure bucket/cloud settings
4. Save changes

### Managing Feature Flags

1. Go to Features tab
2. Toggle switches to enable/disable features
3. Changes take effect immediately after save

### Setting Limits

1. Go to Limits tab
2. Adjust numeric limits
3. Consider system capacity
4. Save changes

### Configuring Payments

1. Go to Payment tab
2. Toggle "Enable Payments"
3. Enter Stripe keys
4. Save changes
5. Note security warning

## Security Considerations

### Sensitive Data
- SMTP passwords are hidden (type="password")
- Stripe secret keys are hidden
- S3/Cloudinary secrets are hidden
- Warning displayed for payment settings

### Access Control
- Only Super Admins can access
- API endpoints verify role
- Unauthorized attempts are logged

### Best Practices
1. Never commit `system-settings.json` to version control
2. Add to `.gitignore`
3. Use environment variables for production
4. Rotate keys regularly
5. Use test keys in development

## Integration

### Using Settings in Code

```typescript
// Read settings
const response = await fetch('/api/system/settings');
const { settings } = await response.json();

// Check feature flag
if (settings.enableRegistration) {
  // Allow registration
}

// Use limits
if (userBrands.length >= settings.maxBrandsPerUser) {
  // Show limit reached message
}

// Use email settings
const emailConfig = {
  host: settings.smtpHost,
  port: settings.smtpPort,
  auth: {
    user: settings.smtpUser,
    pass: settings.smtpPassword,
  },
};
```

## Files Created

1. `src/app/dashboard/system/page.tsx` - System settings UI
2. `src/app/api/system/settings/route.ts` - API endpoints
3. `system-settings.json` - Settings storage (created on first save)

## Testing

### Test System Settings:

1. Login as Super Admin (`admin@onetouch.local`)
2. Navigate to Dashboard → System
3. Test each tab:
   - General: Update site name
   - Email: Configure SMTP
   - Storage: Switch providers
   - Features: Toggle flags
   - Limits: Adjust numbers
   - Payment: Configure Stripe
4. Click "Save Changes"
5. Verify toast notification
6. Refresh page
7. Verify settings persisted

## Future Enhancements

1. **Database Storage**: Move to database for multi-instance support
2. **Audit Log**: Track who changed what and when
3. **Validation**: Add more robust validation
4. **Test Buttons**: Add "Test Email" and "Test Storage" buttons
5. **Import/Export**: Allow settings backup/restore
6. **Environment Sync**: Sync with environment variables
7. **Webhooks**: Configure webhook URLs
8. **API Keys**: Manage API keys for integrations
9. **Backup Settings**: Automatic backup before changes
10. **Change History**: View previous settings versions

## Troubleshooting

### Settings Not Saving
- Check Super Admin permissions
- Verify file write permissions
- Check browser console for errors
- Verify API endpoint is accessible

### Settings Not Loading
- Check if `system-settings.json` exists
- Verify file read permissions
- Check API response in Network tab
- Verify default settings are returned

### Feature Flags Not Working
- Ensure settings are saved
- Check if feature implementation reads from settings
- Verify API integration
- Clear cache and reload

---

**Status: System Settings Fully Implemented** ✅

All configurable system settings are now manageable from a single, organized interface!
