import type { Business } from "@/src/features/businesses";

const distanceMap: Record<string, number> = {
  Nearby: 1,
  "1 km": 1,
  "5 km": 5,
  "10 km": 10,
  "25 km": 25,
};

type UseDiscoveryFeedParams = {
  businesses: Business[];
  sort: string;
  cuisines: string[];
  rating: string | null;
  distance: string | null;
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
    distance === "custom"
      ? Number(customDistance || 0)
      : distance
        ? (distanceMap[distance] ?? null)
        : null;

  const selectedRatingValue =
    rating && rating !== "Any rating"
      ? Number(String(rating).replace("+", ""))
      : null;

  const sortBusinesses = (a: Business, b: Business) => {
    if (sort === "Distance") {
      return Number(a.distanceKm ?? 0) - Number(b.distanceKm ?? 0);
    }

    if (sort === "Rating") {
      return Number(b.rating ?? 0) - Number(a.rating ?? 0);
    }

    if (sort === "Cost: Low to High") {
      return Number(a.priceLevel ?? 0) - Number(b.priceLevel ?? 0);
    }

    if (sort === "Cost: High to Low") {
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
