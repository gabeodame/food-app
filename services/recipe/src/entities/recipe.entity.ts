export type FoodItemProps = {
  id?: number;
  title: string;
  imageUrl: string;
  description: string;
  slug: string;
  categories?: { id?: number; name: string }[];
  userId: string;
  favoritedBy?: { id: string }[];
  favoritesCount?: number;
  views: number;
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
