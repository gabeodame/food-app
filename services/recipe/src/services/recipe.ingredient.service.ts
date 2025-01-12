import { CachedIngredientDto } from "../dtos";
import { prisma } from "../utils/prisma";

class RecipeIngredientService {
  async cacheIngredient(ingredient: CachedIngredientDto) {
    const { id, name, category, unit, recipeIds } = ingredient;

    // Ensure the ingredient is created or updated
    const updatedIngredient = await prisma.ingredient.upsert({
      where: { id },
      update: {
        name,
        category,
        unit,
      },
      create: {
        id,
        name,
        category,
        unit,
      },
    });

    // If `recipeIds` are provided, manage the `RecipeIngredient` relationships
    if (recipeIds && recipeIds.length > 0) {
      // Clear existing relationships for this ingredient
      await prisma.recipeIngredient.deleteMany({
        where: { ingredientId: id },
      });

      // Create new relationships in the `RecipeIngredient` table
      await prisma.recipeIngredient.createMany({
        data: recipeIds.map((recipeId) => ({
          recipeId,
          ingredientId: id,
        })),
      });
    }

    return updatedIngredient;
  }

  async handleDeadLetter(data: any): Promise<void> {
    // Logic to handle dead-lettered messages
    console.log("Handling dead-lettered ingredient message:", data);
    // Implement appropriate actions for dead-lettered messages
  }
}

export default new RecipeIngredientService();
