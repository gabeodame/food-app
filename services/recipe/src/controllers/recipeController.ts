import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { body } from "express-validator";
import { NotAuthorizedError, DatabaseConnectionError } from "@gogittix/common";

class RecipeController {
  // Business logic to fetch all recipes

  async getAllRecipes() {
    const recipes = await prisma.recipe.findMany();
    return recipes;
  }

  // Business logic to fetch a recipe by ID
  async getRecipeById(id: number) {
    const recipe = await prisma.recipe.findUniqueOrThrow({
      where: { id },
      include: {
        ingredients: true,
        instructions: true,
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
    });
    return recipe;
  }

  // Business logic to create a new recipe
  async createRecipe(req: Request) {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }

    const { title, description, imageUrl, ingredients, instructions } =
      req.body;

    const newRecipe = await prisma.recipe.create({
      data: {
        userId: req.currentUser.id,
        title,
        description,
        imageUrl,
        ingredients: {
          create: ingredients, // Assuming ingredients is an array of objects
        },
        instructions: {
          create: instructions, // Assuming instructions is an array of objects
        },
      },
    });

    return newRecipe;
  }
  // Business logic to update a recipe
  async updateRecipe(id: number, req: Request) {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }

    const { title, description, imageUrl, ingredients, instructions } =
      req.body;

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        ingredients: {
          // Handle updating ingredients appropriately
        },
        instructions: {
          // Handle updating instructions appropriately
        },
      },
    });

    return updatedRecipe;
  }

  // Additional methods like  deleteRecipe can be added similarly
}

// Export an instance of the RecipeController
export const recipeController = new RecipeController();
