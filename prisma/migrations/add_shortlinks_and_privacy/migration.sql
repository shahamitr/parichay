-- Add short links table
CREATE TABLE `short_links` (
  `id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(8) NOT NULL,
  `targetUrl` TEXT NOT NULL,
  `branchId` VARCHAR(191) NULL,
  `brandId` VARCHAR(191) NULL,
  `clicks` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expiresAt` DATETIME(3) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `short_links_code_key`(`code`),
  INDEX `short_links_branchId_idx`(`branchId`),
  INDEX `short_links_brandId_idx`(`brandId`),
  CONSTRAINT `short_links_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `short_links_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add privacy fields to branches table
ALTER TABLE `branches`
ADD COLUMN `visibility` ENUM('public', 'private', 'unlisted') NOT NULL DEFAULT 'public',
ADD COLUMN `accessPassword` VARCHAR(191) NULL,
ADD COLUMN `accessToken` VARCHAR(191) NULL,
ADD COLUMN `tokenExpiresAt` DATETIME(3) NULL,
ADD UNIQUE INDEX `branches_accessToken_key`(`accessToken`);
