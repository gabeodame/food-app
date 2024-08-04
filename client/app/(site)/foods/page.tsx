// import { prisma } from "@/lib/prisma";
import FeaturedCategories from "../components/FeaturedCategories";
import FoodList from "../components/FoodList/FoodList";
import { FoodItemProps, FoodListTypes } from "../models/types/types";

// import { foodData } from "./data/foodData";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | null };
};

export default async function FoodListHome({ params, searchParams }: Props) {
  const categories = searchParams.category as string;
  const tags = searchParams.tag as string;
  const search = searchParams.search as string;
  const id = +params.id;

  // const recipes =  //make api call to food service to get food
  // await prisma.recipe.findMany();

  // Below logic will be replaced with ORM (possibly PRISMA)
  // Function to filter food data based on categories and tags
  // const filterFoodData = (
  //   foodData: any[],
  //   categories: string | string[],
  //   tags: { name: string }[] | string,
  //   search: string
  // ) => {
  //   // Helper to ensure any input is treated as an array
  //   const ensureArray = (value: any) =>
  //     Array.isArray(value) ? value : value ? [value] : [];

  //   // Convert category and tag parameters into arrays
  //   const inputCategories = ensureArray(categories);
  //   const inputTags = ensureArray(tags);

  //   return foodData.filter((item) => {
  //     // Check if item matches any of the provided categories
  //     const matchesCategory =
  //       inputCategories.length === 0 ||
  //       item.categories?.some((cat: { id: number; name: string }) =>
  //         inputCategories.includes(cat.name.toLowerCase())
  //       );

  //     // Check if item matches any of the provided tags
  //     const matchesTag =
  //       inputTags.length === 0 ||
  //       item.tags?.some((tag: { id: number; name: string }) =>
  //         inputTags?.includes(tag.name.toLowerCase())
  //       );

  //     // Include the item if it matches any of the categories and any of the tags
  //     return matchesCategory && matchesTag;
  //   });
  // };

  // const filteredFood = filterFoodData([], categories, tags, search);

  return (
    <section>
      {/* <FeaturedCategories /> */}
      <div className="container flex flex-col items-end overflow-hidden mt-4">
        <FoodList />
      </div>
    </section>
  );
}
