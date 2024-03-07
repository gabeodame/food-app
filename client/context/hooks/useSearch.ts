import { ChangeEvent, useContext } from "react";
import { SearchContext, StateType } from "../SearchContext";

type UseSearchHookType = {
  state: StateType;
  add: (term: string) => void;
  deleteSearch: (term: string) => void;
  clearSearch: () => void;
  setFilteredItems: (items: Array<any>) => void;
  toggleFiltered: () => void;
};

export const useSearch = (): UseSearchHookType => {
  const {
    state,
    add,
    deleteSearch,
    clearSearch,
    setFilteredItems,
    toggleFiltered,
  } = useContext(SearchContext);

  return {
    state,
    add,
    deleteSearch,
    clearSearch,
    setFilteredItems,
    toggleFiltered,
  };
};
