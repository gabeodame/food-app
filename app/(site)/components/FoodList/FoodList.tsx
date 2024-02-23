"use client";

import React, { useEffect, useState } from "react";
import { FoodItemProps } from "../../models/types/types";
import FoodItem from "./FoodItem";
import { useSearchParams } from "next/navigation";

function FoodList({ foodData }: { foodData: FoodItemProps[] }) {
  const [data, setData] = useState<FoodItemProps[]>([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") as string;

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
        const isInCategory = item.category?.some((category) =>
          category.toLowerCase().includes(searchTermLower)
        );
        const isInTag = item.tag?.some((tag) =>
          tag.toLowerCase().includes(searchTermLower)
        );

        // Return true if the search term is found in any of the fields
        return isInTitle || isInDescription || isInCategory || isInTag;
      });

      setData(items);
    } else {
      setData(foodData);
    }
  }, [foodData]);

  console.log(data);

  return (
    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4">
      {data?.map((item, index) => {
        return <FoodItem key={index} item={item} />;
      })}
    </div>
  );
}

export default FoodList;
