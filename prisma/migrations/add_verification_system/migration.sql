-- Add verification fields to branches table
ALTER TABLE `branches`
ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN `verifiedAt` DATETIME(3) NULL,
ADD COLUMN `verifiedBy` VARCHAR(191) NULL,
ADD COLUMN `verificationNotes` TEXT NULL,
ADD COLUMN `completionScore` INT NOT NULL DEFAULT 0;

-- Add verification fields to brands table
ALTER TABLE `brands`
ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN `verifiedAt` DATETIME(3) NULL,
ADD COLUMN `verificationBadge` VARCHAR(50) NULL; -- 'verified', 'premium', 'trusted'

-- Add index for verified branches
CREATE INDEX `branches_isVerified_idx` ON `branches`(`isVerified`);
CREATE INDEX `brands_isVerified_idx` ON `brands`(`isVerified`);
