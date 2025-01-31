import { Request, Response } from "express";
import recipeSearchService from "../services/recipe.search.service";

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for recipes by multiple filters (slug, category, userId, ingredientName, ingredientId)
 *     tags: [Recipes/Search]
 *     security:
 *       - BearerAuth: []  # Require authentication using JWT Bearer token
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
 *                   title:
 *                     type: string
 *                     example: "Spaghetti with Tomato Sauce"
 *                   slug:
 *                     type: string
 *                     example: "spaghetti-with-tomato-sauce"
 *                   imageUrl:
 *                     type: string
 *                     example: "https://example.com/image.jpg"
 *                   description:
 *                     type: string
 *                     example: "A delicious homemade spaghetti recipe."
 *                   userId:
 *                     type: string
 *                     example: "679821370de082af255f6fe8"
 *                   ingredients:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: "Tomato"
 *                         category:
 *                           type: string
 *                           example: "Vegetable"
 *                         unit:
 *                           type: string
 *                           example: "grams"
 *       400:
 *         description: Invalid request. Missing search term or invalid parameters.
 *       401:
 *         description: Unauthorized. Authentication required.
 *       404:
 *         description: No recipes found matching the query.
 *       500:
 *         description: Internal server error.
 */
class RecipeSearchController {
  async search(req: Request, res: Response) {
    try {
      const filters = req.query as Record<string, string | string[]>;

      console.log("Search route reached");
      console.log("Filters:", filters);

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

      if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found." });
      }

      res.status(200).json(recipes);
    } catch (error: any) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes." });
    }
  }
}

export default new RecipeSearchController();
