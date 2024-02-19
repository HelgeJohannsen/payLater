/*
  Warnings:

  - You are about to alter the column `partialFFStatus` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Orders` MODIFY `partialFFStatus` VARCHAR(191) NULL;
