import { prisma } from "../utils/prisma";

class RecipeViewsService {
  constructor() {}

  async incrementRecipeView(recipeId: number, userId?: string) {
    try {
      //   Avoid duplicate views from the same user in a short time
      const recentView = await prisma.recipeView.findFirst({
        where: {
          recipeId,
          userId: userId || null,
          viewedAt: {
            gte: new Date(Date.now() - 1000 * 60 * 60), // Avoid duplicate views within 1 hour
          },
        },
      });
      if (!recentView) {
        await prisma.recipeView.create({
          data: {
            recipeId,
            userId: userId || null,
          },
        });
      }
    } catch (error) {
      console.error("Error updating recipe view:", error);
    }
  }

  async getRecipeViews(recipeId: number): Promise<number> {
    return await prisma.recipeView.count({
      where: { recipeId },
    });
  }
}

const recipeViewsService = new RecipeViewsService();
export default recipeViewsService;
