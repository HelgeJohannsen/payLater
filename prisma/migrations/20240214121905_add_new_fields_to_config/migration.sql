/*
  Warnings:

  - Added the required column `apiKey` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Config` ADD COLUMN `apiKey` VARCHAR(191) NOT NULL,
    ADD COLUMN `notificationHashKey` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;
