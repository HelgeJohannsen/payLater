-- DropForeignKey
ALTER TABLE `BillingInfo` DROP FOREIGN KEY `BillingInfo_orderNumberRef_fkey`;

-- DropForeignKey
ALTER TABLE `CustomerDetails` DROP FOREIGN KEY `CustomerDetails_orderNumberRef_fkey`;

-- DropForeignKey
ALTER TABLE `OrderDetails` DROP FOREIGN KEY `OrderDetails_orderNumberRef_fkey`;

-- AlterTable
ALTER TABLE `BillingInfo` MODIFY `orderNumberRef` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `Customer` MODIFY `customerId` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `CustomerDetails` MODIFY `orderNumberRef` BIGINT NOT NULL,
    MODIFY `customerId` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `OrderDetails` MODIFY `orderNumberRef` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `Orders` MODIFY `orderNumber` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `CustomerDetails` ADD CONSTRAINT `CustomerDetails_orderNumberRef_fkey` FOREIGN KEY (`orderNumberRef`) REFERENCES `Orders`(`orderNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetails` ADD CONSTRAINT `OrderDetails_orderNumberRef_fkey` FOREIGN KEY (`orderNumberRef`) REFERENCES `Orders`(`orderNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingInfo` ADD CONSTRAINT `BillingInfo_orderNumberRef_fkey` FOREIGN KEY (`orderNumberRef`) REFERENCES `Orders`(`orderNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;
