import { BadRequestError } from "@gogittix/common";
import { prisma } from "../utils/prisma";

class RecipeSearchService {
  async searchBySlug(query: Record<string, string | string[]>, req: any) {
    try {
      const filters: Record<string, any> = {};

      // ✅ Validate filters before querying
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

      // ✅ Ensure currentUserId is correctly handled
      if (query.currentUserId) {
        if (!req?.currentUser?.id) {
          throw new BadRequestError(
            `Authentication required for user-based filtering. req.currentUser.id ${req.currentUser.id}`
          );
        }
        const userId = req.currentUser.id;
        console.log("Current User ID:", userId);

        // ✅ Filter by user ID who created the recipe
        filters.userId = userId;
      }

      // ✅ Search by ingredient name
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

      // ✅ Search by ingredient ID
      if (query.ingredientId) {
        filters.ingredients = {
          some: {
            ingredientId: parseInt(query.ingredientId as string, 10),
          },
        };
      }

      // ✅ Search by category via `RecipeIngredient`
      if (query.category) {
        filters.ingredients = {
          some: {
            ingredient: {
              category: {
                contains: query.category as string,
                mode: "insensitive",
              },
            },
          },
        };
      }

      // ✅ Search by slug
      if (query.slug) {
        filters.slug = {
          contains: query.slug as string,
          mode: "insensitive",
        };
      }

      console.log("Generated Prisma Filters:", filters);

      // ✅ Fetch recipes based on filtered ingredients
      const recipes = await prisma.recipe.findMany({
        where: filters,
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
        },
        take: 20, // Limit results
      });

      return recipes;
    } catch (error: any) {
      console.error("Error searching recipes:", error);

      // ✅ Handle known Prisma errors gracefully
      if (error.code === "P2025") {
        throw new BadRequestError("No matching recipes found.");
      }

      // ✅ Fallback to generic error
      throw new BadRequestError(`Search failed: ${error.message}`);
    }
  }
}

export default new RecipeSearchService();
