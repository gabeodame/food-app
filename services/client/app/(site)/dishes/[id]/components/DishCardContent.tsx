"use client";

import React, { useCallback } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DishItemProps } from "@/app/(site)/models/types/types";
import { Separator } from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import Tags from "@/app/(site)/dishes/[id]/components/dishlist/QueryParamsButtons";
import useUpdateQueryParams from "@/app/hooks/useUpdateQueryParams";
import ViewsCounter from "@/app/(site)/dishes/[id]/components/dishlist/ViewsCounter";
import FavoriteHeart from "@/components/widgets/FavoriteHeart";
import { FiEdit } from "react-icons/fi";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import QueryParamsButtons from "@/app/(site)/dishes/[id]/components/dishlist/QueryParamsButtons";
import NutritionalTracker from "@/app/(site)/auth/create-dish/components/NutritionalTracker";

interface FoodContentProps {
  dish: DishItemProps;
}

function DishCardContent({ dish }: FoodContentProps) {
  const updateQueryParams = useUpdateQueryParams();
  const router = useRouter();
  const { state } = useAppContext();
  const user = state.profile;

  type Category = {
    id: number;
    name: string;
  };

  type TagsType = { tags: { tag: { name: string } }[] };

  return (
    <ScrollArea className="md:container w-full h-full overflow-hidden flex justify-center">
      <div className="w-full flex flex-col items-center gap-3 p-5">
        <div className="flex flex-1 w-full sticky justify-between items-center top-0 bg-gray-200 p-2">
          <p className="w-full font-bold text-3xl text-gray-600">
            {dish?.title}
          </p>
          <div className="w-full flex gap-2 items-center justify-end">
            <ViewsCounter views={dish.views} />
            <FavoriteHeart recipeId={dish.id!} />
            {user?.id?.toString() === dish?.userId?.toString() && (
              <FiEdit
                onClick={() =>
                  router.push(`/auth/create-dish?recipeId=${dish.id}`)
                }
                className="text-color-secondary cursor-pointer"
              />
            )}
          </div>
        </div>
        <Separator className="bg-color-secondary h-[2px] w-full my-1" />
        <QueryParamsButtons
          tags={dish?.categories as any}
          name="Categories"
          param="category"
        />
        <div className="">
          <p className=" text-gray-500">{dish?.description}</p>
        </div>
        <div className="w-[80%] flex flex-col items-start text-gray-500 font-semibold">
          <h3 className="underline text-gray-600">Recipes</h3>
          <ul className="flex flex-col gap-2 text-gray-500">
            {dish?.ingredients?.map((recipe, idx) => (
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
            {dish?.instructions?.map((instruction, idx) => (
              <li key={idx} className="flex gap-1 items-center ">
                {idx + 1}. {instruction.step}
              </li>
            ))}
          </ol>
        </div>
        <QueryParamsButtons tags={dish?.tags as any} name="Tags" param="tag" />
      </div>
      <NutritionalTracker recipeId={dish.id} />
    </ScrollArea>
  );
}

export default DishCardContent;
