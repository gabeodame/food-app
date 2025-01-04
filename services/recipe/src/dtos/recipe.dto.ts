import { FoodItemProps } from "../entities/recipe.entity";

export class CreateRecipeDto implements Omit<FoodItemProps, "id"> {
  title!: string;
  imageUrl!: string;
  description!: string;
  categories?: { id?: number; name: string }[];
  userId!: string;
  ingredients!: {
    id?: number;
    name: string;
    quantity: string;
    recipeId?: number;
  }[];
  instructions!: { id?: number; step: string; recipeId?: number }[];
  tags?: { id?: number; name: string }[];
  cuisineTypes?: { name: string }[];
  seasonalEvent?: { name: string }[];
  specialDiets?: { name: string }[];
}

export type UpdateRecipeDto = Partial<Omit<FoodItemProps, "id">>;

export type Recipe = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  userId: string; // Foreign key linking to the user who created the recipe
  views: number;
  favoritesCount: number;
  createdAt: Date;
  updatedAt: Date;
  categories?: { id: number; name: string }[];
};
