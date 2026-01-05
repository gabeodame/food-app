"use client";

import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DishItemProps } from "@/app/(site)/models/types/types";
import { Separator } from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import ViewsCounter from "@/app/(site)/dishes/[id]/components/dishlist/ViewsCounter";
import FavoriteHeart from "@/components/widgets/FavoriteHeart";
import { FiEdit } from "react-icons/fi";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import QueryParamsButtons from "@/app/(site)/dishes/[id]/components/dishlist/QueryParamsButtons";
import NutritionalTracker from "@/app/(site)/auth/create-dish/components/NutritionalTracker";

interface DishContentProps {
  dish: DishItemProps;
}

function DishCardContent({ dish }: DishContentProps) {
  const router = useRouter();
  const { state } = useAppContext();
  const user = state.profile;

  return (
    <ScrollArea className="w-full h-full overflow-hidden">
      <div className="w-full text-gray-500">
        <h3 className="underline text-gray-600 text-center lg:text-left">
          Description
        </h3>
        <p className="text-center lg:text-left">{dish?.description}</p>
      </div>
      <div className="w-full flex flex-col items-center gap-5">
        <div className="w-full flex items-center md:justify-between gap-2">
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

        <Separator className="bg-color-secondary h-[2px] w-full my-1" />
        <div className="md:flex flex-row gap-4 w-full justify-between ">
          <QueryParamsButtons
            tags={dish?.categories as any}
            name="Categories"
            param="category"
          />

          <QueryParamsButtons
            tags={dish?.tags as any}
            name="Tags"
            param="tag"
          />
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div className="w-full flex flex-col items-center lg:items-start text-gray-500 font-semibold">
            <div className="w-full md:w-[80%] flex flex-col items-center md:items-start text-gray-500 font-semibold">
              <h3 className="underline text-gray-600 text-center md:text-left">
                Ingredients
              </h3>
              <ul className="flex flex-col gap-2 text-gray-500 w-full items-center md:items-start">
                {dish?.ingredients?.map((recipe, idx) => (
                  <li
                    key={idx}
                    className="flex gap-1 items-center justify-center md:justify-start text-center md:text-left"
                  >
                    <CheckCircledIcon className="h-4 w-4 text-color-secondary-alt" />
                    {`${recipe.quantity} ${recipe.name}`}
                  </li>
                ))}
              </ul>
            </div>
            <div className="">
              <h3 className="underline text-gray-600 text-center lg:text-left">
                Instructions
              </h3>
              <ol className="flex flex-col gap-2 text-gray-500 w-full items-center lg:items-start">
                {dish?.instructions?.map((instruction, idx) => (
                  <li
                    key={idx}
                    className="flex gap-1 items-center justify-center lg:justify-start text-center lg:text-left"
                  >
                    {idx + 1}. {instruction.step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="w-full flex flex-col gap-6">
            <NutritionalTracker recipeId={dish.id} />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default DishCardContent;
