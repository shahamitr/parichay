-- AlterTable
ALTER TABLE `analytics_events` MODIFY `eventType` ENUM('PAGE_VIEW', 'CLICK', 'QR_SCAN', 'LEAD_SUBMIT', 'VCARD_DOWNLOAD') NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `backupCodes` JSON NULL,
    ADD COLUMN `mfaEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `mfaSecret` VARCHAR(191) NULL;
