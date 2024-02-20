import React from "react";
import { FoodItemProps } from "../../models/types/types";
import FoodItem from "./FoodItem";

function FoodList({ foodData }: { foodData: FoodItemProps[] }) {
  const handleClicked = (item: FoodItemProps) => {
    console.log(item);
  };

  return (
    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4">
      {foodData.map((item, index) => {
        return <FoodItem key={index} item={item} />;
      })}
    </div>
  );
}

export default FoodList;
