"use client";

import React, { useCallback } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FoodItemProps } from "@/app/(site)/models/types/types";
import { Separator } from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import Tags from "@/app/(site)/components/FoodList/Tags";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useUpdateQueryParams from "@/app/hooks/useUpdateQueryParams";

interface FoodContentProps {
  food: FoodItemProps;
}

function FoodCardContent({ food }: FoodContentProps) {
  const updateQueryParams = useUpdateQueryParams();

  return (
    <ScrollArea className="h-full overflow-auto">
      <div className="flex flex-col w-full items-center gap-3 p-5">
        <div className="flex flex-col w-full sticky">
          <p className="font-bold text-3xl text-gray-600">{food?.title}</p>
          <Separator className="bg-color-secondary h-[2px] w-full my-1" />
        </div>
        <div className="w-full flex gap-2 items-center  bg-gray-200 p-2">
          <span className=" text-gray-500"> Category(s):</span>
          <ul className="w-fit flex gap-1 items-center text-gray-500">
            {Array.isArray(food?.category)
              ? food.category.map((item, idx) => (
                  <li
                    key={item}
                    className="flex gap-1 items-center font-bold cursor-pointer "
                    onClick={() => {
                      updateQueryParams("category", item.toLowerCase());
                    }}
                  >
                    {item} {idx < food.category.length - 1 ? "|" : null}
                  </li>
                ))
              : food?.category}
          </ul>
        </div>
        <div className="">
          <p className=" text-gray-500">{food?.description}</p>
        </div>
        <div className="w-[80%] flex flex-col items-start text-gray-500 font-semibold">
          <h3 className="underline text-gray-600">Recipes</h3>
          <ul className="flex flex-col gap-2 text-gray-500">
            {food?.recipes?.ingredients.map((recipe, idx) => (
              <li key={idx} className="flex gap-1 items-center">
                <CheckCircledIcon className="h-4 w-4 text-color-secondary-alt" />
                {recipe}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-[80%] flex flex-col items-start text-gray-500 font-semibold">
          <h3 className="underline text-gray-600">Instructions</h3>
          <ol className="flex flex-col gap-2 text-gray-500">
            {food?.recipes?.instructions.map((instruction, idx) => (
              <li key={idx} className="flex gap-1 items-center ">
                {idx + 1}. {instruction}
              </li>
            ))}
          </ol>
        </div>
        <Tags tags={food.tag as string[]} />
      </div>
    </ScrollArea>
  );
}

export default FoodCardContent;
