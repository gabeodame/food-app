"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recipe_controller_1 = __importDefault(require("../controllers/recipe.controller"));
const recipe_ingredient_controller_1 = __importDefault(require("../controllers/recipe.ingredient.controller"));
const recipe_search_controller_1 = __importDefault(require("../controllers/recipe.search.controller"));
const validate_dto_1 = require("../middlewares/validate-dto");
const common_1 = require("@gogittix/common");
const dtos_1 = require("../dtos");
const recipe_favorite_controller_1 = __importDefault(require("../controllers/recipe.favorite.controller"));
const recipe_views_controller_1 = __importDefault(require("../controllers/recipe.views.controller"));
const router = (0, express_1.Router)();
// TODO: Separate routes into separate files
//  General recipe listing (Most generic)
router.get("/", recipe_controller_1.default.getAllRecipes);
// Search routes (Placed before dynamic `/:id`)
router.get("/ingredient/search", common_1.validateRequest, recipe_ingredient_controller_1.default.searchIngredients);
router.get("/:id/favorite", common_1.requireAuth, recipe_favorite_controller_1.default.getFavoriteStatus // ✅ Check favorite status
);
router.post("/:id/favorite", common_1.requireAuth, recipe_favorite_controller_1.default.favoriteRecipe // ✅ Add to favorites
);
router.delete("/:id/favorite", common_1.requireAuth, recipe_favorite_controller_1.default.unfavoriteRecipe // ✅ Remove from favorites
);
// router.get("/search", validateRequest, recipeSearchService.searchBySlug);
router.get("/search", common_1.validateRequest, recipe_search_controller_1.default.search);
// router.get("/search/related", recipeSearchService.getRelatedRecipes);
router.get("/search/related", recipe_search_controller_1.default.getRelatedRecipes);
// Increment recipe view count
router.post("/:id/views", common_1.validateRequest, recipe_views_controller_1.default.incrementRecipeView);
// Get recipe by ID (Dynamic route `/:id` should come after static routes)
router.get("/:id", recipe_controller_1.default.getRecipeById);
//Create recipe
router.post("/", common_1.requireAuth, (0, validate_dto_1.validateDto)(dtos_1.CreateRecipeDto), common_1.validateRequest, recipe_controller_1.default.createRecipe);
// Update recipe
router.patch("/:id", common_1.requireAuth, (0, validate_dto_1.validateDto)(dtos_1.UpdateRecipeDto), common_1.validateRequest, recipe_controller_1.default.updateRecipe);
// Delete recipe
router.delete("/:id", common_1.requireAuth, common_1.validateRequest, recipe_controller_1.default.deleteRecipe);
exports.default = router;
