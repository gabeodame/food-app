import { BadRequestError } from "@gogittix/common";
import { CachedIngredientDto } from "../dtos";
import { prisma } from "../utils/prisma";

class RecipeIngredientService {
  async cacheIngredient(data: CachedIngredientDto) {
    const { id, name, category, unit, recipeIds } = data;
    console.log("Caching ingredient:", data);

    try {
      // Ensure the ingredient is created or updated
      const createOrUpdate = await prisma.ingredient.upsert({
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

      return createOrUpdate;
    } catch (error: any) {
      console.error("Error caching ingredient:", error);
      throw new BadRequestError(`Error caching ingredient: ${error.message}`);
    }
  }

  async handleDeadLetter(data: any): Promise<void> {
    // Logic to handle dead-lettered messages
    console.log("Handling dead-lettered ingredient message:", data);
    // Implement appropriate actions for dead-lettered messages
    await this.cacheIngredient(data);
  }
}

export default new RecipeIngredientService();
