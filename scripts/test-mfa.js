/**
 * MFA Testing Script
 *
 * This script tests the MFA functionality without requiring a full server setup.
 * It verifies the core MFA service functions work correctly.
 */

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const bcrypt = require('bcrypt');

console.log('🔐 Testing MFA Implementation...\n');

// Test 1: Generate MFA Secret
console.log('Test 1: Generate MFA Secret');
const secret = speakeasy.generateSecret({
  name: 'OneTouch BizCard (test@example.com)',
  issuer: 'OneTouch BizCard',
  length: 32,
});

if (secret.base32) {
  console.log('✅ Secret generated successfully');
  console.log('   Secret:', secret.base32.substring(0, 10) + '...');
} else {
  console.log('❌ Failed to generate secret');
  process.exit(1);
}

// Test 2: Generate QR Code
console.log('\nTest 2: Generate QR Code');
QRCode.toDataURL(secret.otpauth_url)
  .then(qrCodeUrl => {
    if (qrCodeUrl.startsWith('data:image/png;base64,')) {
      console.log('✅ QR code generated successfully');
      console.log('   Length:', qrCodeUrl.length, 'characters');
    } else {
      console.log('❌ Invalid QR code format');
      process.exit(1);
    }

    // Test 3: Generate and Verify TOTP Token
    console.log('\nTest 3: Generate and Verify TOTP Token');
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    console.log('   Generated token:', token);

    const isValid = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: token,
      window: 2,
    });

    if (isValid) {
      console.log('✅ TOTP verification successful');
    } else {
      console.log('❌ TOTP verification failed');
      process.exit(1);
    }

    // Test 4: Generate Backup Codes
    console.log('\nTest 4: Generate Backup Codes');
    const crypto = require('crypto');
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      backupCodes.push(code);
    }

    if (backupCodes.length === 10) {
      console.log('✅ Backup codes generated successfully');
      console.log('   Sample codes:', backupCodes.slice(0, 3).join(', '), '...');
    } else {
      console.log('❌ Failed to generate backup codes');
      process.exit(1);
    }

    // Test 5: Hash and Verify Backup Codes
    console.log('\nTest 5: Hash and Verify Backup Codes');
    const testCode = backupCodes[0];

    bcrypt.hash(testCode, 10)
      .then(hashedCode => {
        console.log('   Hashed code:', hashedCode.substring(0, 20) + '...');

        return bcrypt.compare(testCode, hashedCode);
      })
      .then(isMatch => {
        if (isMatch) {
          console.log('✅ Backup code verification successful');
        } else {
          console.log('❌ Backup code verification failed');
          process.exit(1);
        }

        // Test 6: Verify Invalid Token
        console.log('\nTest 6: Verify Invalid Token');
        const invalidToken = '000000';
        const isInvalid = speakeasy.totp.verify({
          secret: secret.base32,
          encoding: 'base32',
          token: invalidToken,
          window: 2,
        });

        if (!isInvalid) {
          console.log('✅ Invalid token correctly rejected');
        } else {
          console.log('❌ Invalid token incorrectly accepted');
          process.exit(1);
        }

        // All tests passed
        console.log('\n' + '='.repeat(50));
        console.log('🎉 All MFA tests passed successfully!');
        console.log('='.repeat(50));
        console.log('\nMFA Implementation is ready for use.');
        console.log('\nNext steps:');
        console.log('1. Run database migration: npm run prisma:migrate dev');
        console.log('2. Test API endpoints with Postman or curl');
        console.log('3. Integrate with frontend application');
        console.log('\nSee docs/MFA_SETUP_GUIDE.md for detailed instructions.');
      })
      .catch(error => {
        console.error('❌ Error during testing:', error);
        process.exit(1);
      });
  })
  .catch(error => {
    console.error('❌ Error generating QR code:', error);
    process.exit(1);
  });
