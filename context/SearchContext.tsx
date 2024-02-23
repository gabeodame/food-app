//search context for managing user searches

import {
  ChangeEvent,
  ReactElement,
  createContext,
  useCallback,
  useReducer,
} from "react";

type StateType = {
  searchList: Array<string>;
};

//reuse
export const initialState: StateType = {
  searchList: [],
};

const enum REDUCER_ACTION_TYPE {
  ADD,
  DELETE,
  CLEAR,
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

  return { state, add, deleteSearch, clearSearch };
};

const initContextState: UseSearchContextType = {
  state: initialState,
  add: () => {
    (term: string) => {};
  },
  deleteSearch: (term: string) => {},
  clearSearch: () => {},
};

type UseSearchContextType = ReturnType<typeof useSearchContext>;

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
