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

class RecipeService {
  async getAllRecipes(): Promise<Recipe[]> {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        cuisineTypes: { include: { cuisineType: true } },
        seasons: { include: { season: true } },
        specialDiets: { include: { specialDiet: true } },
      },
    });

    return recipes.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.map((ri) => ({
        id: ri.ingredient.id,
        name: ri.ingredient.name,
        category: ri.ingredient.category,
        unit: ri.ingredient?.unit || "", // ✅ Correctly retrieve the unit from `RecipeIngredient`
        quantity: ri.quantity,
        recipeId: recipe.id,
      })),
      categories: recipe.categories.map((cat) => ({
        id: cat.category.id,
        name: cat.category.name,
      })),
    }));
  }

  async getRecipeById(id: number): Promise<Partial<FoodItemProps>> {
    const recipe = await prisma.recipe.findFirstOrThrow({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true, // Join RecipeIngredient with Ingredient
          },
        },
        instructions: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        cuisineTypes: { include: { cuisineType: true } },
        seasons: { include: { season: true } },
        specialDiets: { include: { specialDiet: true } },
      },
    });

    return {
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      description: recipe.description,
      userId: recipe.userId,
      ingredients: recipe.ingredients.map((ri) => ({
        id: ri.ingredient.id,
        name: ri.ingredient.name,
        category: ri.ingredient.category,
        unit: ri.ingredient?.unit || "",
        quantity: ri.quantity,
        recipeId: recipe.id, // Include the recipeId explicitly
      })),
      instructions: recipe.instructions.map((instruction) => ({
        id: instruction.id,
        step: instruction.step,
      })),
      categories: recipe.categories.map((cat) => ({
        id: cat.category.id,
        name: cat.category.name,
      })),
    };
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

  async updateRecipe(id: number, req: Request): Promise<Recipe | undefined> {
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

    if (!recipe) {
      throw new NotFoundError();
    }

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
      });

      return updatedRecipe;
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
