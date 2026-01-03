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
const recipe_views_service_1 = __importDefault(require("../services/recipe.views.service"));
class RecipeViewsController {
    /**
     * @swagger
     * /{id}/views:
     *   post:
     *     summary: Increment the view count of a recipe
     *     description: Increments the view count for a recipe when accessed. Tracks views per user.
     *     tags:
     *       - Recipes
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The ID of the recipe to increment views for.
     *         schema:
     *           type: integer
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       204:
     *         description: Successfully incremented recipe view count.
     *       400:
     *         description: Invalid recipe ID.
     *       401:
     *         description: Unauthorized request. User is not authenticated.
     *       500:
     *         description: Internal Server Error.
     */
    incrementRecipeView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const recipeId = parseInt(id, 10);
                const userId = ((_a = req === null || req === void 0 ? void 0 : req.currentUser) === null || _a === void 0 ? void 0 : _a.id) || "0";
                if (isNaN(recipeId)) {
                    return res.status(400).json({ error: "Invalid recipe ID" });
                }
                yield recipe_views_service_1.default.incrementRecipeView(recipeId, userId);
                res.status(204).send();
            }
            catch (error) {
                console.error("Error incrementing recipe view:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
const recipeViewController = new RecipeViewsController();
exports.default = recipeViewController;
