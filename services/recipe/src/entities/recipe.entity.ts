export type FoodItemProps = {
  id?: number;
  title: string;
  imageUrl: string;
  description: string;
  slug?: string;
  categories?: { id?: number; name: string }[];
  userId: string;
  favoritedBy?: { id: string }[];
  favoritesCount?: number;
  views?: number;
  ingredients: {
    id?: number;
    name: string;
    quantity?: number | string | null; // Allow null values and seed strings
    unit?: string;
    recipeId?: number | null; // Allow null values
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
