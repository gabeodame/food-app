/*
  Warnings:

  - You are about to drop the `RecipeCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecipeCategory" DROP CONSTRAINT "RecipeCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeCategory" DROP CONSTRAINT "RecipeCategory_recipeId_fkey";

-- DropTable
DROP TABLE "RecipeCategory";

-- CreateTable
CREATE TABLE "RecipeOnCategories" (
    "recipeId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "RecipeOnCategories_pkey" PRIMARY KEY ("recipeId","categoryId")
);

-- AddForeignKey
ALTER TABLE "RecipeOnCategories" ADD CONSTRAINT "RecipeOnCategories_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnCategories" ADD CONSTRAINT "RecipeOnCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
