"use client";

import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { DishItemProps } from "@/app/(site)/models/types/types";
import Image from "next/image";
import FoodCardContent from "./DishCardContent";
import { buildClient } from "@/app/util/buildClient";
import { useEffect } from "react";

function DisdhItemDetail({ dish }: { dish: DishItemProps }) {
  useEffect(() => {
    const updateViewCount = async () => {
      try {
        const client = buildClient();
        await client.post(`/api/1/recipes/${dish.id}/views`);
      } catch (error) {
        console.error("Error updating views:", error);
      }
    };

    updateViewCount();
  }, [dish.id]);

  return (
    <div className="w-full md:max-w-7xl h-full flex flex-col gap-4 items-center justify-center mt-2 px-2">
      <div className="w-full h-full">
        {/* Back to All button */}
        <Link href="/dishes" className="w-full flex justify-end mb-2">
          <div
            className="flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-color-secondary text-white font-semibold sm:font-bold 
                rounded cursor-pointer transition-all duration-200 hover:bg-color-secondary-dark text-sm sm:text-base"
          >
            <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Back to All</span>
          </div>
        </Link>

        {/* Food Card */}
        <div className="w-svw h-full md:max-w-7xl gap-4 border border-gray-100 shadow-md rounded-lg p-2 sm:p-4">
          {/* Image Section */}
          <div className="w-full h-full rounded-lg overflow-hidden border-gray-200">
            <Image
              src={dish?.imageUrl ?? ""}
              alt={dish?.title ?? ""}
              width="0"
              height="0"
              sizes="(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="w-full h-full p-4">
            <FoodCardContent dish={dish} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisdhItemDetail;
