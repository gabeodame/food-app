import { Request, Response } from "express";
import { CreateRecipeDto } from "../dtos/recipe.dto";
import recipeService from "../services/recipe.service";
import { body } from "express-validator";

class RecipeController {
  async getAllRecipes(req: Request, res: Response) {
    const recipes = await recipeService.getAllRecipes();
    res.status(200).json(recipes);
  }

  async getRecipeById(req: Request, res: Response) {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(Number(id));
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  }

  async createRecipe(req: Request, res: Response) {
    const newRecipe = await recipeService.createRecipe(req);
    res.status(201).json(newRecipe);
  }

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

  async deleteRecipe(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = await recipeService.deleteRecipe(Number(id));
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    res.status(204).send({ deleted });
  }
}

export default new RecipeController();
