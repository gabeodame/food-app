import { prisma } from "./prisma";

export const formatRecipeResponse = async (
  recipe: any,
  currentUserId: string
) => {
  if (!recipe) {
    throw new Error("Recipe data is undefined");
  }

  // Fetch view count from RecipeView table
  const viewCount = await prisma.recipeView.count({
    where: { recipeId: recipe.id },
  });

  // Check if the current user has favorited the recipe
  const isFavoritedByCurrentUser =
    recipe?.favoritedBy?.some((fav: any) => fav?.userId === currentUserId) ??
    false;

  return {
    id: recipe?.id ?? null,
    title: recipe?.title ?? "",
    slug: recipe?.slug ?? "",
    imageUrl: recipe?.imageUrl ?? "",
    description: recipe?.description ?? "",
    userId: recipe?.userId ?? null,
    favoritesCount: recipe?.favoritedBy?.length ?? 0,
    isFavoritedByCurrentUser,
    views: viewCount,

    // ✅ Ensure `ingredients` exist and have required properties
    ingredients:
      recipe?.ingredients?.map((ri: any) => ({
        id: ri?.ingredient?.id ?? null,
        name: ri?.ingredient?.name ?? "",
        category: ri?.ingredient?.category ?? "",
        unit: ri?.unit ?? "",
        quantity: ri?.quantity ?? 0,
        recipeId: recipe?.id ?? null,
      })) ?? [],

    // ✅ Ensure `instructions` exist and are properly structured
    instructions:
      recipe?.instructions?.map((instruction: any) => ({
        id: instruction?.id?.toString() ?? "", // Convert to string to avoid INT4 errors
        step: instruction?.step ?? "",
      })) ?? [],

    // ✅ Ensure `categories` are properly structured
    categories:
      recipe?.categories?.map((cat: any) => ({
        id: cat?.category?.id ?? null,
        name: cat?.category?.name ?? "",
      })) ?? [],

    // ✅ Ensure `tags` are correctly extracted
    tags:
      recipe?.tags?.map((tag: any) => ({
        id: tag?.tag?.id ?? null,
        name: tag?.tag?.name ?? "",
      })) ?? [],

    // ✅ Ensure `seasons` are correctly extracted
    seasons:
      recipe?.seasons?.map((season: any) => ({
        id: season?.season?.id ?? null,
        name: season?.season?.name ?? "",
      })) ?? [],

    // ✅ Ensure `cuisineTypes` are correctly extracted
    cuisineTypes:
      recipe?.cuisineTypes?.map((cuisine: any) => ({
        id: cuisine?.cuisineType?.id ?? null,
        name: cuisine?.cuisineType?.name ?? "",
      })) ?? [],

    // ✅ Ensure `specialDiets` are correctly extracted
    specialDiets:
      recipe?.specialDiets?.map((diet: any) => ({
        id: diet?.specialDiet?.id ?? null,
        name: diet?.specialDiet?.name ?? "",
      })) ?? [],

    createdAt: recipe?.createdAt ?? null,
    updatedAt: recipe?.updatedAt ?? null,
  };
};
