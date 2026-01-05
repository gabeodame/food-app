"use client";
import useUpdateQueryParams from "@/app/hooks/useUpdateQueryParams";
import { useSearchParams } from "next/navigation";
import React from "react";

type Props = {
  param: string;
  name: string;
  tags: {
    id: number;
    name: string;
  }[];
};

function QueryParamsButtons({ name, tags, param }: Props) {
  const updateQueryParams = useUpdateQueryParams();
  const searchParams = useSearchParams();

  return (
    <div className="w-full flex flex-col items-center gap-2 mt-4 md:items-start md:gap-3">
      <p className="font-semibold text-gray-600 text-center md:text-left">
        {name}
      </p>
      <div className="w-full flex flex-wrap items-center justify-center gap-2 md:justify-start">
        {tags?.map((tag) => {
          const isActive = searchParams.get(param) === tag.name.toLowerCase();

          return (
            <button
              key={tag.id}
              className={`px-4 py-2 text-sm w-full sm:w-auto rounded-md ${
                isActive
                  ? "bg-color-primary text-white"
                  : "bg-color-secondary text-white hover:bg-color-secondary-alt"
              }`}
              onClick={() => updateQueryParams(param, tag.name.toLowerCase())}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QueryParamsButtons;
