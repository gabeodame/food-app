export type Ingredient = {
  name: string;
  category?: string;
  unit: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
  allergens?: string;
  id?: string;
};

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
