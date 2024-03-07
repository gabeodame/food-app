"use client";

import React, { useEffect, useState } from "react";
import { FoodItemProps } from "../../models/types/types";
import FoodItem from "./FoodItem";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/context/hooks/useSearch";
import CustomButton from "@/components/ui/CustomButton";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { FoodListTypes } from "../../page";

function FoodList({
  foodData,
  limit,
}: {
  foodData: FoodListTypes[];
  limit?: number;
}) {
  const [data, setData] = useState<FoodListTypes[]>([]);
  const { setFilteredItems, toggleFiltered, state } = useSearch();
  const router = useRouter();

  // const [isFiltered, setIsFiltered] = useState(false);
  // const [filteredItems, setFilteredItems] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") as string;
  const params = new URLSearchParams(searchParams.toString());

  useEffect(() => {
    if (search?.length > 0) {
      const items = foodData.filter((item) => {
        // Convert search term to lower case once for efficiency
        const searchTermLower = search?.toLowerCase();

        // Check if the search term is present in title, description, or tag
        const isInTitle = item.title.toLowerCase().includes(searchTermLower);
        const isInDescription = item.description
          .toLowerCase()
          .includes(searchTermLower);

        // Check if the search term is present in any of the categories or tags
        const isInCategory = item.categories?.some((category) =>
          category.name.toLowerCase().includes(searchTermLower)
        );

        // const isInTag = item.tags?.some((tag) =>
        //   tag.name.toLowerCase().includes(searchTermLower)
        // );

        // Return true if the search term is found in any of the fields
        return isInTitle || isInDescription || isInCategory;
        // || isInTag;
      });
      toggleFiltered();
      setFilteredItems(items);
    } else {
      setData(foodData);
      setFilteredItems(foodData);
      // toggleFiltered();
    }
  }, [foodData, search]);

  return (
    <div className="flex flex-col gap-4">
      {state.isFiltered && (
        <Button
          variant="link"
          onClick={() => {
            router.push("/foods");
          }}
          className="flex gap-1 items-center self-end"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to All
        </Button>
      )}
      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4">
        {state.filteredItems?.map((item, index) => {
          if (limit && index >= limit) return;
          return <FoodItem key={index} item={item} />;
        })}
      </div>
    </div>
  );
}

export default FoodList;
