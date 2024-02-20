export type FoodItemProps = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string[] | string;
  tag?: string[] | string;
};
