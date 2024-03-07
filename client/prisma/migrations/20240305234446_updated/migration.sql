/*
  Warnings:

  - You are about to drop the `RecipeCuisineType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeSeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeSpecialDiet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecipeCuisineType" DROP CONSTRAINT "RecipeCuisineType_cuisineTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeCuisineType" DROP CONSTRAINT "RecipeCuisineType_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeSeason" DROP CONSTRAINT "RecipeSeason_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeSeason" DROP CONSTRAINT "RecipeSeason_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeSpecialDiet" DROP CONSTRAINT "RecipeSpecialDiet_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeSpecialDiet" DROP CONSTRAINT "RecipeSpecialDiet_specialDietId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_tagId_fkey";

-- DropTable
DROP TABLE "RecipeCuisineType";

-- DropTable
DROP TABLE "RecipeSeason";

-- DropTable
DROP TABLE "RecipeSpecialDiet";

-- DropTable
DROP TABLE "RecipeTag";

-- CreateTable
CREATE TABLE "RecipeOnCuisineTypes" (
    "recipeId" INTEGER NOT NULL,
    "cuisineTypeId" INTEGER NOT NULL,

    CONSTRAINT "RecipeOnCuisineTypes_pkey" PRIMARY KEY ("recipeId","cuisineTypeId")
);

-- CreateTable
CREATE TABLE "RecipeOnSeasons" (
    "recipeId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "RecipeOnSeasons_pkey" PRIMARY KEY ("recipeId","seasonId")
);

-- CreateTable
CREATE TABLE "RecipeOnSpecialDiets" (
    "recipeId" INTEGER NOT NULL,
    "specialDietId" INTEGER NOT NULL,

    CONSTRAINT "RecipeOnSpecialDiets_pkey" PRIMARY KEY ("recipeId","specialDietId")
);

-- CreateTable
CREATE TABLE "RecipeOnTags" (
    "recipeId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "RecipeOnTags_pkey" PRIMARY KEY ("recipeId","tagId")
);

-- AddForeignKey
ALTER TABLE "RecipeOnCuisineTypes" ADD CONSTRAINT "RecipeOnCuisineTypes_cuisineTypeId_fkey" FOREIGN KEY ("cuisineTypeId") REFERENCES "CuisineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnCuisineTypes" ADD CONSTRAINT "RecipeOnCuisineTypes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnSeasons" ADD CONSTRAINT "RecipeOnSeasons_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnSeasons" ADD CONSTRAINT "RecipeOnSeasons_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnSpecialDiets" ADD CONSTRAINT "RecipeOnSpecialDiets_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnSpecialDiets" ADD CONSTRAINT "RecipeOnSpecialDiets_specialDietId_fkey" FOREIGN KEY ("specialDietId") REFERENCES "SpecialDiet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnTags" ADD CONSTRAINT "RecipeOnTags_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnTags" ADD CONSTRAINT "RecipeOnTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
