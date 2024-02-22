/*
  Warnings:

  - You are about to alter the column `billingAmount` on the `RefundsDetails` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `billingNetAmount` on the `RefundsDetails` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - Added the required column `email` to the `CustomerDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingDate` to the `RefundsDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingNumber` to the `RefundsDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CustomerDetails` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `RefundsDetails` ADD COLUMN `billingDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `billingNumber` VARCHAR(191) NOT NULL,
    MODIFY `billingAmount` VARCHAR(191) NOT NULL,
    MODIFY `billingNetAmount` VARCHAR(191) NULL;
