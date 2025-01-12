export type FoodItemProps = {
  id?: number;
  title: string;
  imageUrl: string;
  description: string;
  categories?: { id?: number; name: string }[];
  userId: string;
  ingredients: {
    id: number;
    name: string;
    quantity: number | null; // Allow null values
    recipeId: number | null; // Allow null values
  }[];
  instructions: {
    id?: number;
    step: string;
    recipeId?: number;
  }[];
  tags?: { id?: number; name: string }[];
  cuisineTypes?: { name: string }[];
  seasonalEvent?: { name: string }[];
  specialDiets?: { name: string }[];
};
