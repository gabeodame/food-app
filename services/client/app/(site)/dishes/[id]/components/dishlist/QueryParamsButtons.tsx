"use client";
import useUpdateQueryParams from "@/app/hooks/useUpdateQueryParams";
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
  return (
    <div className="w-full gap-3 flex items-center justify-start mt-4 ">
      <p>{name}</p>
      <div className="w-full flex gap-4 items-start ">
        {tags?.map((tag) => (
          <button
            key={tag?.id}
            className="px-4 py-1 w-fit rounded-md bg-color-secondary text-white hover:bg-color-secondary-alt cursor-pointer "
            onClick={() =>
              updateQueryParams(`${param}`, tag.name.toLowerCase())
            }
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QueryParamsButtons;
