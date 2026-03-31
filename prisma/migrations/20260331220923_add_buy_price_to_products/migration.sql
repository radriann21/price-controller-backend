/*
  Warnings:

  - Added the required column `buyPriceVes` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "buyPriceVes" DECIMAL(10,2) NOT NULL;
