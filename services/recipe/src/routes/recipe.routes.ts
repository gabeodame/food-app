import { Router } from "express";
import recipeController from "../controllers/recipe.controller";
import searchController from "../controllers/recipe.search.controller";
import { validateDto } from "../middlewares/validate-dto";
import { requireAuth, validateRequest } from "@gogittix/common";
import { CreateRecipeDto, UpdateRecipeDto } from "../dtos";

const router = Router();

router.get("/", recipeController.getAllRecipes);
router.get("/search", validateRequest, searchController.search);
router.get("/:id", recipeController.getRecipeById);
router.post(
  "/",
  requireAuth,
  validateDto(CreateRecipeDto),
  validateRequest,
  recipeController.createRecipe
);
router.patch(
  "/:id",
  requireAuth,
  validateDto(UpdateRecipeDto),
  validateRequest,
  recipeController.updateRecipe
);
router.delete(
  "/:id",
  requireAuth,
  validateRequest,
  recipeController.deleteRecipe
);

export default router;
