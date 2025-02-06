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
    <div className="w-full gap-3 flex items-center justify-start mt-4">
      <p>{name}</p>
      <div className="w-full flex gap-4 items-start">
        {tags?.map((tag) => {
          const isActive = searchParams.get(param) === tag.name.toLowerCase();

          return (
            <button
              key={tag.id}
              className={`px-4 py-1 w-fit rounded-md ${
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
