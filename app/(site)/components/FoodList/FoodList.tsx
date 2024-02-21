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
      const items = foodData.filter(
        (item) => item.title.toLowerCase().indexOf(search?.toLowerCase()) !== -1
      );

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
