-- CreateTable: customers
CREATE TABLE `customers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `companyName` VARCHAR(191) NULL,
    `tags` JSON NULL,
    `customFields` JSON NULL,
    `notes` TEXT NULL,
    `birthday` DATETIME(3) NULL,
    `anniversary` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `totalInvoiceValue` DOUBLE NOT NULL DEFAULT 0,
    `lastInteractionAt` DATETIME(3) NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_leadId_key`(`leadId`),
    INDEX `customers_branchId_deletedAt_idx`(`branchId`, `deletedAt`),
    INDEX `customers_name_idx`(`name`),
    INDEX `customers_phone_idx`(`phone`),
    INDEX `customers_email_idx`(`email`),
    INDEX `customers_lastInteractionAt_idx`(`lastInteractionAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: customer_interactions
CREATE TABLE `customer_interactions` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PHONE_CALL', 'WHATSAPP', 'EMAIL', 'IN_PERSON', 'SMS', 'CUSTOM', 'APPOINTMENT_BOOKED', 'INVOICE_SENT', 'PAYMENT_RECEIVED') NOT NULL,
    `summary` TEXT NULL,
    `duration` INTEGER NULL,
    `attachments` JSON NULL,
    `metadata` JSON NULL,
    `loggedById` VARCHAR(191) NULL,
    `loggedByName` VARCHAR(191) NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `customer_interactions_customerId_createdAt_idx`(`customerId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- CreateTable: business_invoices
CREATE TABLE `business_invoices` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(50) NOT NULL,
    `status` ENUM('DRAFT', 'SENT', 'VIEWED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `invoiceDate` DATETIME(3) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `lineItems` JSON NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `discountType` VARCHAR(191) NULL,
    `discountValue` DOUBLE NULL,
    `discountAmount` DOUBLE NOT NULL DEFAULT 0,
    `taxAmount` DOUBLE NOT NULL DEFAULT 0,
    `grandTotal` DOUBLE NOT NULL,
    `amountPaid` DOUBLE NOT NULL DEFAULT 0,
    `balanceDue` DOUBLE NOT NULL,
    `gstEnabled` BOOLEAN NOT NULL DEFAULT false,
    `sellerGstin` VARCHAR(191) NULL,
    `buyerGstin` VARCHAR(191) NULL,
    `placeOfSupply` VARCHAR(191) NULL,
    `cgstTotal` DOUBLE NULL,
    `sgstTotal` DOUBLE NULL,
    `igstTotal` DOUBLE NULL,
    `notes` TEXT NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `pdfGeneratedAt` DATETIME(3) NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `customerId` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `business_invoices_invoiceNumber_key`(`invoiceNumber`),
    INDEX `business_invoices_branchId_status_idx`(`branchId`, `status`),
    INDEX `business_invoices_customerId_idx`(`customerId`),
    INDEX `business_invoices_dueDate_status_idx`(`dueDate`, `status`),
    INDEX `business_invoices_invoiceNumber_idx`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: invoice_payments
CREATE TABLE `invoice_payments` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `invoice_payments_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: invoice_payment_links
CREATE TABLE `invoice_payment_links` (
    `id` VARCHAR(191) NOT NULL,
    `linkCode` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `status` ENUM('ACTIVE', 'PAID', 'EXPIRED', 'FAILED') NOT NULL DEFAULT 'ACTIVE',
    `gateway` ENUM('STRIPE', 'RAZORPAY') NOT NULL,
    `externalOrderId` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `invoice_payment_links_linkCode_key`(`linkCode`),
    INDEX `invoice_payment_links_linkCode_idx`(`linkCode`),
    INDEX `invoice_payment_links_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: recurring_invoices
CREATE TABLE `recurring_invoices` (
    `id` VARCHAR(191) NOT NULL,
    `frequency` ENUM('WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY') NOT NULL,
    `nextGenerateAt` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `maxOccurrences` INTEGER NULL,
    `occurrenceCount` INTEGER NOT NULL DEFAULT 0,
    `isPaused` BOOLEAN NOT NULL DEFAULT false,
    `autoSend` BOOLEAN NOT NULL DEFAULT false,
    `invoiceId` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `recurring_invoices_invoiceId_key`(`invoiceId`),
    INDEX `recurring_invoices_nextGenerateAt_isPaused_idx`(`nextGenerateAt`, `isPaused`),
    INDEX `recurring_invoices_branchId_idx`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: invoice_settings
CREATE TABLE `invoice_settings` (
    `id` VARCHAR(191) NOT NULL,
    `businessName` VARCHAR(191) NOT NULL,
    `businessAddress` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `logoUrl` VARCHAR(191) NULL,
    `signatureUrl` VARCHAR(191) NULL,
    `gstin` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NULL,
    `ifscCode` VARCHAR(191) NULL,
    `upiId` VARCHAR(191) NULL,
    `defaultPaymentTerms` TEXT NULL,
    `footerNote` TEXT NULL,
    `colorAccent` VARCHAR(191) NULL DEFAULT '#3B82F6',
    `templateStyle` VARCHAR(191) NOT NULL DEFAULT 'MODERN',
    `invoicePrefix` VARCHAR(191) NOT NULL DEFAULT 'INV',
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `invoice_settings_branchId_key`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: reusable_line_items
CREATE TABLE `reusable_line_items` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `taxRate` DOUBLE NOT NULL DEFAULT 18,
    `hsnSacCode` VARCHAR(191) NULL,
    `unit` VARCHAR(191) NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reusable_line_items_branchId_idx`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: expenses
CREATE TABLE `expenses` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `vendorName` VARCHAR(191) NULL,
    `receiptUrl` VARCHAR(191) NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `expenses_branchId_date_idx`(`branchId`, `date`),
    INDEX `expenses_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: expense_categories
CREATE TABLE `expense_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `branchId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `expense_categories_branchId_name_key`(`branchId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- CreateTable: customer_reminders
CREATE TABLE `customer_reminders` (
    `id` VARCHAR(191) NOT NULL,
    `reminderDate` DATETIME(3) NOT NULL,
    `message` TEXT NOT NULL,
    `channel` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `customerId` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `customer_reminders_reminderDate_status_idx`(`reminderDate`, `status`),
    INDEX `customer_reminders_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: reminder_configs
CREATE TABLE `reminder_configs` (
    `id` VARCHAR(191) NOT NULL,
    `autoRemindersEnabled` BOOLEAN NOT NULL DEFAULT true,
    `beforeDueDays` INTEGER NOT NULL DEFAULT 3,
    `onDueDateEnabled` BOOLEAN NOT NULL DEFAULT true,
    `afterDueDays` INTEGER NOT NULL DEFAULT 7,
    `maxReminders` INTEGER NOT NULL DEFAULT 4,
    `intervalDays` INTEGER NOT NULL DEFAULT 7,
    `channels` JSON NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `reminder_configs_branchId_key`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: greeting_templates
CREATE TABLE `greeting_templates` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `channel` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NULL,
    `body` TEXT NOT NULL,
    `includeDiscount` BOOLEAN NOT NULL DEFAULT false,
    `discountDays` INTEGER NULL,
    `sendTime` VARCHAR(191) NOT NULL DEFAULT '09:00',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `greeting_templates_branchId_type_idx`(`branchId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: greeting_logs
CREATE TABLE `greeting_logs` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `channel` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SENT',
    `discountCode` VARCHAR(191) NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `greeting_logs_customerId_type_year_key`(`customerId`, `type`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: customer_segments
CREATE TABLE `customer_segments` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `criteria` JSON NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `customer_segments_branchId_idx`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: review_requests
CREATE TABLE `review_requests` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `scheduledFor` DATETIME(3) NOT NULL,
    `sentAt` DATETIME(3) NULL,
    `clickedAt` DATETIME(3) NULL,
    `channel` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `review_requests_scheduledFor_status_idx`(`scheduledFor`, `status`),
    INDEX `review_requests_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: review_request_configs
CREATE TABLE `review_request_configs` (
    `id` VARCHAR(191) NOT NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,
    `delayDays` INTEGER NOT NULL DEFAULT 2,
    `googleReviewLink` VARCHAR(191) NULL,
    `messageTemplate` TEXT NULL,
    `channel` VARCHAR(191) NOT NULL DEFAULT 'email',
    `cooldownDays` INTEGER NOT NULL DEFAULT 90,
    `branchId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `review_request_configs_branchId_key`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: invoice_sequences
CREATE TABLE `invoice_sequences` (
    `id` VARCHAR(191) NOT NULL,
    `prefix` VARCHAR(191) NOT NULL,
    `financialYear` VARCHAR(191) NOT NULL,
    `lastNumber` INTEGER NOT NULL DEFAULT 0,
    `branchId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `invoice_sequences_branchId_prefix_financialYear_key`(`branchId`, `prefix`, `financialYear`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey: customers -> branches
ALTER TABLE `customers` ADD CONSTRAINT `customers_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: customers -> leads
ALTER TABLE `customers` ADD CONSTRAINT `customers_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: customer_interactions -> customers
ALTER TABLE `customer_interactions` ADD CONSTRAINT `customer_interactions_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: business_invoices -> customers
ALTER TABLE `business_invoices` ADD CONSTRAINT `business_invoices_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: business_invoices -> branches
ALTER TABLE `business_invoices` ADD CONSTRAINT `business_invoices_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: invoice_payments -> business_invoices
ALTER TABLE `invoice_payments` ADD CONSTRAINT `invoice_payments_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `business_invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: invoice_payment_links -> business_invoices
ALTER TABLE `invoice_payment_links` ADD CONSTRAINT `invoice_payment_links_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `business_invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: recurring_invoices -> business_invoices
ALTER TABLE `recurring_invoices` ADD CONSTRAINT `recurring_invoices_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `business_invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: recurring_invoices -> branches
ALTER TABLE `recurring_invoices` ADD CONSTRAINT `recurring_invoices_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: invoice_settings -> branches
ALTER TABLE `invoice_settings` ADD CONSTRAINT `invoice_settings_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: reusable_line_items -> branches
ALTER TABLE `reusable_line_items` ADD CONSTRAINT `reusable_line_items_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: expenses -> branches
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: expense_categories -> branches
ALTER TABLE `expense_categories` ADD CONSTRAINT `expense_categories_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: customer_reminders -> customers
ALTER TABLE `customer_reminders` ADD CONSTRAINT `customer_reminders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: customer_reminders -> branches
ALTER TABLE `customer_reminders` ADD CONSTRAINT `customer_reminders_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: reminder_configs -> branches
ALTER TABLE `reminder_configs` ADD CONSTRAINT `reminder_configs_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: greeting_templates -> branches
ALTER TABLE `greeting_templates` ADD CONSTRAINT `greeting_templates_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: greeting_logs -> customers
ALTER TABLE `greeting_logs` ADD CONSTRAINT `greeting_logs_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: customer_segments -> branches
ALTER TABLE `customer_segments` ADD CONSTRAINT `customer_segments_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: review_requests -> customers
ALTER TABLE `review_requests` ADD CONSTRAINT `review_requests_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: review_requests -> branches
ALTER TABLE `review_requests` ADD CONSTRAINT `review_requests_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: review_request_configs -> branches
ALTER TABLE `review_request_configs` ADD CONSTRAINT `review_request_configs_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: invoice_sequences -> branches
ALTER TABLE `invoice_sequences` ADD CONSTRAINT `invoice_sequences_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
