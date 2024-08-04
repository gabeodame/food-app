"use client";

import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import { FoodListTypes } from "@/app/(site)/models/types/types";
import FoodCardContent from "./FoodCardContent";
import { usePathname } from "next/navigation";

function FoodItemDetail({ id }: { id: number }) {
  const [found, setFound] = useState<FoodListTypes | null>(null);

  useEffect(() => {
    const getRecipeDetial = async () => {
      const res = await fetch(`https://recipe.dev/api/1/recipes/${id}`);
      const { data } = await res.json();

      setFound(data);
    };
    getRecipeDetial();
  }, [id]);

  return (
    <div className="container custom-min-height flex gap-4 flex-col items-center justify-center mt-2">
      <Link className="container h-fit w-full flex justify-end" href="/foods">
        <div className="flex w-fit items-center justify-center gap-2 px-2 p-y-2 text-white font-bold bg-color-secondary rounded-sm cursor-pointer">
          <ArrowLeftIcon className="h-4 w-4" /> Back to All
        </div>
      </Link>

      <div className="w-full h-max grid grid-cols-1 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px] shadow-md border-[1px] border-gray-100">
        <div className=" rounded-md border-r-[2px] border-gray-200">
          <Image
            src={found?.imageUrl ?? ""}
            alt={found?.title ?? ""}
            width="0"
            height="0"
            sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
            className="w-full h-auto  rounded-md"
          />
        </div>
        <FoodCardContent food={found as any} />
      </div>
    </div>
  );
}

export default FoodItemDetail;
