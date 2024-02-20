/*
  Warnings:

  - Made the column `dueDate` on table `BillingInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `BillingInfo` MODIFY `billingDate` VARCHAR(191) NOT NULL,
    MODIFY `dueDate` VARCHAR(191) NOT NULL,
    MODIFY `billingNetAmount` DOUBLE NULL,
    MODIFY `paymentType` VARCHAR(191) NULL;
