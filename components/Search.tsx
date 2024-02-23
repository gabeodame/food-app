"use client";

import useUpdateQueryParams from "@/app/hooks/useUpdateQueryParams";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import SearchShortCut from "./SearchShortCut";
import { useSearch } from "@/context/hooks/useSearch";

type searchProps = {
  onSearchCompleted?: () => void; // for managing open dialog programatically
  showCommands?: boolean;
  placeholder?: string;
};

function Search({
  onSearchCompleted,
  showCommands = false,
  placeholder,
}: searchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [debouncedSearch] = useDebounce(searchTerm, 1000);
  const [inputKey, setInputKey] = useState(Date.now());
  const { add } = useSearch();

  const searchQuery = useUpdateQueryParams();

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 0) {
      searchQuery("search", debouncedSearch);
      add(debouncedSearch);
      setSearchSubmitted(true); // Mark the search as submitted
      onSearchCompleted && onSearchCompleted();
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (searchSubmitted) {
      setSearchTerm(""); // Clear the search term
      setInputKey(Date.now()); // Reset the input field by changing its key

      setSearchSubmitted(false); // Reset the submission state
    }
  }, [searchSubmitted]);

  return (
    <div className="w-full flex-1 md:flex-none mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          key={inputKey} // Use the key to control the reset of the input field
          type="search"
          id="default-search"
          value={searchTerm}
          className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus-visible:ring-slate-300 focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
          placeholder={placeholder ?? "Search..."}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {showCommands && (
          <div className="pointer-events-none absolute right-[0.6rem] top-[0.6rem] hidden h-5 select-none text-[10px] items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium opacity-100 sm:flex">
            <SearchShortCut />
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
