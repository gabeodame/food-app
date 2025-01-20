import { BadRequestError } from "@gogittix/common";
import { prisma } from "../utils/prisma";

class RecipeSearchService {
  async search(query: Record<string, string | string[]>) {
    const filters: Record<string, any> = {};

    // Map query parameters to Prisma filters dynamically
    if (query.ingredientName) {
      filters.ingredients = {
        some: {
          name: {
            contains: query.ingredientName as string,
            mode: "insensitive",
          },
        },
      };
    }

    if (query.ingredientId) {
      filters.ingredients = {
        some: {
          ingredientId: parseInt(query.ingredientId as string, 10),
        },
      };
    }

    if (query.category) {
      filters.categories = {
        some: {
          category: {
            name: {
              contains: query.category as string,
              mode: "insensitive",
            },
          },
        },
      };
    }

    if (query.slug) {
      filters.slug = query.slug as string;
    }

    // Throw an error if no valid filters were constructed
    if (Object.keys(filters).length === 0) {
      throw new BadRequestError(
        "Invalid search query. No valid filters provided."
      );
    }

    // Execute the query with dynamic filters
    return prisma.recipe.findMany({
      where: filters,
      include: {
        ingredients: true,
        categories: true,
      },
    });
  }
}

export default new RecipeSearchService();
