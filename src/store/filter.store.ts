import { create } from "zustand";

/**
   BE-ready filter values (NOT UI labels)
**/
export type SortOption =
  | "relevance"
  | "distance"
  | "rating"
  | "price_low"
  | "price_high";

export type RatingOption =
  | ""
  | "1"
  | "1.5"
  | "2"
  | "2.5"
  | "3"
  | "3.5"
  | "4"
  | "4.5"
  | "5"
  | "custom";

export type DistanceOption = "" | "nearby" | "1" | "5" | "10" | "25" | "custom";

export type FilterScope = "discovery" | "following";

export type CategoryFilters = {
  food: {
    cuisines: string[];
  };
};

export type FilterValues = {
  category: string;
  sort: SortOption;
  cuisines: string[];
  categoryFilters: CategoryFilters;
  rating: RatingOption;
  distance: DistanceOption;
  customDistance: string;
};

const defaultFilters: FilterValues = {
  category: "",
  sort: "relevance",
  cuisines: [],
  categoryFilters: {
    food: {
      cuisines: [],
    },
  },
  rating: "",
  distance: "",
  customDistance: "",
};

type FilterState = {
  discoveryFilters: FilterValues;
  followingFilters: FilterValues;
  setCategory: (scope: FilterScope, value: string) => void;
  setSort: (scope: FilterScope, value: SortOption) => void;
  toggleCuisine: (scope: FilterScope, value: string) => void;
  setRating: (scope: FilterScope, value: RatingOption) => void;
  setDistance: (scope: FilterScope, value: DistanceOption) => void;
  setCustomDistance: (scope: FilterScope, value: string) => void;
  reset: (scope: FilterScope) => void;
};

const getScopeKey = (scope: FilterScope) =>
  scope === "discovery" ? "discoveryFilters" : "followingFilters";

export const useFilterStore = create<FilterState>((set) => ({
  discoveryFilters: defaultFilters,
  followingFilters: defaultFilters,
  setCategory: (scope, value) =>
    set((state) => {
      const key = getScopeKey(scope);

      return {
        [key]: {
          ...state[key],
          category: value,
          cuisines: value === "Food" ? state[key].cuisines : [],
          categoryFilters:
            value === "Food"
              ? state[key].categoryFilters
              : {
                  ...state[key].categoryFilters,
                  food: {
                    cuisines: [],
                  },
                },
        },
      };
    }),
  setSort: (scope, value) =>
    set((state) => ({
      [getScopeKey(scope)]: {
        ...state[getScopeKey(scope)],
        sort: value,
      },
    })),

  toggleCuisine: (scope, value) =>
    set((state) => {
      const key = getScopeKey(scope);
      const currentFilters = state[key];
      const nextCuisines = currentFilters.cuisines.includes(value)
        ? currentFilters.cuisines.filter((item) => item !== value)
        : [...currentFilters.cuisines, value];

      return {
        [key]: {
          ...currentFilters,
          category: "Food",
          cuisines: nextCuisines,
          categoryFilters: {
            ...currentFilters.categoryFilters,
            food: {
              cuisines: nextCuisines,
            },
          },
        },
      };
    }),

  setRating: (scope, value) =>
    set((state) => ({
      [getScopeKey(scope)]: {
        ...state[getScopeKey(scope)],
        rating: value,
      },
    })),

  setDistance: (scope, value) =>
    set((state) => ({
      [getScopeKey(scope)]: {
        ...state[getScopeKey(scope)],
        distance: value,
      },
    })),

  setCustomDistance: (scope, value) =>
    set((state) => ({
      [getScopeKey(scope)]: {
        ...state[getScopeKey(scope)],
        customDistance: value,
      },
    })),

  reset: (scope) =>
    set({
      [getScopeKey(scope)]: defaultFilters,
    }),
}));
