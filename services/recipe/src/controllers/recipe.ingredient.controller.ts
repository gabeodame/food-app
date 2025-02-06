import { Request, Response } from "express";
import recipeIngredientService from "../services/recipe.ingredient.service";

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
  async searchIngredients(req: Request, res: Response) {
    try {
      const { query } = req;
      if (!query.slug) {
        return res.status(400).json({ message: "Search term is required." });
      }

      const ingredients = await recipeIngredientService.searchIngredients(
        query.slug as string
      );

      if (ingredients.length === 0) {
        return res.status(404).json({ message: "No ingredients found." });
      }

      res.status(200).json(ingredients);
    } catch (error: any) {
      console.error("Error fetching ingredients:", error);
      res.status(500).json({ message: "Failed to fetch ingredients." });
    }
  }
}

export default new RecipeIngredientController();
