-- AlterTable: Add soft delete, last logout, and account lockout to users
ALTER TABLE `users` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `users` ADD COLUMN `lastLogoutAt` DATETIME(3) NULL;
ALTER TABLE `users` ADD COLUMN `failedLoginAttempts` INT NOT NULL DEFAULT 0;
ALTER TABLE `users` ADD COLUMN `lockedUntil` DATETIME(3) NULL;

-- Add indexes for efficient filtering
CREATE INDEX `users_deletedAt_idx` ON `users`(`deletedAt`);
CREATE INDEX `users_isActive_deletedAt_idx` ON `users`(`isActive`, `deletedAt`);
CREATE INDEX `users_role_deletedAt_idx` ON `users`(`role`, `deletedAt`);
CREATE INDEX `users_brandId_idx` ON `users`(`brandId`);
CREATE INDEX `users_email_idx` ON `users`(`email`);

-- Create AuditLog table
CREATE TABLE `audit_logs` (
  `id` VARCHAR(191) NOT NULL,
  `eventType` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `resourceId` VARCHAR(191) NULL,
  `resourceType` VARCHAR(191) NULL,
  `ipAddress` VARCHAR(191) NULL,
  `userAgent` TEXT NULL,
  `metadata` JSON NULL,
  `correlationId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add indexes for audit log queries
CREATE INDEX `audit_logs_eventType_idx` ON `audit_logs`(`eventType`);
CREATE INDEX `audit_logs_userId_idx` ON `audit_logs`(`userId`);
CREATE INDEX `audit_logs_resourceId_idx` ON `audit_logs`(`resourceId`);
CREATE INDEX `audit_logs_createdAt_idx` ON `audit_logs`(`createdAt`);
