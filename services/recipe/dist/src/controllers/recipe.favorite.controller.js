"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recipe_favorite_service_1 = __importDefault(require("../services/recipe.favorite.service"));
class RecipeFavoriteController {
    /**
     * @swagger
     * /{id}/favorite:
     *   get:
     *     summary: Get favorite status of a recipe by ID
     *     tags:
     *       - Recipes
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the recipe
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Successfully fetched favorite status.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 isFavoritedByCurrentUser:
     *                   type: boolean
     *                   description: Indicates if the current user has favorited the recipe.
     *       400:
     *         description: Invalid request. Recipe ID must be an integer.
     *       401:
     *         description: Unauthorized request. User is not authenticated.
     *       404:
     *         description: Recipe not found.
     */
    getFavoriteStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const recipeId = parseInt(id, 10);
                if (isNaN(recipeId)) {
                    return res.status(400).json({ error: "Invalid recipe ID" });
                }
                if (!req.currentUser) {
                    return res.status(401).json({ error: "Unauthorized request" });
                }
                //   ✅ Call the service to check favorite status
                const favoriteStatus = yield recipe_favorite_service_1.default.getFavoriteStatus(req.currentUser.id, recipeId);
                res.status(200).json({ isFavoritedByCurrentUser: favoriteStatus });
            }
            catch (error) {
                console.error("Error getting favorite status:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /{id}/favorite:
     *     post:
     *       summary: Favorite a recipe by ID
     *       tags:
     *         - Recipes
     *       parameters:
     *         - in: path
     *           name: id
     *           required: true
     *           description: ID of the recipe
     *           schema:
     *             type: integer
     *       responses:
     *         200:
     *           description: Successfully favorited recipe.
     *         400:
     *           description: Invalid request. Missing recipe ID.
     *         401:
     *           description: Unauthorized request. User is not authenticated.
     */
    favoriteRecipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const recipeId = parseInt(id, 10);
                if (isNaN(recipeId)) {
                    return res.status(400).json({ error: "Invalid recipe ID" });
                }
                if (!req.currentUser) {
                    return res.status(401).json({ error: "Unauthorized request" });
                }
                const recipe = yield recipe_favorite_service_1.default.favoriteRecipe(req.currentUser.id, recipeId);
                if (!recipe) {
                    return res.status(404).json({ error: "Recipe not found" });
                }
                res.status(200).json(recipe);
            }
            catch (error) {
                console.error("Error favoriting recipe:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /{id}/favorite:
     *     delete:
     *       summary: Unfavorite a recipe by ID
     *       tags:
     *         - Recipes
     *       parameters:
     *         - in: path
     *           name: id
     *           required: true
     *           description: ID of the recipe
     *           schema:
     *             type: integer
     *       responses:
     *         200:
     *           description: Successfully unfavorited recipe.
     *         400:
     *           description: Invalid request. Missing recipe ID.
     *         401:
     *           description: Unauthorized request. User is not authenticated.
     */
    unfavoriteRecipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const recipeId = parseInt(id, 10);
                if (isNaN(recipeId)) {
                    return res.status(400).json({ error: "Invalid recipe ID" });
                }
                if (!req.currentUser) {
                    return res.status(401).json({ error: "Unauthorized request" });
                }
                const recipe = yield recipe_favorite_service_1.default.unfavoriteRecipe(req.currentUser.id, recipeId);
                if (!recipe) {
                    return res
                        .status(404)
                        .json({ error: "Recipe not found or not favorited" });
                }
                res
                    .status(200)
                    .json({ message: "Recipe unfavorited successfully", recipe });
            }
            catch (error) {
                console.error("Error unfavoriting recipe:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
const recipeFavoriteController = new RecipeFavoriteController();
exports.default = recipeFavoriteController;
