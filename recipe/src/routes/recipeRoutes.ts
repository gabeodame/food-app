import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";

import { requireAuth, validateRequest } from "@gogittix/common"; // Adjust import path accordingly
import { recipeController } from "../controllers/RecipeController";

const router = Router();

// Route to fetch all recipes
router.get(
  "/api/1/recipes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipes = await recipeController.getAllRecipes();
      res.status(200).json({ data: recipes });
    } catch (error) {
      next(error);
    }
  }
);

// Route to fetch a recipe by ID
router.get(
  "/api/1/recipes/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const recipe = await recipeController.getRecipeById(id);
      res.status(200).json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }
);

// Validation rules for creating a recipe
const validateCreateRecipe = [
  body("title").notEmpty().withMessage("Please enter a recipe title"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("imageUrl").notEmpty().withMessage("Please provide an image"),
  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Ingredients are required"),
  body("ingredients.*.name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Ingredient name must be at least 2 characters"),
  body("instructions")
    .isArray({ min: 1 })
    .withMessage("Instructions are required"),
  body("instructions.*.step")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Instruction step must be at least 5 characters"),
];

// Route to create a new recipe
router.post(
  "/api/1/recipes",
  requireAuth,
  validateCreateRecipe,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newRecipe = await recipeController.createRecipe(req);
      res.status(201).json({ data: newRecipe });
    } catch (error) {
      next(error);
    }
  }
);

// Validation rules for updating a recipe
const validateUpdateRecipe = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  // Add more validation rules as needed
];

// Route to update a recipe
router.put(
  "/api/1/recipes/:id",
  requireAuth,
  validateUpdateRecipe,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedRecipe = await recipeController.updateRecipe(id, req);
      res.status(200).json({ data: updatedRecipe });
    } catch (error) {
      next(error);
    }
  }
);

// Export the router
export { router as recipeRoutes };
