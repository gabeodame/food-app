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
const recipe_ingredient_service_1 = __importDefault(require("../services/recipe.ingredient.service"));
/**
 * @swagger
 * /ingredient/search:
 *   get:
 *     summary: Search for ingredients by a partial match (slug-based)
 *     tags: [Recipes/Ingredients]
 *     parameters:
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The search term (partial match for ingredient name)
 *     responses:
 *       200:
 *         description: Successfully retrieved matching ingredients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Tomato"
 *                   category:
 *                     type: string
 *                     example: "Vegetable"
 *                   unit:
 *                     type: string
 *                     example: "grams"
 *       400:
 *         description: Invalid request. Missing search term.
 *       404:
 *         description: No ingredients found matching the query.
 *       500:
 *         description: Internal server error.
 */
class RecipeIngredientController {
    searchIngredients(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req;
                if (!query.slug) {
                    return res.status(400).json({ message: "Search term is required." });
                }
                const ingredients = yield recipe_ingredient_service_1.default.searchIngredients(query.slug);
                if (ingredients.length === 0) {
                    return res.status(404).json({ message: "No ingredients found." });
                }
                res.status(200).json(ingredients);
            }
            catch (error) {
                console.error("Error fetching ingredients:", error);
                res.status(500).json({ message: "Failed to fetch ingredients." });
            }
        });
    }
}
exports.default = new RecipeIngredientController();
