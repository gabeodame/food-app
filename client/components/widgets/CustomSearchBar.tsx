"use client";

import React, { Suspense, lazy, useState } from "react";
import CustomDialog from "./CustomDialog";
// import Search from "../Search";
import { useSearch } from "@/context/hooks/useSearch";
import { cn } from "@/lib/utils";
import { TrashIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";

const Search = lazy(() => import("../Search"));

function CustomSearchBar() {
  const [open, setOpen] = useState(false);
  const { state, deleteSearch, clearSearch } = useSearch();
  const { searchList } = state;

  const handleKeyDown = (event: {
    metaKey: any;
    ctrlKey: any;
    key: string;
    preventDefault: () => void;
  }) => {
    // Check if Command (metaKey) or Ctrl (ctrlKey) and 'K' are pressed
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault(); // Prevent default to avoid any browser shortcut conflicts
      setOpen(true); // Open your search dialog
    }
  };

  return (
    <div
      className="w-full flex items-center"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <CustomDialog
        trigger={
          <Suspense>
            <Search placeholder="Search Food Items" showCommands={true} />
          </Suspense>
        }
        open={open}
        setOpen={() => setOpen(!open)}
      >
        <div className="w-full m-0">
          <Suspense fallback={<Skeleton className="w-fit h-fit" />}>
            <Search
              onSearchCompleted={() => setOpen(!open)}
              placeholder="Search Food Items"
            />
          </Suspense>
        </div>
        <div className="w-full min-h-[352px]">
          <ul className="w-full h-full">
            {searchList?.map((search, idx) => (
              <li
                key={search}
                className={cn(
                  "p-2 w-full flex items-center justify-between bg-gray-100 dark:bg-muted h-fit cursor-pointer hover:bg-gray-200",
                  {
                    "bg-color-secondary-alt dark:bg-muted transition-all duration-150 ease-in-out":
                      idx % 2 === 1,
                  }
                )}
              >
                <span>{search}</span>
                <TrashIcon
                  className="h-4 w-4 cursor-pointer mr-2 hover:text-color-secondary-alt"
                  onClick={() => deleteSearch(search)}
                />
              </li>
            ))}
          </ul>
        </div>
      </CustomDialog>
    </div>
  );
}

export default CustomSearchBar;
