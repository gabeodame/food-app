import { Router } from "express";
import {
  recipeController,
  validateCreateRecipe,
} from "../controllers/recipeController";
import { requireAuth, validateRequest } from "@gogittix/common";

const router = Router();

// Define routes and point to the controller functions
router.get(
  "/api/1/recipes",
  recipeController.getAllRecipes.bind(recipeController)
);
router.get(
  "/api/1/recipes/:id",
  recipeController.getRecipeById.bind(recipeController)
);

// Route for creating a new recipe
router.post(
  "/api/1/recipes",
  requireAuth, // Ensure user is authenticated
  validateCreateRecipe, // Validate the incoming request
  validateRequest, // Handle validation result
  recipeController.createRecipe.bind(recipeController) // Call the controller's method
);
export { router as recipeRoutes };
