/*
  Warnings:

  - You are about to alter the column `billingAmount` on the `BillingInfo` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `billingNetAmount` on the `BillingInfo` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `partialFFAmount` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `BillingInfo` MODIFY `billingAmount` VARCHAR(191) NOT NULL,
    MODIFY `billingNetAmount` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Orders` MODIFY `partialFFAmount` VARCHAR(191) NULL;
