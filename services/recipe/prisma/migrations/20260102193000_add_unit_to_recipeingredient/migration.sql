-- Add missing unit column for RecipeIngredient to match Prisma schema
ALTER TABLE "RecipeIngredient" ADD COLUMN "unit" TEXT;
