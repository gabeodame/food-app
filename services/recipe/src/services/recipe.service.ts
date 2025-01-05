import { FoodItemProps } from "../entities/recipe.entity";
import { CreateRecipeDto, Recipe, UpdateRecipeDto } from "../dtos";
import { prisma } from "../utils/prisma";
import { Request } from "express";
import { NotAuthorizedError, NotFoundError } from "@gogittix/common";

class RecipeService {
  // private recipes: FoodItemProps[] = [];

  async getAllRecipes(): Promise<Recipe[]> {
    const recipes = await prisma.recipe.findMany();
    return recipes;
  }

  async getRecipeById(id: number): Promise<Partial<FoodItemProps>> {
    const recipe = await prisma.recipe.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        description: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        ingredients: {
          select: {
            id: true,
            name: true,
            quantity: true,
            recipeId: true,
          },
        },
        instructions: {
          select: {
            id: true,
            step: true,
            recipeId: true,
          },
        },
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        cuisineTypes: {
          select: {
            cuisineType: {
              select: {
                name: true,
              },
            },
          },
        },
        seasons: {
          select: {
            season: {
              select: {
                name: true,
              },
            },
          },
        },
        specialDiets: {
          select: {
            specialDiet: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      description: recipe.description,
      userId: recipe.userId,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      categories: recipe.categories.map((cat) => cat.category),
      tags: recipe.tags.map((tag) => tag.tag),
      cuisineTypes: recipe.cuisineTypes.map((ct) => ({
        name: ct.cuisineType.name,
      })),
      seasonalEvent: recipe.seasons.map((season) => ({
        name: season.season.name,
      })),
      specialDiets: recipe.specialDiets.map((diet) => ({
        name: diet.specialDiet.name,
      })),
    };
  }

  async createRecipe(req: Request): Promise<Recipe | undefined> {
    console.log(req.currentUser);

    if (!req.currentUser) throw new NotAuthorizedError();

    try {
      const { title, description, imageUrl, ingredients, instructions } =
        req.body as CreateRecipeDto;

      const newRecipe = await prisma.recipe.create({
        data: {
          userId: req.currentUser.id,
          title,
          description,
          imageUrl,
          ingredients: {
            create: ingredients,
          },
          instructions: {
            create: instructions,
          },
          createdAt: new Date(),
        },
      });
      // Send message to RabbitMQ
      return newRecipe;
    } catch (error: any) {
      throw new Error(`Error creating recipe: ${error.message}`);
    }
  }

  async updateRecipe(id: number, req: Request): Promise<Recipe | undefined> {
    console.log(req.currentUser);
    if (!req.currentUser) throw new NotAuthorizedError();

    if (!req.body) throw new Error("Request body is required");

    const { title, description, imageUrl, ingredients, instructions } =
      req.body as UpdateRecipeDto;

    const recipe = await prisma.recipe.findFirstOrThrow({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!recipe) {
      throw new NotFoundError();
    }

    if (recipe.userId !== req.currentUser.id) {
      throw new NotAuthorizedError();
    }

    try {
      const recipe = await prisma.recipe.update({
        where: { id },
        data: {
          title,
          description,
          imageUrl,
          ingredients: {
            deleteMany: {},
            create: ingredients,
          },
          instructions: {
            deleteMany: {},
            create: instructions,
          },
          updatedAt: new Date(),
        },
      });
      return recipe;
    } catch (error: any) {
      throw new Error(`Error updating recipe: ${error.message}`);
    }
  }

  async deleteRecipe(
    id: number
  ): Promise<{ message: string; data: Partial<FoodItemProps> }> {
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
