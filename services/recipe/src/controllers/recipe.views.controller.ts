import { Request, Response } from "express";
import recipeViewsService from "../services/recipe.views.service";

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
  async incrementRecipeView(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id, 10);
      const userId = req?.currentUser?.id || "0";

      if (isNaN(recipeId)) {
        return res.status(400).json({ error: "Invalid recipe ID" });
      }

      await recipeViewsService.incrementRecipeView(recipeId, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error incrementing recipe view:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

const recipeViewController = new RecipeViewsController();
export default recipeViewController;
