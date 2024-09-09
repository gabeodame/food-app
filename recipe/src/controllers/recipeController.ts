import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { body } from "express-validator";
import { NotAuthorizedError, DatabaseConnectionError } from "@gogittix/common";

class RecipeController {
  // Method to fetch all recipes
  async getAllRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const recipes = await prisma.recipe.findMany();
      res.status(200).json({ data: recipes });
    } catch (error) {
      next(error);
    }
  }

  // Method to fetch a single recipe by ID
  async getRecipeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id, 10);

      const recipe = await prisma.recipe.findUniqueOrThrow({
        where: { id: recipeId },
        include: {
          ingredients: true,
          instructions: true,
          tags: { include: { tag: true } },
          categories: { include: { category: true } },
        },
      });

      res.status(200).json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }

  // Method to create a new recipe
  async createRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, imageUrl, ingredients, instructions } =
        req.body;

      // Check if the user is authenticated
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      // Create a new recipe
      const recipe = await prisma.recipe.create({
        data: {
          userId: req.currentUser.id,
          title,
          description,
          imageUrl,
          ingredients,
          instructions,
        },
      });

      res.status(201).json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }
}

// Validation rules for the createRecipe method
export const validateCreateRecipe = [
  body("title").not().isEmpty().withMessage("Please enter a recipe title"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("imageUrl").not().isEmpty().withMessage("Please provide an image"),
  body("ingredients.*.name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Ingredient name must be at least 2 characters"),
  body("instructions.*.step")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Instruction step must be at least 5 characters"),
];

// Export an instance of the RecipeController
export const recipeController = new RecipeController();
