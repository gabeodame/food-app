import { Request, Response } from "express";
import { CreateRecipeDto } from "../dtos/recipe.dto";
import recipeService from "../../src/services/recipe.service";
import { BadRequestError } from "@gogittix/common";

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
class RecipeController {
  async getAllRecipes(req: Request, res: Response) {
    const recipes = await recipeService.getAllRecipes();
    res.status(200).json(recipes);
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
  async getRecipeById(req: Request, res: Response) {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(Number(id));
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
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
  async createRecipe(req: Request, res: Response) {
    const newRecipe = await recipeService.createRecipe(req);
    res.status(201).json(newRecipe);
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
  async updateRecipe(req: Request, res: Response) {
    const { id } = req.params;
    const updatedRecipe = await recipeService.updateRecipe(
      Number(id),
      req.body
    );
    if (!updatedRecipe)
      return res.status(404).json({ message: "Recipe not found" });
    res.json(updatedRecipe);
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
  async deleteRecipe(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = await recipeService.deleteRecipe(Number(id), req);
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    res.status(204).send({ deleted });
  }
}

export default new RecipeController();
