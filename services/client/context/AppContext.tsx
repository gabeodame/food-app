"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";

// ✅ Define User Profile State
export type UserProfile = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  imageUrl?: string;
};

// ✅ Define Search State
export type SearchState = {
  searchList: Array<string>;
  isFiltered?: boolean;
  filteredItems?: Array<any>;
};

// ✅ Define Initial States
const initialProfileState: UserProfile | null = null;
const initialSearchState: SearchState = {
  searchList: [],
  isFiltered: false,
  filteredItems: [],
};

// ✅ Define Action Types
const enum REDUCER_ACTION_TYPE {
  SET_PROFILE,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ADD_SEARCH,
  DELETE_SEARCH,
  CLEAR_SEARCH,
  SET_FILTERED_ITEMS,
  TOGGLE_FILTERED,
}

// ✅ Define Action Shape
type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: any;
};

// ✅ Define State Shape
type AppState = {
  profile: UserProfile | null;
  search: SearchState;
};

// ✅ Define Initial App State
const initialState: AppState = {
  profile: initialProfileState,
  search: initialSearchState,
};

// ✅ Reducer Function
const reducer = (state: AppState, action: ReducerAction): AppState => {
  switch (action.type) {
    // ✅ User Profile Actions
    case REDUCER_ACTION_TYPE.SET_PROFILE:
      return { ...state, profile: action.payload ?? null };

    case REDUCER_ACTION_TYPE.UPDATE_PROFILE:
      return {
        ...state,
        profile: state.profile ? { ...state.profile, ...action.payload } : null,
      };

    case REDUCER_ACTION_TYPE.CLEAR_PROFILE:
      return { ...state, profile: null };

    // ✅ Search Actions
    case REDUCER_ACTION_TYPE.ADD_SEARCH:
      return {
        ...state,
        search: {
          ...state.search,
          searchList: state.search.searchList.includes(action.payload)
            ? state.search.searchList
            : [...state.search.searchList, action.payload],
        },
      };

    case REDUCER_ACTION_TYPE.DELETE_SEARCH:
      return {
        ...state,
        search: {
          ...state.search,
          searchList: state.search.searchList.filter(
            (term) => term !== action.payload
          ),
        },
      };

    case REDUCER_ACTION_TYPE.CLEAR_SEARCH:
      return { ...state, search: { ...state.search, searchList: [] } };

    case REDUCER_ACTION_TYPE.SET_FILTERED_ITEMS:
      return {
        ...state,
        search: {
          ...state.search,
          filteredItems: action.payload,
          isFiltered: true,
        },
      };

    case REDUCER_ACTION_TYPE.TOGGLE_FILTERED:
      return {
        ...state,
        search: { ...state.search, isFiltered: !state.search.isFiltered },
      };

    default:
      return state;
  }
};

// ✅ Create Context
const AppContext = createContext<{
  state: AppState;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  addSearch: (term: string) => void;
  deleteSearch: (term: string) => void;
  clearSearch: () => void;
  setFilteredItems: (items: Array<any>) => void;
  toggleFiltered: () => void;
}>({
  state: initialState,
  setProfile: () => {},
  updateProfile: () => {},
  clearProfile: () => {},
  addSearch: () => {},
  deleteSearch: () => {},
  clearSearch: () => {},
  setFilteredItems: () => {},
  toggleFiltered: () => {},
});

// ✅ Context Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Profile actions
  const setProfile = useCallback(
    (profile: UserProfile) =>
      dispatch({ type: REDUCER_ACTION_TYPE.SET_PROFILE, payload: profile }),
    []
  );

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) =>
      dispatch({ type: REDUCER_ACTION_TYPE.UPDATE_PROFILE, payload: updates }),
    []
  );

  const clearProfile = useCallback(
    () => dispatch({ type: REDUCER_ACTION_TYPE.CLEAR_PROFILE }),
    []
  );

  // Search actions
  const addSearch = useCallback(
    (term: string) =>
      dispatch({ type: REDUCER_ACTION_TYPE.ADD_SEARCH, payload: term }),
    []
  );

  const deleteSearch = useCallback(
    (term: string) =>
      dispatch({ type: REDUCER_ACTION_TYPE.DELETE_SEARCH, payload: term }),
    []
  );

  const clearSearch = useCallback(
    () => dispatch({ type: REDUCER_ACTION_TYPE.CLEAR_SEARCH }),
    []
  );

  const setFilteredItems = useCallback(
    (items: Array<any>) =>
      dispatch({
        type: REDUCER_ACTION_TYPE.SET_FILTERED_ITEMS,
        payload: items,
      }),
    []
  );

  const toggleFiltered = useCallback(
    () => dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE_FILTERED }),
    []
  );

  return (
    <AppContext.Provider
      value={{
        state,
        setProfile,
        updateProfile,
        clearProfile,
        addSearch,
        deleteSearch,
        clearSearch,
        setFilteredItems,
        toggleFiltered,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ✅ Custom Hook for Consuming Context
export const useAppContext = () => {
  return useContext(AppContext);
};
