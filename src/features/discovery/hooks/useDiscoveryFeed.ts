import type { Business } from "@/src/features/businesses";
import type {
    DistanceOption,
    RatingOption,
    SortOption,
} from "@/src/store/filter.store";

const distanceMap: Record<DistanceOption, number | null> = {
  "": null,
  nearby: 1,
  "1": 1,
  "5": 5,
  "10": 10,
  "25": 25,
  custom: null,
};

type UseDiscoveryFeedParams = {
  businesses: Business[];
  sort: SortOption;
  cuisines: string[];
  rating: RatingOption;
  distance: DistanceOption;
  customDistance: string;
};

export function useDiscoveryFeed({
  businesses,
  sort,
  cuisines,
  rating,
  distance,
  customDistance,
}: UseDiscoveryFeedParams) {
  const selectedDistanceKm =
    distance === "custom" ? Number(customDistance || 0) : distanceMap[distance];

  const selectedRatingValue =
    rating && rating !== "custom" ? Number(rating) : null;

  const sortBusinesses = (a: Business, b: Business) => {
    if (sort === "distance") {
      return Number(a.distanceKm ?? 0) - Number(b.distanceKm ?? 0);
    }

    if (sort === "rating") {
      return Number(b.rating ?? 0) - Number(a.rating ?? 0);
    }

    if (sort === "price_low") {
      return Number(a.priceLevel ?? 0) - Number(b.priceLevel ?? 0);
    }

    if (sort === "price_high") {
      return Number(b.priceLevel ?? 0) - Number(a.priceLevel ?? 0);
    }

    return 0;
  };

  const filteredBusinesses = [...businesses]
    .filter((business) => {
      const businessCategory = String(business.category ?? "").trim();
      const businessRating = Number(business.rating ?? 0);
      const businessDistance = Number(business.distanceKm ?? 0);

      const cuisineMatch =
        cuisines.length === 0 || cuisines.includes(businessCategory);

      const ratingMatch =
        selectedRatingValue === null || businessRating >= selectedRatingValue;

      const distanceMatch =
        selectedDistanceKm === null ||
        Number.isNaN(selectedDistanceKm) ||
        businessDistance <= selectedDistanceKm;

      return cuisineMatch && ratingMatch && distanceMatch;
    })
    .sort(sortBusinesses);

  return {
    filteredBusinesses,
  };
}
