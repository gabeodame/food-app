import React from "react";
import CategoryList from "./CategoryList";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";

function Categories() {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto overflow-y-hidden gap-0 bg-slate-50 no-scrollbar">
        <div className="flex flex-nowrap ">
          {/* <!-- Category Card 1 --> */}

          <CategoryList />
          {/* <!-- More Category Cards... --> */}
        </div>
      </div>
      <div className="w-full flex justify-between absolute top-[50%] left-0 right-0 transform -translate-y-[50%] px-2 cursor-pointer ">
        <ArrowLeftIcon className="h-8 w-8 text-gray-400" />
        <ArrowRightIcon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );
}

export default Categories;
