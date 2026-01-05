"use client";

import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { DishItemProps } from "@/app/(site)/models/types/types";
import Image from "next/image";
import DishCardContent from "./DishCardContent";
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

        {/* Dish Card */}
        <div className="w-full flex flex-col gap-4 border border-gray-100 shadow-md rounded-lg p-2 sm:p-4">
          {/* Image Section */}
          <div className="relative w-full h-[240px] sm:h-[360px] lg:h-[520px] rounded-lg overflow-hidden border-gray-200 bg-gray-100">
            <Image
              src={dish?.imageUrl ?? ""}
              alt={dish?.title ?? ""}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="w-full">
            <h1 className="w-full text-center text-2xl sm:text-3xl font-bold text-gray-700">
              {dish?.title}
            </h1>
          </div>

          {/* Content Section */}
          <div className="w-full h-full p-4">
            <DishCardContent dish={dish} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisdhItemDetail;
