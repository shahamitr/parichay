-- Add lead management and CRM features

-- Add lead status and tags (skip source as it exists)
ALTER TABLE `leads`
ADD COLUMN `status` ENUM('new', 'contacted', 'qualified', 'converted', 'lost') NOT NULL DEFAULT 'new',
ADD COLUMN `tags` JSON NULL,
ADD COLUMN `notes` TEXT NULL,
ADD COLUMN `lastContactedAt` DATETIME(3) NULL,
ADD COLUMN `nextFollowUpAt` DATETIME(3) NULL,
ADD COLUMN `assignedTo` VARCHAR(191) NULL,
ADD COLUMN `conversionValue` DECIMAL(10,2) NULL,
ADD COLUMN `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium';

-- Create lead activities table for tracking interactions
CREATE TABLE `lead_activities` (
  `id` VARCHAR(191) NOT NULL,
  `leadId` VARCHAR(191) NOT NULL,
  `activityType` ENUM('call', 'email', 'whatsapp', 'meeting', 'note', 'status_change') NOT NULL,
  `description` TEXT NOT NULL,
  `metadata` JSON NULL,
  `createdBy` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `lead_activities_leadId_idx`(`leadId`),
  INDEX `lead_activities_createdAt_idx`(`createdAt`),
  CONSTRAINT `lead_activities_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create lead reminders table
CREATE TABLE `lead_reminders` (
  `id` VARCHAR(191) NOT NULL,
  `leadId` VARCHAR(191) NOT NULL,
  `reminderDate` DATETIME(3) NOT NULL,
  `reminderType` ENUM('follow_up', 'callback', 'meeting', 'email', 'whatsapp') NOT NULL,
  `message` TEXT NOT NULL,
  `isCompleted` BOOLEAN NOT NULL DEFAULT false,
  `completedAt` DATETIME(3) NULL,
  `assignedTo` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `lead_reminders_leadId_idx`(`leadId`),
  INDEX `lead_reminders_reminderDate_idx`(`reminderDate`),
  INDEX `lead_reminders_isCompleted_idx`(`isCompleted`),
  CONSTRAINT `lead_reminders_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create visitor analytics table
CREATE TABLE `visitor_analytics` (
  `id` VARCHAR(191) NOT NULL,
  `branchId` VARCHAR(191) NOT NULL,
  `brandId` VARCHAR(191) NOT NULL,
  `sessionId` VARCHAR(191) NOT NULL,
  `visitorId` VARCHAR(191) NULL,
  `ipAddress` VARCHAR(100) NULL,
  `userAgent` TEXT NULL,
  `referrer` TEXT NULL,
  `landingPage` VARCHAR(500) NULL,
  `exitPage` VARCHAR(500) NULL,
  `pageViews` INT NOT NULL DEFAULT 1,
  `timeOnSite` INT NULL,
  `deviceType` VARCHAR(50) NULL,
  `browser` VARCHAR(100) NULL,
  `os` VARCHAR(100) NULL,
  `country` VARCHAR(100) NULL,
  `city` VARCHAR(100) NULL,
  `converted` BOOLEAN NOT NULL DEFAULT false,
  `conversionType` VARCHAR(100) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `visitor_analytics_branchId_idx`(`branchId`),
  INDEX `visitor_analytics_sessionId_idx`(`sessionId`),
  INDEX `visitor_analytics_createdAt_idx`(`createdAt`),
  INDEX `visitor_analytics_converted_idx`(`converted`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add indexes for better query performance
CREATE INDEX `leads_status_idx` ON `leads`(`status`);
CREATE INDEX `leads_nextFollowUpAt_idx` ON `leads`(`nextFollowUpAt`);
CREATE INDEX `leads_assignedTo_idx` ON `leads`(`assignedTo`);
CREATE INDEX `leads_createdAt_idx` ON `leads`(`createdAt`);
