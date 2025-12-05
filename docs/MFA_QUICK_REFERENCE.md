# MFA Quick Reference

## Quick Start

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

## API Quick Reference

### Setup MFA
```bash
POST /api/auth/mfa/setup
Authorization: Bearer <token>
```

### Enable MFA
```bash
POST /api/auth/mfa/verify
Authorization: Bearer <token>
Content-Type: application/json

{"token": "123456"}
```

### Login with MFA
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "mfaToken": "123456"
}
```

### Check MFA Status
```bash
GET /api/auth/mfa/status
Authorization: Bearer <token>
```

### Disable MFA
```bash
POST /api/auth/mfa/disable
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "current_password",
  "token": "123456"
}
```

### Regenerate Backup Codes
```bash
POST /api/auth/mfa/backup-code
Authorization: Bearer <token>
Content-Type: application/json

{"token": "123456"}
```

## Code Examples

### Using MFA Service
```typescript
import { MFAService } from '@/lib/mfa';

// Generate MFA setup
const setup = await MFAService.generateMFASecret('user@example.com');
// Returns: { secret, qrCodeUrl, backupCodes }

// Verify TOTP token
const isValid = MFAService.verifyTOTP('123456', secret);

// Generate backup codes
const codes = MFAService.generateBackupCodes(10);

// Hash backup codes
const hashed = await MFAService.hashBackupCodes(codes);

// Verify backup code
const result = await MFAService.verifyBackupCode('ABC123', hashedCodes);
```

### Enforcing MFA on Sensitive Operations
```typescript
import { MFAService } from '@/lib/mfa';

// In your API route
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

## Sensitive Operations

Operations that require MFA when enabled:
- `change_password`
- `update_email`
- `delete_account`
- `update_payment_method`
- `disable_mfa`
- `export_data`

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

## Files Modified/Created

### Core Files
- `src/lib/mfa.ts` - MFA service
- `src/lib/mfa-middleware.ts` - MFA enforcement
- `src/app/api/auth/login/route.ts` - Updated for MFA

### API Endpoints
- `src/app/api/auth/mfa/setup/route.ts`
- `src/app/api/auth/mfa/verify/route.ts`
- `src/app/api/auth/mfa/status/route.ts`
- `src/app/api/auth/mfa/disable/route.ts`
- `src/app/api/auth/mfa/backup-code/route.ts`
- `src/app/api/auth/change-password/route.ts`

### Database
- `prisma/schema.prisma` - Added MFA fields
- `prisma/migrations/add_mfa_fields.sql` - Migration

### Documentation
- `docs/MFA_SETUP_GUIDE.md` - Full guide
- `docs/MFA_QUICK_REFERENCE.md` - This file
- `MFA_IMPLEMENTATION.md` - Implementation details

### Testing
- `scripts/test-mfa.js` - Test script

## Support

- Full Documentation: `docs/MFA_SETUP_GUIDE.md`
- Implementation Details: `MFA_IMPLEMENTATION.md`
- Test Script: `npm run test:mfa`
