"use client";

import React, { Suspense, lazy, useState } from "react";
import CustomDialog from "./CustomDialog";
// import Search from "../Search";
import { useSearch } from "@/context/hooks/useSearch";
import { cn } from "@/lib/utils";
import { TrashIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

const Search = lazy(() => import("../Search"));

function CustomSearchBar() {
  const [open, setOpen] = useState(false);
  const { state, deleteSearch, clearSearch } = useSearch();
  const { searchList } = state;

  const router = useRouter();

  const handleKeyDown = (event: {
    metaKey: any;
    ctrlKey: any;
    key: string;
    preventDefault: () => void;
  }) => {
    // Check if Command (metaKey) or Ctrl (ctrlKey) and 'K' are pressed
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault(); // Prevent default to avoid any browser shortcut conflicts
      setOpen(!open); // Open your search dialog
    }
  };

  return (
    <Suspense fallback={<Skeleton className="w-full h-12" />}>
      <div
        className="min-w-full h-full flex-1"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <CustomDialog
          trigger={
            <div className="flex w-full items-center">
              {/* Search bar should take full width */}
              <Suspense fallback={<Skeleton className="w-full h-12" />}>
                <Search
                  placeholder="Search Food Items"
                  showCommands={true}
                  // className="w-full"
                />
              </Suspense>
            </div>
          }
          open={open}
          setOpen={() => setOpen(!open)}
        >
          <div className="w-full m-0">
            <Suspense fallback={<Skeleton className="w-full h-fit" />}>
              <Search
                onSearchCompleted={() => setOpen(!open)}
                placeholder="Search Food Items"
                showCommands={true}
              />
            </Suspense>
          </div>

          <ScrollArea className="w-full max-h-[500px] overflow-auto">
            <ul className="w-full">
              {searchList?.map((search, idx) => (
                <li
                  key={search}
                  className={cn(
                    "p-2 w-full flex items-center justify-between bg-gray-100 dark:bg-muted cursor-pointer hover:bg-gray-200",
                    {
                      "bg-color-secondary-alt dark:bg-muted transition-all duration-150 ease-in-out":
                        idx % 2 === 1,
                    }
                  )}
                  onClick={() => {
                    router.push(`/foods?search=${search}`);
                    setOpen(false);
                  }}
                >
                  <span>{search}</span>
                  <TrashIcon
                    className="h-4 w-4 cursor-pointer mr-2 hover:text-color-secondary-alt"
                    onClick={() => deleteSearch(search)}
                  />
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CustomDialog>
      </div>
    </Suspense>
  );
}

export default CustomSearchBar;
