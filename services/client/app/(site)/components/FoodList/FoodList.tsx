"use client";

import React, { Suspense } from "react";
import { FoodListTypes } from "../../models/types/types";
import FoodItem from "./FoodItem";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

function FoodList({
  foodData,
  limit,
}: {
  foodData: FoodListTypes[];
  limit?: number;
}) {
  const router = useRouter();
  console.log("foodData", foodData);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4">
        {/* Conditional Button */}
        <Button
          variant="link"
          onClick={() => {
            router.push("/foods");
          }}
          className="flex gap-1 items-center justify-center md:justify-end"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Show All
        </Button>

        {/* Grid Layout */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4">
          {foodData &&
            foodData?.map((item, index) => {
              if (limit && index >= limit) return null;
              return <FoodItem key={index} item={item} />;
            })}
        </div>
      </div>
    </Suspense>
  );
}

export default FoodList;
