-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191) NULL,
    `expires` DATETIME(3) NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `userId` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop` VARCHAR(191) NOT NULL,
    `customerAccountNumber` VARCHAR(191) NOT NULL,
    `vendorId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `apiKey` VARCHAR(191) NOT NULL,
    `notificationHashKey` VARCHAR(191) NULL,

    UNIQUE INDEX `Config_shop_key`(`shop`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customCustomerIdRef` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,

    UNIQUE INDEX `Customer_customCustomerIdRef_key`(`customCustomerIdRef`),
    UNIQUE INDEX `Customer_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NOT NULL,
    `orderNumber` INTEGER NOT NULL,
    `orderName` VARCHAR(191) NOT NULL,
    `customCustomerId` VARCHAR(191) NULL,
    `applicationNumber` VARCHAR(191) NULL,
    `paymentGatewayName` VARCHAR(191) NOT NULL,
    `paymentMethode` VARCHAR(191) NOT NULL,
    `orderAmount` VARCHAR(191) NOT NULL,
    `confirmCreditStatus` VARCHAR(191) NULL,
    `fulfillStatus` VARCHAR(191) NULL,
    `cancelStatus` VARCHAR(191) NULL,
    `partialFFStatus` BOOLEAN NULL,
    `partialFFAmount` DOUBLE NULL,

    UNIQUE INDEX `Orders_orderId_key`(`orderId`),
    UNIQUE INDEX `Orders_orderNumber_key`(`orderNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumberRef` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CustomerDetails_orderNumberRef_key`(`orderNumberRef`),
    UNIQUE INDEX `CustomerDetails_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumberRef` INTEGER NOT NULL,
    `details` VARCHAR(191) NULL,

    UNIQUE INDEX `OrderDetails_orderNumberRef_key`(`orderNumberRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillingInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumberRef` INTEGER NOT NULL,
    `billingType` VARCHAR(191) NOT NULL,
    `billingNumber` VARCHAR(191) NULL,
    `billingDate` DATETIME(3) NOT NULL,
    `billingReferenceNumber` VARCHAR(191) NULL,
    `dueDate` DATETIME(3) NULL,
    `billingAmount` DOUBLE NOT NULL,
    `billingNetAmount` DOUBLE NOT NULL,
    `paymentType` VARCHAR(191) NOT NULL,
    `receiptNote` VARCHAR(191) NULL,

    UNIQUE INDEX `BillingInfo_orderNumberRef_key`(`orderNumberRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_customCustomerId_fkey` FOREIGN KEY (`customCustomerId`) REFERENCES `Customer`(`customCustomerIdRef`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerDetails` ADD CONSTRAINT `CustomerDetails_orderNumberRef_fkey` FOREIGN KEY (`orderNumberRef`) REFERENCES `Orders`(`orderNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetails` ADD CONSTRAINT `OrderDetails_orderNumberRef_fkey` FOREIGN KEY (`orderNumberRef`) REFERENCES `Orders`(`orderNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingInfo` ADD CONSTRAINT `BillingInfo_orderNumberRef_fkey` FOREIGN KEY (`orderNumberRef`) REFERENCES `Orders`(`orderNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;
