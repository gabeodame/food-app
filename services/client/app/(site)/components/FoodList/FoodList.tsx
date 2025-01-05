"use client";

import React, { Suspense, useEffect, useState } from "react";
import { FoodItemProps, FoodListTypes } from "../../models/types/types";
import FoodItem from "./FoodItem";
import { usePathname, useSearchParams } from "next/navigation";
import { useSearch } from "@/context/hooks/useSearch";
import CustomButton from "@/components/ui/CustomButton";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

function FoodList({
  foodData,
  limit,
}: {
  foodData?: FoodListTypes[];
  limit?: number;
}) {
  const [data, setData] = useState<FoodListTypes[]>([]);
  const [isLandingPage, setIsLandingPage] = useState(false);
  const pathName = usePathname();
  const { setFilteredItems, toggleFiltered, state } = useSearch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const category = params.get("category") as string;

  const url = category
    ? `/api/1/recipes?category=${category}`
    : "/api/1/recipes";

  useEffect(() => {
    const getFoodData = async () => {
      try {
        console.log("url", url);
        const res = await fetch(url);

        if (res.ok) {
          const foodList = await res.json();

          console.log("data", foodList);
          setData(foodList as FoodListTypes[]);
        }
      } catch (error: any) {
        console.log("Logging Error", error);
      }
      console.log("logging landing page");
    };

    getFoodData();
  }, []);

  useEffect(() => {
    if (pathName.split("/").length < 2) {
      setIsLandingPage(true);
    } else {
      setIsLandingPage(false);
    }
  }, []);

  // const [isFiltered, setIsFiltered] = useState(false);
  // const [filteredItems, setFilteredItems] = useState([]);
  // const searchParams = useSearchParams();
  // const params = new URLSearchParams(searchParams.toString());
  // const search = params.get("search") as string;

  // useEffect(() => {
  //   //   if (search?.length > 0) {
  //   //     const items = foodData.filter((item) => {
  //   //       // Convert search term to lower case once for efficiency
  //   //       const searchTermLower = search?.toLowerCase();
  //   //       // Check if the search term is present in title, description, or tag
  //   //       const isInTitle = item.title.toLowerCase().includes(searchTermLower);
  //   //       const isInDescription = item.description
  //   //         .toLowerCase()
  //   //         .includes(searchTermLower);
  //   //       // Check if the search term is present in any of the categories or tags
  //   //       const isInCategory = item.categories?.some((category) =>
  //   //         category.name.toLowerCase().includes(searchTermLower)
  //   //       );
  //   //       // const isInTag = item.tags?.some((tag) =>
  //   //       //   tag.name.toLowerCase().includes(searchTermLower)
  //   //       // );
  //   //       // Return true if the search term is found in any of the fields
  //   //       return isInTitle || isInDescription || isInCategory;
  //   //       // || isInTag;
  //   //     });
  //   //     toggleFiltered();
  //   //     setFilteredItems(items);
  //   //   } else {
  //   //     setData(foodData);
  //   //     setFilteredItems(foodData);
  //   //     // toggleFiltered();
  //   //   }
  // }, [foodData, search]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4">
        {/* Conditional Button */}
        {isLandingPage && (
          <Button
            variant="link"
            onClick={() => {
              router.push("/foods");
            }}
            className="flex gap-1 items-center justify-center md:justify-end" // Center on mobile, right-align on larger screens
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Show All
          </Button>
        )}

        {/* Grid Layout */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4">
          {data?.map((item, index) => {
            if (limit && index >= limit) return;
            return <FoodItem key={index} item={item} />;
          })}
        </div>
      </div>
    </Suspense>
  );
}

export default FoodList;
