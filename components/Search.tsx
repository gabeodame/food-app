"use client";

import useUpdateQueryParams from "@/app/hooks/useUpdateQueryParams";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [inputKey, setInputKey] = useState(Date.now());

  const searchQuery = useUpdateQueryParams();

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 0) {
      searchQuery("search", debouncedSearch);
      setSearchSubmitted(true); // Mark the search as submitted
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
    <div className="max-w-md mx-auto">
      <div className="relative">
        <input
          key={inputKey} // Use the key to control the reset of the input field
          type="search"
          id="default-search"
          value={searchTerm}
          className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus-visible:ring-slate-300 focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
          placeholder="Search Mockups, Logos..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Search;
