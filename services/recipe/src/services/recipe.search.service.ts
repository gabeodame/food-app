import { BadRequestError } from "@gogittix/common";
import { prisma } from "../utils/prisma";

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
}

export default new RecipeSearchService();
