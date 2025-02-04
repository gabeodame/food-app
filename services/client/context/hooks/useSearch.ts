import { useContext } from "react";
import { useAppContext } from "@/context/AppContext"; // Now using AppContext
import { SearchState } from "@/context/AppContext";

type UseSearchHookType = {
  state: SearchState;
  add: (term: string) => void;
  deleteSearch: (term: string) => void;
  clearSearch: () => void;
  setFilteredItems: (items: Array<any>) => void;
  toggleFiltered: () => void;
};

export const useSearch = (): UseSearchHookType => {
  const {
    state,
    addSearch,
    deleteSearch,
    clearSearch,
    setFilteredItems,
    toggleFiltered,
  } = useAppContext();

  return {
    state: state.search, // Extracting only the search-related state
    add: addSearch,
    deleteSearch,
    clearSearch,
    setFilteredItems,
    toggleFiltered,
  };
};
