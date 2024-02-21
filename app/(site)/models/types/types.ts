export type FoodItemProps = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string[]; // Updated to expect an array of strings
  tag?: string[];
  recipes?: {
    ingredients: string[];
    instructions: string[];
  };
};
