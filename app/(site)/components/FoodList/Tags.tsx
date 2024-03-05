"use client";
import useUpdateQueryParams from "@/app/hooks/useUpdateQueryParams";
import React from "react";

function Tags({ tags }: { tags: { name: string }[] }) {
  const updateQueryParams = useUpdateQueryParams();
  return (
    <div className="w-full gap-3 flex items-center justify-start mt-4 ">
      <p>Tags</p>
      <div className="w-full flex gap-4 items-start ">
        {tags?.map((tag, idx) => (
          <button
            key={tag.name}
            className="px-4 py-1 w-fit rounded-md bg-color-secondary text-white"
            onClick={() => updateQueryParams("tag", tag.name.toLowerCase())}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tags;
