"use client";

import { SearchProvider, initialState } from "@/context/SearchContext";
import React, { ReactElement } from "react";

function ContextWrapper({ children }: { children: ReactElement }) {
  return (
    <SearchProvider searchList={initialState.searchList}>
      {children}
    </SearchProvider>
  );
}

export default ContextWrapper;
