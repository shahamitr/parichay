-- Add MFA fields to users table
-- This migration adds Multi-Factor Authentication support

-- Add MFA enabled flag
ALTER TABLE users ADD COLUMN mfaEnabled BOOLEAN NOT NULL DEFAULT FALSE;

-- Add MFA secret for TOTP
ALTER TABLE users ADD COLUMN mfaSecret VARCHAR(255) NULL;

-- Add backup codes (stored as JSON array)
ALTER TABLE users ADD COLUMN backupCodes JSON NULL;

-- Add index for faster MFA lookups
CREATE INDEX idx_users_mfa_enabled ON users(mfaEnabled);
