/*
  Warnings:

  - You are about to drop the `RecipeOnCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeOnCuisineTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeOnSeasons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeOnSpecialDiets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeOnTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecipeOnCategories" DROP CONSTRAINT "RecipeOnCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnCategories" DROP CONSTRAINT "RecipeOnCategories_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnCuisineTypes" DROP CONSTRAINT "RecipeOnCuisineTypes_cuisineTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnCuisineTypes" DROP CONSTRAINT "RecipeOnCuisineTypes_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnSeasons" DROP CONSTRAINT "RecipeOnSeasons_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnSeasons" DROP CONSTRAINT "RecipeOnSeasons_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnSpecialDiets" DROP CONSTRAINT "RecipeOnSpecialDiets_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnSpecialDiets" DROP CONSTRAINT "RecipeOnSpecialDiets_specialDietId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnTags" DROP CONSTRAINT "RecipeOnTags_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnTags" DROP CONSTRAINT "RecipeOnTags_tagId_fkey";

-- DropTable
DROP TABLE "RecipeOnCategories";

-- DropTable
DROP TABLE "RecipeOnCuisineTypes";

-- DropTable
DROP TABLE "RecipeOnSeasons";

-- DropTable
DROP TABLE "RecipeOnSpecialDiets";

-- DropTable
DROP TABLE "RecipeOnTags";

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
ALTER TABLE "RecipeCategory" ADD CONSTRAINT "RecipeCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCategory" ADD CONSTRAINT "RecipeCategory_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCuisineType" ADD CONSTRAINT "RecipeCuisineType_cuisineTypeId_fkey" FOREIGN KEY ("cuisineTypeId") REFERENCES "CuisineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCuisineType" ADD CONSTRAINT "RecipeCuisineType_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSeason" ADD CONSTRAINT "RecipeSeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSeason" ADD CONSTRAINT "RecipeSeason_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSpecialDiet" ADD CONSTRAINT "RecipeSpecialDiet_specialDietId_fkey" FOREIGN KEY ("specialDietId") REFERENCES "SpecialDiet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSpecialDiet" ADD CONSTRAINT "RecipeSpecialDiet_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
