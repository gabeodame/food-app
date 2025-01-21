import { prisma } from "../utils/prisma";
import { BadRequestError } from "@gogittix/common";

class RecipeSearchService {
  async search(query: Record<string, string | string[]>) {
    console.log("Received filters for search:", query);

    // Dynamically build Prisma `where` clause using built-in filtering
    const where: Record<string, any> = {};

    if (query.ingredientName) {
      where.ingredients = {
        some: {
          name: {
            contains: query.ingredientName as string,
            mode: "insensitive",
          },
        },
      };
    }

    if (query.ingredientId) {
      where.ingredients = {
        some: {
          ingredientId: parseInt(query.ingredientId as string, 10),
        },
      };
    }

    if (query.category) {
      where.categories = {
        some: {
          category: {
            name: { contains: query.category as string, mode: "insensitive" },
          },
        },
      };
    }

    if (query.slug) {
      where.slug = query.slug as string;
    }

    if (Object.keys(where).length === 0) {
      throw new BadRequestError("No valid filters provided in the query.");
    }

    return prisma.recipe.findMany({
      where,
      include: {
        ingredients: true,
        categories: true,
      },
    });
  }
}

export default new RecipeSearchService();
