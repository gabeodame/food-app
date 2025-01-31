import { Router } from "express";
import recipeController from "../controllers/recipe.controller";
import recipeIngredientController from "../controllers/recipe.ingredient.controller";
import recipeSearchController from "../controllers/recipe.search.controller";
import { validateDto } from "../middlewares/validate-dto";
import { requireAuth, validateRequest } from "@gogittix/common";
import { CreateRecipeDto, UpdateRecipeDto } from "../dtos";

const router = Router();

//  General recipe listing (Most generic)
router.get("/", recipeController.getAllRecipes);

// Search routes (Placed before dynamic `/:id`)
router.get(
  "/ingredient/search",
  validateRequest,
  recipeIngredientController.searchIngredients
);
// router.get("/search", validateRequest, recipeSearchService.searchBySlug);
router.get("/search", validateRequest, recipeSearchController.search);

// Get recipe by ID (Dynamic route `/:id` should come after static routes)
router.get("/:id", recipeController.getRecipeById);

//Create recipe
router.post(
  "/",
  requireAuth,
  validateDto(CreateRecipeDto),
  validateRequest,
  recipeController.createRecipe
);

// Update recipe
router.patch(
  "/:id",
  requireAuth,
  validateDto(UpdateRecipeDto),
  validateRequest,
  recipeController.updateRecipe
);

// Delete recipe
router.delete(
  "/:id",
  requireAuth,
  validateRequest,
  recipeController.deleteRecipe
);

export default router;
