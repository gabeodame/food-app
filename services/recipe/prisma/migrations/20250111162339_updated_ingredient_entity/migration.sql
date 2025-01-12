/*
  Warnings:

  - The `quantity` column on the `Ingredient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "quantity",
ADD COLUMN     "quantity" DOUBLE PRECISION;
