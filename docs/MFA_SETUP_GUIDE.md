# Multi-Factor Authentication (MFA) Guide

## Overview

The OneTouch BizCard platform supports Time-based One-Time Password (TOTP) Multi-Factor Authentication for enhanced security.

## Features

- **TOTP-based MFA**: Compatible with Google Authenticator, Authy, Microsoft Authenticator
- **Backup Codes**: 10 single-use backup codes for account recovery
- **Sensitive Operation Protection**: Automatic MFA enforcement for critical actions
- **QR Code Setup**: Easy enrollment via QR code scanning

## Quick Setup

### 1. Install Dependencies
```bash
npm install speakeasy qrcode
npm install --save-dev @types/speakeasy
```

### 2. Run Database Migration
```bash
# Development
npm run prisma:migrate dev --name add_mfa_fields

# Or apply manually
mysql -u root -p onetouch_bizcard < prisma/migrations/add_mfa_fields.sql
```

### 3. Test MFA Implementation
```bash
npm run test:mfa
```

## API Reference

### Setup MFA
**POST** `/api/auth/mfa/setup`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "qrCodeUrl": "data:image/png;base64,...",
  "backupCodes": ["A1B2C3D4", "E5F6G7H8", ...],
  "message": "Scan the QR code with your authenticator app"
}
```

### Enable MFA
**POST** `/api/auth/mfa/verify`

**Body:**
```json
{
  "token": "123456"
}
```

### Login with MFA
**POST** `/api/auth/login`

**First Request:**
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
  "message": "MFA verification required"
}
```

**Second Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "mfaToken": "123456"
}
```

### Other Endpoints
- `GET /api/auth/mfa/status` - Check MFA status
- `POST /api/auth/mfa/disable` - Disable MFA
- `POST /api/auth/mfa/backup-code` - Regenerate backup codes

## Frontend Integration

### Setup Flow
```typescript
// 1. Initiate MFA setup
const setupResponse = await fetch('/api/auth/mfa/setup', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${accessToken}` },
});

const { qrCodeUrl, backupCodes } = await setupResponse.json();

// 2. Display QR code and backup codes to user

// 3. Verify token from authenticator app
const verifyResponse = await fetch('/api/auth/mfa/verify', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ token: userEnteredToken }),
});
```

### Login Flow
```typescript
// 1. Initial login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const loginData = await loginResponse.json();

// 2. Handle MFA requirement
if (loginData.requiresMFA) {
  const mfaToken = await promptUserForMFAToken();

  // 3. Complete login with MFA
  const mfaLoginResponse = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, mfaToken }),
  });
}
```

## Sensitive Operations

These operations require MFA when enabled:
- `change_password` - Changing account password
- `update_email` - Updating email address
- `delete_account` - Account deletion
- `update_payment_method` - Changing payment information
- `disable_mfa` - Disabling MFA
- `export_data` - Exporting user data

## Code Examples

### Using MFA Service
```typescript
import { MFAService } from '@/lib/mfa';

// Generate MFA setup
const setup = await MFAService.generateMFASecret('user@example.com');

// Verify TOTP token
const isValid = MFAService.verifyTOTP('123456', secret);

// Generate backup codes
const codes = MFAService.generateBackupCodes(10);
```

### Enforcing MFA
```typescript
if (user.mfaEnabled && user.mfaSecret) {
  if (!body.mfaToken) {
    return NextResponse.json(
      { requiresMFA: true, operation: 'change_password' },
      { status: 403 }
    );
  }

  const isValid = MFAService.verifyTOTP(body.mfaToken, user.mfaSecret);
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid MFA token' },
      { status: 401 }
    );
  }
}
```

## Testing

### Manual Test Flow
1. Setup MFA → Get QR code
2. Scan with Google Authenticator
3. Verify token → Enable MFA
4. Logout and login with MFA
5. Test backup code
6. Test sensitive operation

### Automated Tests
```bash
npm run test:mfa
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Invalid token | Check device time sync |
| QR code not scanning | Use manual entry |
| Lost authenticator | Use backup codes |
| All backup codes used | Contact support |

## Database Migration

```sql
ALTER TABLE users ADD COLUMN mfaEnabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN mfaSecret VARCHAR(255);
ALTER TABLE users ADD COLUMN backupCodes JSON;
```

## Security Best Practices

1. **Backup Codes**: Always save backup codes securely
2. **Secret Storage**: MFA secrets are encrypted in database
3. **Time Window**: TOTP allows 2-step time window for clock drift
4. **One-Time Use**: Backup codes are consumed after use
5. **Rate Limiting**: Implement on MFA verification endpoints
6. **Audit Logging**: Log all MFA-related events

## Support

For issues or questions:
- Email: support@onetouchbizcard.in
- Documentation: https://docs.onetouchbizcard.in/mfa
