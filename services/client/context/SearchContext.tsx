"use client";
//search context for managing user searches

import { ReactElement, createContext, useCallback, useReducer } from "react";

export type StateType = {
  searchList: Array<string>;
  isFiltered?: boolean;
  filteredItems?: Array<any>;
};

//reuse
export const initialState: StateType = {
  searchList: [],
  isFiltered: false,
  filteredItems: [],
};

const enum REDUCER_ACTION_TYPE {
  ADD,
  DELETE,
  CLEAR,
  SET_FILTERED_ITEMS,
  TOGGLE_FILTERED,
}

type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: string;
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD:
      //check if the search term already exists to avoid duplication
      if (state.searchList.includes(action.payload!.toLowerCase())) {
        return state;
      }

      //add new term to list
      return { searchList: [...state.searchList, action.payload!] };

    case REDUCER_ACTION_TYPE.DELETE:
      //remove a specific search term from the list
      return {
        searchList: state.searchList.filter(
          (term) => term.toLowerCase() !== action.payload?.toLowerCase()
        ),
      };
    case REDUCER_ACTION_TYPE.CLEAR:
      //clear entire list of searches
      return { searchList: [] };

    case REDUCER_ACTION_TYPE.SET_FILTERED_ITEMS:
      return {
        ...state,
        filteredItems: action.payload as any, // Assuming payload is an array of filtered items
        isFiltered: true,
      };

    case REDUCER_ACTION_TYPE.TOGGLE_FILTERED:
      return {
        ...state,
        isFiltered: !state.isFiltered,
      };

    default:
      return state;
  }
};

const useSearchContext = (initialState: StateType) => {
  //manage state and dispatch
  const [state, dispatch] = useReducer(reducer, initialState);

  //add action creator
  const add = useCallback(
    (term: string) =>
      dispatch({
        type: REDUCER_ACTION_TYPE.ADD,
        payload: term.toLowerCase(),
      }),
    []
  );

  //delete action creator
  const deleteSearch = useCallback(
    (term: string) =>
      dispatch({
        type: REDUCER_ACTION_TYPE.DELETE,
        payload: term.toLowerCase(),
      }),
    []
  );

  //clear action creator
  const clearSearch = useCallback(
    () => dispatch({ type: REDUCER_ACTION_TYPE.CLEAR }),
    []
  );

  //set filteredItems
  const setFilteredItems = useCallback(
    (
      items: Array<any> // Type accordingly
    ) =>
      dispatch({
        type: REDUCER_ACTION_TYPE.SET_FILTERED_ITEMS,
        payload: items as any,
      }),
    []
  );

  // toggle isFiltered
  const toggleFiltered = useCallback(
    () => dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE_FILTERED }),
    []
  );

  return {
    state,
    add,
    deleteSearch,
    clearSearch,
    setFilteredItems,
    toggleFiltered,
  };
};

type UseSearchContextType = ReturnType<typeof useSearchContext>;

const initContextState: UseSearchContextType = {
  state: initialState,
  add: () => {
    (term: string) => {};
  },
  deleteSearch: (term: string) => {},
  clearSearch: () => {},
  setFilteredItems: (items: Array<any>) => {},
  toggleFiltered: () => {},
};

//create context
export const SearchContext =
  createContext<UseSearchContextType>(initContextState);

type ChildrenType = {
  children?: ReactElement | undefined;
};

//create context Provider
export const SearchProvider = ({
  children,
  ...initialState
}: ChildrenType & StateType): ReactElement => {
  return (
    <SearchContext.Provider value={useSearchContext(initialState)}>
      {children}
    </SearchContext.Provider>
  );
};
