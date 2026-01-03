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
const recipe_service_1 = __importDefault(require("../../src/services/recipe.service"));
class RecipeController {
    /**
     * @swagger
     * /:
     *   get:
     *     summary: Retrieve all recipes
     *     tags: [Recipes]
     *     responses:
     *       200:
     *         description: Successfully retrieved recipes.
     *       404:
     *        description: No recipes found.
     *       500:
     *         description: Internal server error.
     */
    getAllRecipes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Getting all recipes");
            const recipes = yield recipe_service_1.default.getAllRecipes(req);
            res.status(200).json(recipes);
        });
    }
    /**
     * @swagger
     * /{id}:
     *   get:
     *     summary: Retrieve a recipe by ID
     *     tags: [Recipes]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the recipe
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Successfully retrieved recipe.
     *       404:
     *         description: Recipe not found.
     */
    getRecipeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const recipe = yield recipe_service_1.default.getRecipeById(Number(id), req);
            if (!recipe)
                return res.status(404).json({ message: "Recipe not found" });
            res.status(200).json(recipe);
        });
    }
    /**
     * @swagger
     * /:
     *   post:
     *     summary: Create a new recipe
     *     tags: [Recipes]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateRecipeDto'
     *     responses:
     *       201:
     *         description: Recipe successfully created.
     *       400:
     *         description: Bad request.
     *       401:
     *         description: Unauthorized.
     */
    createRecipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRecipe = yield recipe_service_1.default.createRecipe(req);
            res.status(201).json(newRecipe);
        });
    }
    /**
     * @swagger
     * /{id}:
     *   patch:
     *     summary: Update an existing recipe
     *     tags: [Recipes]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the recipe to update
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateRecipeDto'
     *     responses:
     *       200:
     *         description: Recipe successfully updated.
     *       400:
     *         description: Bad request.
     *       401:
     *         description: Unauthorized.
     */
    updateRecipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedRecipe = yield recipe_service_1.default.updateRecipe(req);
            if (!updatedRecipe)
                return res.status(404).json({ message: "Recipe not found" });
            res.json(updatedRecipe);
        });
    }
    /**
     * @swagger
     * /{id}:
     *   delete:
     *     summary: Delete a recipe
     *     tags: [Recipes]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the recipe to delete
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Recipe successfully deleted.
     *       404:
     *         description: Recipe not found.
     */
    deleteRecipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const deleted = yield recipe_service_1.default.deleteRecipe(Number(id), req);
            if (!deleted)
                return res.status(404).json({ message: "Recipe not found" });
            res.status(204).send({ deleted });
        });
    }
}
exports.default = new RecipeController();
