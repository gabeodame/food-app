import { Ingredient } from "@prisma/client";
import recipeService from "./recipe.service";
import { prisma } from "../utils/prisma";
import { BadRequestError, NotAuthorizedError } from "@gogittix/common";
import { Recipe } from "../dtos";

class RecipeFavoriteService {
  private recipeService: any;
  constructor() {
    this.recipeService = recipeService;
  }

  async getFavoriteStatus(userId: string, recipeId: number): Promise<boolean> {
    try {
      const favorite = await prisma.favorite.findFirst({
        where: { userId, recipeId },
      });

      return !!favorite; // Convert to boolean
    } catch (error) {
      console.error("Error fetching favorite status:", error);
      throw new BadRequestError("Error fetching favorite status");
    }
  }

  async favoriteRecipe(userId: string, recipeId: number): Promise<boolean> {
    try {
      const existingFavorite = await prisma.favorite.findFirst({
        where: { userId, recipeId },
      });

      if (!existingFavorite) {
        await prisma.favorite.create({
          data: { userId, recipeId },
        });

        await prisma.recipe.update({
          where: { id: recipeId },
          data: { favoritesCount: { increment: 1 } },
        });
      }

      return true;
    } catch (error) {
      console.error("Error favoriting recipe:", error);
      throw new BadRequestError("Error favoriting recipe");
    }
  }

  async unfavoriteRecipe(userId: string, recipeId: number): Promise<boolean> {
    try {
      const existingFavorite = await prisma.favorite.findFirst({
        where: { userId, recipeId },
      });

      if (!existingFavorite) {
        throw new BadRequestError("Recipe is not favorited.");
      }

      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });

      await prisma.recipe.update({
        where: { id: recipeId },
        data: { favoritesCount: { decrement: 1 } },
      });

      return false; // Ensure consistent return type
    } catch (error) {
      console.error("Error unfavoriting recipe:", error);
      throw new BadRequestError("Error unfavoriting recipe");
    }
  }
}

const recipeFavoriteService = new RecipeFavoriteService();
export default recipeFavoriteService;
