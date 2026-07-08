-- Voucher/Coupon system
CREATE TABLE `vouchers` (
  `id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `description` VARCHAR(191) NULL,
  `discountType` ENUM('PERCENTAGE', 'FLAT') NOT NULL DEFAULT 'PERCENTAGE',
  `discountValue` DOUBLE NOT NULL,
  `maxUses` INT NULL,
  `usedCount` INT NOT NULL DEFAULT 0,
  `minOrderAmount` DOUBLE NULL,
  `maxDiscount` DOUBLE NULL,
  `validFrom` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `validUntil` DATETIME(3) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `applicablePlans` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `vouchers_code_key`(`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `vouchers_code_idx` ON `vouchers`(`code`);
CREATE INDEX `vouchers_isActive_validUntil_idx` ON `vouchers`(`isActive`, `validUntil`);

-- Voucher redemption tracking
CREATE TABLE `voucher_redemptions` (
  `id` VARCHAR(191) NOT NULL,
  `voucherId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `brandId` VARCHAR(191) NULL,
  `paymentId` VARCHAR(191) NULL,
  `discount` DOUBLE NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `voucher_redemptions_voucherId_idx` ON `voucher_redemptions`(`voucherId`);
CREATE INDEX `voucher_redemptions_userId_idx` ON `voucher_redemptions`(`userId`);

-- Feature flags
CREATE TABLE `feature_flags` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `isEnabled` BOOLEAN NOT NULL DEFAULT false,
  `rules` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `feature_flags_key_key`(`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Referral system
CREATE TABLE `referrals` (
  `id` VARCHAR(191) NOT NULL,
  `referrerUserId` VARCHAR(191) NOT NULL,
  `referredEmail` VARCHAR(191) NOT NULL,
  `referredUserId` VARCHAR(191) NULL,
  `referralCode` VARCHAR(20) NOT NULL,
  `status` ENUM('PENDING', 'SIGNED_UP', 'CONVERTED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
  `rewardType` ENUM('PERCENTAGE', 'FLAT') NOT NULL DEFAULT 'PERCENTAGE',
  `rewardValue` DOUBLE NOT NULL DEFAULT 10,
  `rewardClaimed` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `convertedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `referrals_referralCode_key`(`referralCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `referrals_referrerUserId_idx` ON `referrals`(`referrerUserId`);
CREATE INDEX `referrals_referralCode_idx` ON `referrals`(`referralCode`);
CREATE INDEX `referrals_referredEmail_idx` ON `referrals`(`referredEmail`);
