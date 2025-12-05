-- Add EXECUTIVE role to UserRole enum
ALTER TABLE `users` MODIFY COLUMN `role` ENUM('SUPER_ADMIN', 'BRAND_MANAGER', 'BRANCH_ADMIN', 'EXECUTIVE') NOT NULL DEFAULT 'BRANCH_ADMIN';

-- Add onboarding tracking fields to branches table
ALTER TABLE `branches` ADD COLUMN `onboardedBy` VARCHAR(191) NULL;
ALTER TABLE `branches` ADD COLUMN `onboardedAt` DATETIME(3) NULL;

-- Add foreign key constraint for onboardedBy
ALTER TABLE `branches` ADD CONSTRAINT `branches_onboardedBy_fkey` FOREIGN KEY (`onboardedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Create index for better query performance
CREATE INDEX `branches_onboardedBy_idx` ON `branches`(`onboardedBy`);
