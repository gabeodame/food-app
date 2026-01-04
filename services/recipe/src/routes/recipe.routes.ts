import { Router } from "express";
import recipeController from "../controllers/recipe.controller";
import recipeIngredientController from "../controllers/recipe.ingredient.controller";
import recipeSearchController from "../controllers/recipe.search.controller";

import { validateDto } from "../middlewares/validate-dto";
import { requireAuth, validateRequest } from "@gogittix/common";
import { CreateRecipeDto, UpdateRecipeDto } from "../dtos";
import recipeFavoriteController from "../controllers/recipe.favorite.controller";
import recipeViewController from "../controllers/recipe.views.controller";

const router = Router();
// TODO: Separate routes into separate files
//  General recipe listing (Most generic)
router.get("/", recipeController.getAllRecipes);

// Search routes (Placed before dynamic `/:id`)
router.get(
  "/ingredient/search",
  validateRequest,
  recipeIngredientController.searchIngredients
);

router.get(
  "/:id/favorite",
  requireAuth,
  recipeFavoriteController.getFavoriteStatus // ✅ Check favorite status
);

router.post(
  "/:id/favorite",
  requireAuth,
  recipeFavoriteController.favoriteRecipe // ✅ Add to favorites
);

router.delete(
  "/:id/favorite",
  requireAuth,
  recipeFavoriteController.unfavoriteRecipe // ✅ Remove from favorites
);

// router.get("/search", validateRequest, recipeSearchService.searchBySlug);
router.get("/search", validateRequest, recipeSearchController.search);

// router.get("/search/related", recipeSearchService.getRelatedRecipes);
router.get("/search/related", recipeSearchController.getRelatedRecipes);

// Increment recipe view count
router.post(
  "/:id/views",
  validateRequest,
  recipeViewController.incrementRecipeView
);

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
