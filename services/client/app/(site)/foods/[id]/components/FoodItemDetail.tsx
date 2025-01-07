"use client";

import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React from "react";

import Image from "next/image";
import { FoodItemProps, FoodListTypes } from "@/app/(site)/models/types/types";
import FoodCardContent from "./FoodCardContent";

function FoodItemDetail({ food }: { food: FoodItemProps }) {
  return (
    <div className="w-full md:max-w-7xl h-full flex flex-col gap-4 items-center justify-center mt-2 px-2">
      <div className="w-full h-full">
        {/* Back to All button */}
        <Link href="/foods" className="w-full flex justify-end mb-2">
          <div
            className="flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-color-secondary text-white font-semibold sm:font-bold 
                rounded cursor-pointer transition-all duration-200 hover:bg-color-secondary-dark text-sm sm:text-base"
          >
            <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Back to All</span>
          </div>
        </Link>

        {/* Food Card */}
        <div className="w-svw h-full md:max-w-7xl max-h-screen grid grid-cols-1 lg:grid-cols-[1fr,_400px] gap-4 border border-gray-100 shadow-md rounded-lg p-2 sm:p-4">
          {/* Image Section */}
          <div className="w-full h-full rounded-lg overflow-hidden border-gray-200">
            <Image
              src={food?.imageUrl ?? ""}
              alt={food?.title ?? ""}
              width="0"
              height="0"
              sizes="(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="w-full h-full p-4">
            <FoodCardContent food={food} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodItemDetail;
