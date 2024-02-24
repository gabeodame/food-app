import FeaturedCategories from "../components/FeaturedCategories";
import FoodList from "../components/FoodList/FoodList";
import { FoodItemProps } from "../models/types/types";
import { foodData } from "./data/foodData";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function FoodListHome({ params, searchParams }: Props) {
  const categories = searchParams.category as string;
  const tags = searchParams.tag as string;
  const search = searchParams.search as string;

  // Below logic will be replaced with ORM (possibly PRISMA)
  // Function to filter food data based on categories and tags
  const filterFoodData = (
    foodData: FoodItemProps[],
    categories: string | string[],
    tags: string | string[],
    search: string
  ) => {
    // Helper to ensure any input is treated as an array
    const ensureArray = (value: any) =>
      Array.isArray(value) ? value : value ? [value] : [];

    // Convert category and tag parameters into arrays
    const inputCategories = ensureArray(categories);
    const inputTags = ensureArray(tags);

    return foodData.filter((item) => {
      // Check if item matches any of the provided categories
      const matchesCategory =
        inputCategories.length === 0 ||
        item.category?.some((cat) =>
          inputCategories.includes(cat.toLowerCase())
        );

      // Check if item matches any of the provided tags
      const matchesTag =
        inputTags.length === 0 ||
        item.tag?.some((tag) => inputTags?.includes(tag.toLowerCase()));

      // Include the item if it matches any of the categories and any of the tags
      return matchesCategory && matchesTag;
    });
  };

  const filteredFood = filterFoodData(foodData, categories, tags, search);

  return (
    <section>
      <FeaturedCategories />
      <div className="container flex flex-col items-end overflow-hidden mt-4">
        <FoodList foodData={filteredFood} />
      </div>
    </section>
  );
}
