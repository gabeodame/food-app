import { Request, Response } from "express";
import recipeSearchService from "../services/recipe.search.service";
import { BadRequestError } from "@gogittix/common";

class RecipeSearchController {
  /**
   * @swagger
   * /search:
   *   get:
   *     summary: Search for recipes by multiple filters (slug, category, userId, ingredientName, ingredientId)
   *     tags: [Recipes/Search]
   *     parameters:
   *       - in: query
   *         name: slug
   *         schema:
   *           type: string
   *         required: false
   *         description: Partial match for recipe title
   *       - in: query
   *         name: ingredientName
   *         schema:
   *           type: string
   *         required: false
   *         description: Partial match for ingredient name
   *       - in: query
   *         name: ingredientId
   *         schema:
   *           type: integer
   *         required: false
   *         description: Exact match for ingredient ID
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         required: false
   *         description: The category of the ingredient (e.g., "Vegetable", "Dairy", "Meat")
   *       - in: query
   *         name: userId
   *         schema:
   *           type: string
   *         required: false
   *         description: ID of the user who created the recipe
   *     responses:
   *       200:
   *         description: Successfully retrieved matching recipes with ingredients.
   *       400:
   *         description: Invalid request. Missing search term or invalid parameters.
   *       404:
   *         description: No recipes found matching the query.
   *       500:
   *         description: Internal server error.
   */
  async search(req: Request, res: Response) {
    try {
      const filters = req.query as Record<string, string | string[]>;

      console.log("Search route reached with filters:", filters);

      // Ensure at least one valid filter is provided
      if (
        !filters.slug &&
        !filters.ingredientName &&
        !filters.ingredientId &&
        !filters.category &&
        !filters.userId &&
        !filters.currentUserId
      ) {
        return res
          .status(400)
          .json({ message: "At least one search parameter is required." });
      }

      const recipes = await recipeSearchService.searchBySlug(filters, req);

      if (!recipes.length) {
        return res.status(404).json({ message: "No recipes found." });
      }

      res.status(200).json(recipes);
    } catch (error: any) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes." });
    }
  }

  /**
   * @swagger
   * /search/related:
   *   get:
   *     summary: Find related recipes based on an ingredient
   *     tags: [Recipes/Search]
   *     parameters:
   *       - in: query
   *         name: ingredientId
   *         schema:
   *           type: integer
   *         required: false
   *         description: Find recipes using this ingredient ID
   *       - in: query
   *         name: ingredientName
   *         schema:
   *           type: string
   *         required: false
   *         description: Find recipes using this ingredient name
   *     responses:
   *       200:
   *         description: Successfully retrieved related recipes with nutrition.
   *       400:
   *         description: Invalid request. Missing search term or invalid parameters.
   *       404:
   *         description: No related recipes found.
   *       500:
   *         description: Internal server error.
   */
  async getRelatedRecipes(req: Request, res: Response) {
    try {
      const { ingredientId, ingredientName } = req.query;

      // Validate query params
      if (!ingredientId && !ingredientName) {
        return res
          .status(400)
          .json({ message: "Ingredient ID or Name is required." });
      }

      const recipes = await recipeSearchService.getRecipesWithIngredient(
        ingredientId ? parseInt(ingredientId as string, 10) : undefined,
        ingredientName as string
      );

      if (!recipes.length) {
        return res.status(404).json({ message: "No related recipes found." });
      }

      res.status(200).json(recipes);
    } catch (error: any) {
      console.error("Error fetching related recipes:", error);
      res.status(500).json({ message: "Failed to fetch related recipes." });
    }
  }
}

export default new RecipeSearchController();
