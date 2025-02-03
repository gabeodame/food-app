"use client";

import React, { useCallback } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FoodItemProps } from "@/app/(site)/models/types/types";
import { Separator } from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import Tags from "@/app/(site)/components/FoodList/Tags";
import useUpdateQueryParams from "@/app/hooks/useUpdateQueryParams";
import ViewsCounter from "@/app/(site)/components/FoodList/ViewsCounter";
import FavoriteHeart from "@/components/widgets/FavoriteHeart";

interface FoodContentProps {
  food: FoodItemProps;
}

function FoodCardContent({ food }: FoodContentProps) {
  const updateQueryParams = useUpdateQueryParams();
  console.log(food, "from foodContent component");

  type Category = {
    name: string;
  };

  type TagsType = { tags: { tag: { name: string } }[] };

  return (
    <ScrollArea className="md:container w-full h-full overflow-hidden flex justify-center">
      <div className="w-full flex flex-col items-center gap-3 p-5">
        <div className="flex  w-full sticky justify-between items-center top-0 bg-gray-200 p-2">
          <p className="font-bold text-3xl text-gray-600">{food?.title}</p>
          <div className="w-full flex gap-2 items-center justify-end">
            <ViewsCounter views={food.views} />
            <FavoriteHeart recipeId={food.id!} />
          </div>
        </div>
        <Separator className="bg-color-secondary h-[2px] w-full my-1" />
        <div className="w-full flex flex-col gap-2 items-center  bg-gray-200 p-2">
          <span className=" text-gray-500"> Category(s):</span>
          <ScrollArea className="w-full h-full">
            <ul className="w-full grid grid-cols-1 gap-2 items-center text-gray-500">
              {Array.isArray(food?.categories)
                ? food?.categories?.map((cat: any, idx) => {
                    const category = cat?.category?.name;
                    return (
                      <li
                        key={category}
                        className="w-full h-full bg-gray-100 hover:bg-color-secondary-alt hover:text-white rounded-sm shadow-sm p-2 flex gap-2 items-center font-bold cursor-pointer "
                        onClick={() => {
                          updateQueryParams("category", category.toLowerCase());
                        }}
                      >
                        {category}
                      </li>
                    );
                  })
                : food?.categories}
            </ul>
          </ScrollArea>
        </div>
        <div className="">
          <p className=" text-gray-500">{food?.description}</p>
        </div>
        <div className="w-[80%] flex flex-col items-start text-gray-500 font-semibold">
          <h3 className="underline text-gray-600">Recipes</h3>
          <ul className="flex flex-col gap-2 text-gray-500">
            {food?.ingredients?.map((recipe, idx) => (
              <li key={idx} className="flex gap-1 items-center">
                <CheckCircledIcon className="h-4 w-4 text-color-secondary-alt" />
                {`${recipe.quantity} ${recipe.name}`}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-[80%] flex flex-col items-start text-gray-500 font-semibold">
          <h3 className="underline text-gray-600">Instructions</h3>
          <ol className="flex flex-col gap-2 text-gray-500">
            {food?.instructions?.map((instruction, idx) => (
              <li key={idx} className="flex gap-1 items-center ">
                {idx + 1}. {instruction.step}
              </li>
            ))}
          </ol>
        </div>
        <Tags tags={food?.tags as any} />
      </div>
    </ScrollArea>
  );
}

export default FoodCardContent;
