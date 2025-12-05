-- Add Social & Network Layer and Premium Features

-- Update Review model to add missing fields
ALTER TABLE `reviews`
ADD COLUMN IF NOT EXISTS `authorCompany` VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS `helpful` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `response` JSON NULL,
ADD COLUMN IF NOT EXISTS `metadata` JSON NULL;

-- Create Video Testimonials table if not exists
CREATE TABLE IF NOT EXISTS `video_testimonials` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `videoUrl` VARCHAR(500) NOT NULL,
  `thumbnailUrl` VARCHAR(500) NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `customerTitle` VARCHAR(255) NULL,
  `customerAvatar` VARCHAR(500) NULL,
  `duration` INT NULL,
  `isPublished` BOOLEAN NOT NULL DEFAULT false,
  `viewCount` INT NOT NULL DEFAULT 0,
  `order` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `branchId` VARCHAR(191) NULL,
  `brandId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `video_testimonials_branchId_idx`(`branchId`),
  INDEX `video_testimonials_brandId_idx`(`brandId`),
  INDEX `video_testimonials_isPublished_idx`(`isPublished`),
  CONSTRAINT `video_testimonials_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `video_testimonials_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Social Proof Badges table if not exists
CREATE TABLE IF NOT EXISTS `social_proof_badges` (
  `id` VARCHAR(191) NOT NULL,
  `type` ENUM('TOP_SELLER', 'VERIFIED', 'TRUSTED', 'AWARD_WINNER', 'CERTIFIED', 'YEARS_IN_BUSINESS', 'CUSTOMER_FAVORITE', 'BEST_RATED', 'FEATURED', 'PREMIUM') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` VARCHAR(500) NULL,
  `icon` VARCHAR(255) NULL,
  `color` VARCHAR(50) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `displayOrder` INT NOT NULL DEFAULT 0,
  `expiresAt` DATETIME(3) NULL,
  `metadata` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `branchId` VARCHAR(191) NULL,
  `brandId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `social_proof_badges_branchId_idx`(`branchId`),
  INDEX `social_proof_badges_brandId_idx`(`brandId`),
  INDEX `social_proof_badges_isActive_idx`(`isActive`),
  CONSTRAINT `social_proof_badges_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `social_proof_badges_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Portfolio Items table if not exists
CREATE TABLE IF NOT EXISTS `portfolio_items` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(100) NULL,
  `imageUrl` VARCHAR(500) NULL,
  `videoUrl` VARCHAR(500) NULL,
  `projectUrl` VARCHAR(500) NULL,
  `clientName` VARCHAR(255) NULL,
  `completedAt` DATETIME(3) NULL,
  `tags` JSON NULL,
  `order` INT NOT NULL DEFAULT 0,
  `isPublished` BOOLEAN NOT NULL DEFAULT true,
  `viewCount` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `branchId` VARCHAR(191) NULL,
  `brandId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `portfolio_items_branchId_idx`(`branchId`),
  INDEX `portfolio_items_brandId_idx`(`brandId`),
  INDEX `portfolio_items_isPublished_idx`(`isPublished`),
  CONSTRAINT `portfolio_items_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `portfolio_items_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Offers table if not exists
CREATE TABLE IF NOT EXISTS `offers` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `code` VARCHAR(50) NULL,
  `discountType` ENUM('PERCENTAGE', 'FIXED_AMOUNT', 'BUY_ONE_GET_ONE', 'FREE_SHIPPING') NOT NULL DEFAULT 'PERCENTAGE',
  `discountValue` DOUBLE NOT NULL,
  `minPurchase` DOUBLE NULL,
  `maxDiscount` DOUBLE NULL,
  `imageUrl` VARCHAR(500) NULL,
  `startDate` DATETIME(3) NOT NULL,
  `endDate` DATETIME(3) NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `usageLimit` INT NULL,
  `usageCount` INT NOT NULL DEFAULT 0,
  `terms` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `branchId` VARCHAR(191) NULL,
  `brandId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `offers_branchId_idx`(`branchId`),
  INDEX `offers_brandId_idx`(`brandId`),
  INDEX `offers_isActive_idx`(`isActive`),
  INDEX `offers_endDate_idx`(`endDate`),
  CONSTRAINT `offers_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `offers_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Voice Intros table if not exists
CREATE TABLE IF NOT EXISTS `voice_intros` (
  `id` VARCHAR(191) NOT NULL,
  `audioUrl` VARCHAR(500) NOT NULL,
  `duration` INT NOT NULL,
  `transcript` TEXT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `playCount` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `branchId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `voice_intros_branchId_key`(`branchId`),
  CONSTRAINT `voice_intros_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create WhatsApp Catalogues table if not exists
CREATE TABLE IF NOT EXISTS `whatsapp_catalogues` (
  `id` VARCHAR(191) NOT NULL,
  `catalogueId` VARCHAR(255) NULL,
  `phoneNumber` VARCHAR(50) NOT NULL,
  `businessName` VARCHAR(255) NOT NULL,
  `lastSyncedAt` DATETIME(3) NULL,
  `syncStatus` ENUM('PENDING', 'SYNCING', 'SYNCED', 'FAILED') NOT NULL DEFAULT 'PENDING',
  `syncError` VARCHAR(500) NULL,
  `autoSync` BOOLEAN NOT NULL DEFAULT false,
  `syncFrequency` VARCHAR(50) NULL,
  `itemCount` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `branchId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `whatsapp_catalogues_branchId_key`(`branchId`),
  CONSTRAINT `whatsapp_catalogues_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create WhatsApp Catalogue Items table if not exists
CREATE TABLE IF NOT EXISTS `whatsapp_catalogue_items` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `price` DOUBLE NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `imageUrl` VARCHAR(500) NULL,
  `availability` ENUM('IN_STOCK', 'OUT_OF_STOCK', 'PREORDER') NOT NULL DEFAULT 'IN_STOCK',
  `whatsappItemId` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `catalogueId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `whatsapp_catalogue_items_catalogueId_idx`(`catalogueId`),
  CONSTRAINT `whatsapp_catalogue_items_catalogueId_fkey` FOREIGN KEY (`catalogueId`) REFERENCES `whatsapp_catalogues`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS `reviews_rating_idx` ON `reviews`(`rating`);
CREATE INDEX IF NOT EXISTS `reviews_createdAt_idx` ON `reviews`(`createdAt`);
