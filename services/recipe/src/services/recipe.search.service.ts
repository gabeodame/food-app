import { BadRequestError } from "@gogittix/common";
import { prisma } from "../utils/prisma";
import axios from "axios";

class RecipeSearchService {
  async searchBySlug(query: Record<string, string | string[]>, req: any) {
    try {
      const filters: Record<string, any> = {};

      console.log("Incoming Query Parameters:", query);

      const hasValidFilters = Object.keys(query).some((key) =>
        [
          "ingredientName",
          "ingredientId",
          "category",
          "slug",
          "currentUserId",
        ].includes(key)
      );

      if (!hasValidFilters) {
        throw new BadRequestError(
          "Invalid search query. No valid filters provided."
        );
      }

      if (query.currentUserId) {
        if (!req?.currentUser?.id) {
          throw new BadRequestError(
            `Authentication required for user-based filtering. req.currentUser.id ${req.currentUser.id}`
          );
        }
        filters.userId = req.currentUser.id;
      }

      if (query.ingredientName) {
        filters.ingredients = {
          some: {
            ingredient: {
              name: {
                contains: query.ingredientName as string,
                mode: "insensitive",
              },
            },
          },
        };
      }

      if (query.ingredientId) {
        filters.ingredients = {
          some: { ingredientId: parseInt(query.ingredientId as string, 10) },
        };
      }

      if (query.category) {
        filters.categories = {
          some: {
            category: {
              name: { contains: query.category as string, mode: "insensitive" },
            },
          },
        };
      }

      if (query.slug) {
        filters.slug = { contains: query.slug as string, mode: "insensitive" };
      }

      console.log(
        "Generated Prisma Filters:",
        JSON.stringify(filters, null, 2)
      );

      const recipes = await prisma.recipe.findMany({
        where: filters,
        include: {
          ingredients: { include: { ingredient: true } },
          categories: { include: { category: true } },
        },
        take: 20,
      });

      console.log(`Fetched ${recipes.length} recipes`);

      return recipes;
    } catch (error: any) {
      console.error("Error searching recipes:", error);
      if (error.code === "P2025") {
        throw new BadRequestError("No matching recipes found.");
      }
      throw new BadRequestError(`Search failed: ${error.message}`);
    }
  }

  async getRecipesWithIngredient(
    ingredientId?: number,
    ingredientName?: string
  ) {
    if (!ingredientId && !ingredientName) {
      throw new BadRequestError("Ingredient ID or Name is required.");
    }

    // ✅ Step 1: Fetch recipes that use this ingredient
    const recipes = await prisma.recipe.findMany({
      where: {
        ingredients: {
          some: {
            ingredientId: ingredientId,
            ingredient: ingredientName
              ? { name: { contains: ingredientName, mode: "insensitive" } }
              : undefined,
          },
        },
      },
      include: {
        ingredients: {
          include: { ingredient: true }, // Fetch ingredient details
        },
      },
      take: 20,
    });

    if (recipes.length === 0) {
      return [];
    }

    // ✅ Step 2: Extract unique ingredient IDs for lookup
    const uniqueIngredientIds = [
      ...new Set(
        recipes.flatMap((recipe) =>
          recipe.ingredients.map((ri) => ri.ingredientId)
        )
      ),
    ];

    // ✅ Step 3: Fetch nutritional info from Ingredient Service
    try {
      const ingredientDetails = await axios.get(
        `http://ingredient-service.api.svc.cluster.local/api/1/ingredient/batch`,
        { params: { ids: uniqueIngredientIds.join(",") } }
      );

      const ingredientDataMap = ingredientDetails.data.reduce(
        (acc: any, ingredient: any) => {
          acc[ingredient.id] = ingredient;
          return acc;
        },
        {}
      );

      // ✅ Step 4: Enrich recipes with ingredient details
      return recipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        nutritionalBreakdown: this.calculateNutrition(
          recipe.ingredients,
          ingredientDataMap
        ),
      }));
    } catch (error) {
      console.error("Failed to fetch ingredient details:", error);
      throw new BadRequestError("Could not retrieve ingredient data.");
    }
  }

  // ✅ Compute Nutrition Per Recipe
  private calculateNutrition(
    recipeIngredients: any[],
    ingredientDataMap: Record<number, any>
  ) {
    return recipeIngredients.reduce(
      (acc, ri) => {
        const ingredient = ingredientDataMap[ri.ingredientId];
        if (!ingredient) return acc; // Skip if ingredient data is missing

        acc.calories += (ingredient.calories || 0) * (ri.quantity || 1);
        acc.protein += (ingredient.protein || 0) * (ri.quantity || 1);
        acc.fat += (ingredient.fat || 0) * (ri.quantity || 1);
        acc.carbohydrates +=
          (ingredient.carbohydrates || 0) * (ri.quantity || 1);

        if (ingredient.allergens) {
          acc.allergens.add(
            ...ingredient.allergens.split(",").map((a: string) => a.trim())
          );
        }

        return acc;
      },
      {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        allergens: new Set(),
      }
    );
  }
}

export default new RecipeSearchService();
