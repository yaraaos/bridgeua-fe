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
];
