-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_recipeId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "recipeId" DROP NOT NULL;
DROP SEQUENCE "Ingredient_id_seq";

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
