# Multi-Factor Authentication (MFA) Setup Guide

## Overview

The OneTouch BizCard platform now supports Time-based One-Time Password (TOTP) Multi-Factor Authentication for enhanced security. This guide covers setup, usage, and integration.

## Features

- **TOTP-based MFA**: Compatible with Google Authenticator, Authy, Microsoft Authenticator, and other TOTP apps
- **Backup Codes**: 10 single-use backup codes for account recovery
- **Sensitive Operation Protection**: Automatic MFA enforcement for critical actions
- **QR Code Setup**: Easy enrollment via QR code scanning

## Database Migration

After updating the schema, run the following commands:

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migration
npx prisma migrate dev --name add_mfa_fields

# Or for production
npx prisma migrate deploy
```

### Manual Migration (if needed)

If automatic migration fails, run this SQL:

```sql
ALTER TABLE users ADD COLUMN mfaEnabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN mfaSecret VARCHAR(255);
ALTER TABLE users ADD COLUMN backupCodes JSON;
```

## API Endpoints

### 1. Setup MFA

**POST** `/api/auth/mfa/setup`

Initiates MFA setup for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "qrCodeUrl": "data:image/png;base64,...",
  "backupCodes": [
    "A1B2C3D4",
    "E5F6G7H8",
    ...
  ],
  "message": "Scan the QR code with your authenticator app and verify to enable MFA"
}
```

### 2. Verify and Enable MFA

**POST** `/api/auth/mfa/verify`

Verifies the TOTP token and enables MFA.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "message": "MFA enabled successfully",
  "mfaEnabled": true
}
```

### 3. Login with MFA

**POST** `/api/auth/login`

Login flow with MFA support.

**First Request (credentials only):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (if MFA enabled):**
```json
{
  "requiresMFA": true,
  "message": "MFA verification required",
  "userId": "user_id"
}
```

**Second Request (with MFA token):**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "mfaToken": "123456"
}
```

**Or with backup code:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "backupCode": "A1B2C3D4"
}
```

**Success Response:**
```json
{
  "user": { ... },
  "accessToken": "jwt_token"
}
```

### 4. Check MFA Status

**GET** `/api/auth/mfa/status`

Get current MFA status.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "mfaEnabled": true,
  "remainingBackupCodes": 8
}
```

### 5. Regenerate Backup Codes

**POST** `/api/auth/mfa/backup-code`

Generate new backup codes (requires MFA token).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "backupCodes": [
    "NEW1CODE",
    "NEW2CODE",
    ...
  ],
  "message": "New backup codes generated. Save them securely."
}
```

### 6. Disable MFA

**POST** `/api/auth/mfa/disable`

Disable MFA (requires password and MFA token).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "password": "current_password",
  "token": "123456"
}
```

**Response:**
```json
{
  "message": "MFA disabled successfully",
  "mfaEnabled": false
}
```

## Sensitive Operations

The following operations automatically require MFA verification when enabled:

- `change_password` - Changing account password
- `update_email` - Updating email address
- `delete_account` - Account deletion
- `update_payment_method` - Changing payment information
- `disable_mfa` - Disabling MFA
- `export_data` - Exporting user data

### Example: Change Password with MFA

**POST** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "mfaToken": "123456"
}
```

**Response (if MFA required but not provided):**
```json
{
  "requiresMFA": true,
  "operation": "change_password",
  "message": "MFA verification required to change password"
}
```

## Frontend Integration

### Setup Flow

```typescript
// 1. Initiate MFA setup
const setupResponse = await fetch('/api/auth/mfa/setup', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const { qrCodeUrl, backupCodes } = await setupResponse.json();

// 2. Display QR code to user
// Show qrCodeUrl in an <img> tag
// Display backupCodes for user to save

// 3. User scans QR code and enters token from authenticator app
const verifyResponse = await fetch('/api/auth/mfa/verify', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ token: userEnteredToken }),
});

// MFA is now enabled
```

### Login Flow with MFA

```typescript
// 1. Initial login attempt
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const loginData = await loginResponse.json();

// 2. Check if MFA is required
if (loginData.requiresMFA) {
  // Show MFA input form
  const mfaToken = await promptUserForMFAToken();

  // 3. Retry login with MFA token
  const mfaLoginResponse = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, mfaToken }),
  });

  const finalData = await mfaLoginResponse.json();
  // Handle successful login
}
```

## Security Best Practices

1. **Backup Codes**: Always save backup codes in a secure location
2. **Secret Storage**: MFA secrets are stored encrypted in the database
3. **Time Window**: TOTP verification allows a 2-step time window for clock drift
4. **One-Time Use**: Backup codes are single-use and removed after verification
5. **Rate Limiting**: Implement rate limiting on MFA verification endpoints
6. **Audit Logging**: Log all MFA-related events for security monitoring

## Testing

### Manual Testing

1. **Setup MFA**:
   - Login to the platform
   - Navigate to security settings
   - Click "Enable MFA"
   - Scan QR code with authenticator app
   - Enter 6-digit code to verify
   - Save backup codes

2. **Login with MFA**:
   - Logout
   - Login with email/password
   - Enter 6-digit code from authenticator app
   - Verify successful login

3. **Use Backup Code**:
   - Logout
   - Login with email/password
   - Use a backup code instead of TOTP token
   - Verify the backup code is consumed

4. **Sensitive Operation**:
   - Try to change password
   - Verify MFA token is required
   - Complete operation with valid token

### Automated Testing

Run the MFA test suite:

```bash
npm test -- mfa
```

## Troubleshooting

### "Invalid MFA token" Error

- Ensure device time is synchronized (TOTP is time-based)
- Check if token has expired (30-second validity)
- Verify correct secret is being used

### Lost Access to Authenticator

- Use backup codes to login
- Contact support if all backup codes are used

### QR Code Not Scanning

- Ensure QR code is displayed clearly
- Try manual entry of the secret key
- Check authenticator app compatibility

## Support

For issues or questions:
- Email: support@onetouchbizcard.in
- Documentation: https://docs.onetouchbizcard.in/mfa
