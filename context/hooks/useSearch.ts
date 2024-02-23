import { ChangeEvent, useContext } from "react";
import { SearchContext } from "../SearchContext";

type UseSearchHookType = {
  searchList: Array<string>;
  add: (term: string) => void;
  deleteSearch: (term: string) => void;
  clearSearch: () => void;
};

export const useSearch = (): UseSearchHookType => {
  const {
    state: { searchList },
    add,
    deleteSearch,
    clearSearch,
  } = useContext(SearchContext);

  return { searchList, add, deleteSearch, clearSearch };
};
