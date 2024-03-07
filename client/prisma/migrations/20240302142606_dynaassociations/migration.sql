/*
  Warnings:

  - You are about to drop the `_RecipeCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipeCuisineTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipeSeasons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipeSpecialDiets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipeTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RecipeCategories" DROP CONSTRAINT "_RecipeCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeCategories" DROP CONSTRAINT "_RecipeCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeCuisineTypes" DROP CONSTRAINT "_RecipeCuisineTypes_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeCuisineTypes" DROP CONSTRAINT "_RecipeCuisineTypes_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeSeasons" DROP CONSTRAINT "_RecipeSeasons_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeSeasons" DROP CONSTRAINT "_RecipeSeasons_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeSpecialDiets" DROP CONSTRAINT "_RecipeSpecialDiets_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeSpecialDiets" DROP CONSTRAINT "_RecipeSpecialDiets_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeTags" DROP CONSTRAINT "_RecipeTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeTags" DROP CONSTRAINT "_RecipeTags_B_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "_RecipeCategories";

-- DropTable
DROP TABLE "_RecipeCuisineTypes";

-- DropTable
DROP TABLE "_RecipeSeasons";

-- DropTable
DROP TABLE "_RecipeSpecialDiets";

-- DropTable
DROP TABLE "_RecipeTags";

-- CreateTable
CREATE TABLE "RecipeCategory" (
    "recipeId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY ("recipeId","categoryId")
);

-- CreateTable
CREATE TABLE "RecipeTag" (
    "recipeId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "RecipeTag_pkey" PRIMARY KEY ("recipeId","tagId")
);

-- CreateTable
CREATE TABLE "RecipeCuisineType" (
    "recipeId" INTEGER NOT NULL,
    "cuisineTypeId" INTEGER NOT NULL,

    CONSTRAINT "RecipeCuisineType_pkey" PRIMARY KEY ("recipeId","cuisineTypeId")
);

-- CreateTable
CREATE TABLE "RecipeSeason" (
    "recipeId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "RecipeSeason_pkey" PRIMARY KEY ("recipeId","seasonId")
);

-- CreateTable
CREATE TABLE "RecipeSpecialDiet" (
    "recipeId" INTEGER NOT NULL,
    "specialDietId" INTEGER NOT NULL,

    CONSTRAINT "RecipeSpecialDiet_pkey" PRIMARY KEY ("recipeId","specialDietId")
);

-- AddForeignKey
ALTER TABLE "RecipeCategory" ADD CONSTRAINT "RecipeCategory_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCategory" ADD CONSTRAINT "RecipeCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCuisineType" ADD CONSTRAINT "RecipeCuisineType_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCuisineType" ADD CONSTRAINT "RecipeCuisineType_cuisineTypeId_fkey" FOREIGN KEY ("cuisineTypeId") REFERENCES "CuisineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSeason" ADD CONSTRAINT "RecipeSeason_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSeason" ADD CONSTRAINT "RecipeSeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSpecialDiet" ADD CONSTRAINT "RecipeSpecialDiet_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSpecialDiet" ADD CONSTRAINT "RecipeSpecialDiet_specialDietId_fkey" FOREIGN KEY ("specialDietId") REFERENCES "SpecialDiet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
