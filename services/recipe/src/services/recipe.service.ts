import { FoodItemProps } from "../entities/recipe.entity";
import { CreateRecipeDto, Recipe, UpdateRecipeDto } from "../dtos";
import { prisma } from "../utils/prisma";
import { Request } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@gogittix/common";
import slugify from "slugify";
import { formatRecipeResponse } from "../utils/formatRecipeRespons";

class RecipeService {
  async getAllRecipes(req: any): Promise<Recipe[]> {
    const currentUserId = req?.currentUser?.id || "0";

    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: { include: { ingredient: true } },
        favoritedBy: { select: { userId: true } },
        instructions: true,
        categories: { include: { category: true } },
        views: true,
        tags: { include: { tag: true } },
        cuisineTypes: { include: { cuisineType: true } },
        seasons: { include: { season: true } },
        specialDiets: { include: { specialDiet: true } },
      },
    });

    return recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      slug: recipe.slug,
      imageUrl: recipe.imageUrl,
      description: recipe.description,
      userId: recipe.userId,
      views: recipe.views.length,
      favoritesCount: recipe.favoritedBy.length,
      isFavoritedByCurrentUser: recipe.favoritedBy.some(
        (fav) => fav.userId === currentUserId
      ),
      ingredients: recipe.ingredients.map((ri) => ({
        id: ri.ingredient.id,
        name: ri.ingredient.name,
        category: ri.ingredient.category,
        unit: ri.ingredient?.unit || "",
        quantity: ri.quantity,
        recipeId: recipe.id,
      })),
      instructions: recipe.instructions.map((instruction) => ({
        id: instruction.id,
        step: instruction.step,
      })),
      categories: recipe.categories.map((cat) => ({
        id: cat.category.id,
        name: cat.category.name,
      })),
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    }));
  }

  async getRecipeById(
    id: number,
    req: any
  ): Promise<
    (Partial<FoodItemProps> & { isFavoritedByCurrentUser: boolean }) | undefined
  > {
    let currentUserId = req?.currentUser?.id || "0";

    try {
      const recipe = await prisma.recipe.findFirstOrThrow({
        where: { id },
        include: {
          ingredients: { include: { ingredient: true } },
          instructions: true,
          favoritedBy: { select: { userId: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          views: true,
          cuisineTypes: { include: { cuisineType: true } },
          seasons: { include: { season: true } },
          specialDiets: { include: { specialDiet: true } },
        },
      });

      return formatRecipeResponse(recipe, currentUserId);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      throw new NotFoundError();
    }
  }

  async createRecipe(req: Request) {
    if (!req?.currentUser) throw new NotAuthorizedError();

    console.log(req.body);

    const userId = req.currentUser.id;
    const { title, description, imageUrl, ingredients, instructions } =
      req.body as CreateRecipeDto;
    const slug = slugify(title, { lower: true, strict: true });

    try {
      const newRecipe = await prisma.recipe.create({
        data: {
          userId,
          title,
          slug,
          description,
          imageUrl,
          ingredients: {
            create: ingredients.map((ingredient) => ({
              ingredient: { connect: { id: ingredient.id } },
              quantity: ingredient.quantity,
            })),
          },
          instructions: {
            create: instructions,
          },
          createdAt: new Date(),
        },
      });

      return newRecipe;
    } catch (error: any) {
      console.error("Error creating recipe:", error);
      throw new BadRequestError(`Error creating recipe: ${error.message}`);
    }
  }

  async updateRecipe(
    id: number,
    req: Request
  ): Promise<
    (Partial<FoodItemProps> & { isFavoritedByCurrentUser: boolean }) | undefined
  > {
    if (!req.currentUser) throw new NotAuthorizedError();
    if (!req.body) throw new Error("Request body is required");

    const { title, description, imageUrl, ingredients, instructions } =
      req.body as UpdateRecipeDto;

    const userId = req.currentUser.id;

    const recipe = await prisma.recipe.findFirstOrThrow({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (recipe.userId !== userId) {
      throw new NotAuthorizedError();
    }

    try {
      const updatedRecipe = await prisma.recipe.update({
        where: { id },
        data: {
          title,
          description,
          imageUrl,
          ingredients: {
            deleteMany: {}, // Clear previous associations
            create: ingredients?.map((ingredient) => ({
              ingredient: { connect: { id: ingredient.id } },
              quantity: ingredient.quantity,
            })),
          },
          instructions: {
            deleteMany: {}, // Clear previous associations
            create: instructions,
          },
          updatedAt: new Date(),
        },
        include: {
          ingredients: { include: { ingredient: true } },
          instructions: true,
          favoritedBy: { select: { userId: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          cuisineTypes: { include: { cuisineType: true } },
          seasons: { include: { season: true } },
          specialDiets: { include: { specialDiet: true } },
          views: true, // ✅ Ensure views are included
        },
      });

      return formatRecipeResponse(updatedRecipe, userId);
    } catch (error: any) {
      console.error("Error updating recipe:", error);
      throw new BadRequestError(`Error updating recipe: ${error.message}`);
    }
  }

  async deleteRecipe(
    id: number,
    req: Request
  ): Promise<{ message: string; data: Partial<FoodItemProps> }> {
    if (!req.currentUser) throw new NotAuthorizedError();

    const userId = req.currentUser.id;

    const foundRecipe = await prisma.recipe.findFirstOrThrow({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!foundRecipe) {
      throw new NotFoundError();
    }

    if (foundRecipe.userId !== userId) {
      throw new NotAuthorizedError();
    }

    const recipe = await prisma.recipe.delete({
      where: { id },
    });

    return {
      message: "Recipe deleted successfully",
      data: recipe,
    };
  }
}

export default new RecipeService();
