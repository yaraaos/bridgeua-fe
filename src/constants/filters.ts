import type {
    DistanceOption,
    RatingOption,
    SortOption,
} from "@/src/store/filter.store";

export type FilterOption<T extends string> = {
  label: string;
  value: T;
};

export const SORT_OPTIONS: FilterOption<SortOption>[] = [
  { label: "Relevance (Default)", value: "relevance" },
  { label: "Distance", value: "distance" },
  { label: "Rating", value: "rating" },
  { label: "Cost: Low to High", value: "price_low" },
  { label: "Cost: High to Low", value: "price_high" },
];

export const RATING_OPTIONS: FilterOption<RatingOption>[] = [
  { label: "Any rating", value: "" },
  { label: "3.0+", value: "3" },
  { label: "3.5+", value: "3.5" },
  { label: "4.0+", value: "4" },
  { label: "4.5+", value: "4.5" },
  { label: "5.0", value: "5" },
];

export const DISTANCE_OPTIONS: FilterOption<DistanceOption>[] = [
  { label: "Nearby", value: "nearby" },
  { label: "1 km", value: "1" },
  { label: "5 km", value: "5" },
  { label: "10 km", value: "10" },
  { label: "25 km", value: "25" },
  { label: "50 km", value: "50" },
  { label: "100 km", value: "100" },
];

export const BUSINESS_CATEGORY_OPTIONS = [
  { label: "Food", value: "Food" },
  { label: "Beauty", value: "Beauty" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Shopping", value: "Shopping" },
  { label: "Automotive", value: "Automotive" },
  { label: "Services", value: "Services" },
];

export const FOOD_CATEGORY_VALUE = "Food";

export const CUISINE_OPTIONS = [
  { label: "Ukrainian", value: "Ukrainian" },
  { label: "Italian", value: "Italian" },
  { label: "Japanese", value: "Japanese" },
  { label: "Georgian", value: "Georgian" },
  { label: "American", value: "American" },
  { label: "Chinese", value: "Chinese" },
  { label: "Mediterranean", value: "Mediterranean" },
  { label: "Mexican", value: "Mexican" },
  { label: "Vegan", value: "Vegan" },
];
