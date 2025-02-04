export type DishItemProps = {
  id?: number;
  title: string;
  imageUrl: string;
  description: string;
  categories?: { id?: number; name: string }[]; // Assuming each category has an id and name
  views: number;
  userId: number;
  ingredients: {
    id?: number;
    name: string;
    quantity: string;
    recipeId?: number;
  }[];
  instructions: {
    id?: number;
    step: string;
    recipeId?: number;
  }[];
  tags?: { id?: number; name: string }[]; // Assuming each tag has an id and name
  cuisineTypes?: { name: string }[];
  seasonalEvent?: { name: string }[];
  specialDiets?: { name: string }[];
};

export type DishListTypes = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  views: number;
  favoritesCount: number;
  isFavoritedByCurrentUser?: boolean;
  categories?: any[];
  tags?: any[];
  season?: any[];
};
