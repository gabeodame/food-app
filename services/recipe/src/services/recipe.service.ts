import { FoodItemProps } from "../entities/recipe.entity";
import { CreateRecipeDto, Recipe, UpdateRecipeDto } from "../dtos";
import { prisma } from "../lib/prisma";
import { Request } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@gogittix/common";
import slugify from "slugify";
import { formatRecipeResponse } from "../utils/formatRecipeRespons";

class RecipeService {
  async createRecipe(req: Request) {
    if (!req?.currentUser) throw new NotAuthorizedError();

    console.log(req.body);

    const userId = req.currentUser.id;
    const {
      title,
      description,
      imageUrl,
      ingredients,
      instructions,
      categories,
      tags,
      cuisineTypes,
      seasonalEvent,
      specialDiets,
    } = req.body as CreateRecipeDto;
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
              unit: ingredient.unit || null,
            })),
          },
          instructions: {
            create: instructions.map((instruction) => ({
              step: instruction.step,
            })),
          },
          categories: {
            create: categories?.map((category) => ({
              category: {
                connectOrCreate: {
                  where: { name: category.name },
                  create: { name: category.name },
                },
              },
            })),
          },
          tags: {
            create: tags?.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag.name },
                  create: { name: tag.name },
                },
              },
            })),
          },
          cuisineTypes: {
            create: cuisineTypes?.map((cuisine) => ({
              cuisineType: {
                connectOrCreate: {
                  where: { name: cuisine.name }, // ✅ Now refers to CuisineType, which has a unique name
                  create: { name: cuisine.name },
                },
              },
            })),
          },

          seasons: {
            create: seasonalEvent?.map((season) => ({
              season: {
                connectOrCreate: {
                  where: { name: season.name },
                  create: { name: season.name },
                },
              },
            })),
          },
          specialDiets: {
            create: specialDiets?.map((diet) => ({
              specialDiet: {
                connectOrCreate: {
                  where: { name: diet.name },
                  create: { name: diet.name },
                },
              },
            })),
          },
          createdAt: new Date(),
        },
      });

      return newRecipe;
    } catch (error: any) {
      console.error("Error creating recipe:", error);
      return new BadRequestError(`Error creating recipe: ${error.message}`);
    }
  }

  async updateRecipe(
    req: Request
  ): Promise<
    (Partial<FoodItemProps> & { isFavoritedByCurrentUser: boolean }) | Error
  > {
    console.log("Update Request body:", req.body);
    const id = Number(req.params.id);
    if (!req.body) return new BadRequestError("Request body is required");
    const {
      title,
      description,
      imageUrl,
      ingredients,
      instructions,
      cuisineTypes,
      categories,
      seasonalEvent,
      specialDiets,
      tags,
    } = req.body as UpdateRecipeDto;

    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      console.log("Current User ID:", req.currentUser.id);

      const userId = req.currentUser.id;
      const slug = slugify(title!, { lower: true, strict: true });

      const recipe = await prisma.recipe.findFirstOrThrow({
        where: { id },
        select: {
          userId: true,
        },
      });

      if (recipe.userId !== userId) {
        throw new NotAuthorizedError();
      }

      const updatedRecipe = await prisma.recipe.update({
        where: { id },
        data: {
          title,
          slug,
          description,
          imageUrl,
          ingredients: {
            deleteMany: {}, // ✅ Remove old ingredient associations
            create: ingredients?.map((ingredient) => ({
              ingredient: { connect: { id: ingredient.id } }, // Always reconnect
              quantity: ingredient.quantity,
              unit: ingredient.unit || null,
            })),
          },
          instructions: {
            deleteMany: {}, // Remove all existing instructions
            create: instructions?.map((instruction) => ({
              step: instruction.step, // Only insert steps, let the DB handle the IDs
            })),
          },
          categories: {
            deleteMany: {}, // ✅ Remove existing category links
            create: categories?.map((category) => ({
              category: {
                connectOrCreate: {
                  where: { name: category.name }, // Only match by name
                  create: { name: category.name },
                },
              },
            })),
          },
          tags: {
            deleteMany: {}, // ✅ Remove existing tag links
            create: tags?.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag.name }, // Only match by name
                  create: { name: tag.name },
                },
              },
            })),
          },
          cuisineTypes: {
            deleteMany: {}, // ✅ Remove existing cuisine links
            create: cuisineTypes?.map((cuisine) => ({
              cuisineType: {
                connectOrCreate: {
                  where: { name: cuisine.name }, // Only match by name
                  create: { name: cuisine.name },
                },
              },
            })),
          },
          seasons: {
            deleteMany: {}, // ✅ Remove existing season links
            create: seasonalEvent?.map((season) => ({
              season: {
                connectOrCreate: {
                  where: { name: season.name }, // Only match by name
                  create: { name: season.name },
                },
              },
            })),
          },
          specialDiets: {
            deleteMany: {}, // ✅ Remove existing special diet links
            create: specialDiets?.map((diet) => ({
              specialDiet: {
                connectOrCreate: {
                  where: { name: diet.name }, // Only match by name
                  create: { name: diet.name },
                },
              },
            })),
          },
          updatedAt: new Date(),
        },
      });

      return formatRecipeResponse(updatedRecipe, userId);
    } catch (error: any) {
      console.error("Error updating recipe:", error);
      return new BadRequestError(`Error updating recipe: ${error.message}`);
    }
  }

  async getAllRecipes(req: any): Promise<Recipe[] | Error> {
    try {
      const currentUserId = req?.currentUser?.id || "0";
      console.log("Current User ID from recipe service:", currentUserId);

      const recipes = await prisma.recipe.findMany({
        include: {
          favoritedBy: { select: { userId: true } },
          views: true,
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
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
      }));
    } catch (error: any) {
      return new BadRequestError(`Error fetching recipes: ${error.message}`);
    }
  }

  async getRecipeById(
    id: number,
    req: any
  ): Promise<
    (Partial<FoodItemProps> & { isFavoritedByCurrentUser: boolean }) | Error
  > {
    let currentUserId = req?.currentUser?.id || "0";

    try {
      const recipe = await prisma.recipe.findFirstOrThrow({
        where: { id },
        include: {
          instructions: true,
          views: true,
          ingredients: { include: { ingredient: true } },
          favoritedBy: { select: { userId: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          cuisineTypes: { include: { cuisineType: true } },
          seasons: { include: { season: true } },
          specialDiets: { include: { specialDiet: true } },
        },
      });

      return formatRecipeResponse(recipe, currentUserId);
    } catch (error: any) {
      console.error("Error fetching recipe:", error);
      return new BadRequestError(`Error fetching recipe: ${error.message}`);
    }
  }

  async deleteRecipe(
    id: number,
    req: Request
  ): Promise<{ message: string; data: Partial<FoodItemProps> } | Error> {
    if (!req.currentUser) throw new NotAuthorizedError();

    try {
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
    } catch (error: any) {
      console.error("Error deleting recipe:", error);
      return new BadRequestError(`Error deleting recipe: ${error.message}`);
    }
  }
}

export default new RecipeService();
