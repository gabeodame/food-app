import { Router } from "express";
import recipeController from "../controllers/recipe.controller";
import {
  validateCreateRecipe,
  validateUpdateRecipe,
} from "../middlewares/class.validator";
import { requireAuth, validateRequest } from "@gogittix/common";

const router = Router();

router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);
router.post(
  "/",
  requireAuth,
  validateCreateRecipe,
  validateRequest,
  recipeController.createRecipe
);
router.patch(
  "/:id",
  requireAuth,
  validateUpdateRecipe,
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
