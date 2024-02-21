/*
  Warnings:

  - You are about to drop the column `partialFFStatus` on the `Orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `partialFFStatus`,
    ADD COLUMN `partiallyFF` VARCHAR(191) NULL;
