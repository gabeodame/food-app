import { Request, Response } from "express";
import recipeFavoriteService from "../services/recipe.favorite.service";

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
  async getFavoriteStatus(req: Request, res: Response) {
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
      const favoriteStatus = await recipeFavoriteService.getFavoriteStatus(
        req.currentUser.id,
        recipeId
      );

      res.status(200).json({ isFavoritedByCurrentUser: favoriteStatus });
    } catch (error: any) {
      console.error("Error getting favorite status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   message:
   *                     type: string
   *                     example: "Recipe favorited successfully"
   *                   isFavoritedByCurrentUser:
   *                     type: boolean
   *                     example: true
   *         400:
   *           description: Invalid request. Missing recipe ID.
   *         401:
   *           description: Unauthorized request. User is not authenticated.
   */
  async favoriteRecipe(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ error: "Invalid recipe ID" });
      }

      if (!req.currentUser) {
        return res.status(401).json({ error: "Unauthorized request" });
      }

      const result = await recipeFavoriteService.favoriteRecipe(
        req.currentUser.id,
        recipeId
      );

      if (!result) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error favoriting recipe:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   message:
   *                     type: string
   *                     example: "Recipe unfavorited successfully"
   *                   isFavoritedByCurrentUser:
   *                     type: boolean
   *                     example: false
   *         400:
   *           description: Invalid request. Missing recipe ID.
   *         401:
   *           description: Unauthorized request. User is not authenticated.
   */
  async unfavoriteRecipe(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ error: "Invalid recipe ID" });
      }

      if (!req.currentUser) {
        return res.status(401).json({ error: "Unauthorized request" });
      }

      const result = await recipeFavoriteService.unfavoriteRecipe(
        req.currentUser.id,
        recipeId
      );

      if (!result) {
        return res
          .status(404)
          .json({ error: "Recipe not found or not favorited" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error unfavoriting recipe:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

const recipeFavoriteController = new RecipeFavoriteController();
export default recipeFavoriteController;
