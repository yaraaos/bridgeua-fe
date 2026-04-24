import { useMemo, useState } from "react";

import { useBusinesses } from "@/src/features/businesses";
import { followingFeedMock } from "@/src/mocks/following-feed.mock";
import { useFilterStore } from "@/src/store/filter.store";
import { useFollowingStore } from "@/src/store/following.store";
import {
    FollowingFeedCardItem,
    FollowingFeedType,
} from "../types/following.types";

export const useFollowingFeed = () => {
  const { businesses, isLoading } = useBusinesses();

  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );

  const { sort, cuisines, rating, distance, customDistance } = useFilterStore(
    (state) => state.followingFilters,
  );

  const [activeTab, setActiveTab] = useState<FollowingFeedType>("promotion");
  const [searchQuery, setSearchQuery] = useState("");

  const feedItems = useMemo<FollowingFeedCardItem[]>(() => {
    return followingFeedMock
      .filter((item) => followedBusinessIds.includes(String(item.businessId)))
      .map((item) => {
        const business = businesses.find(
          (entry) => String(entry.id) === String(item.businessId),
        );

        if (!business) {
          return null;
        }

        return {
          ...item,
          businessName: business.name,
          businessCategory: business.category,
          businessLocation: business.location,
          businessImage: business.image,
          businessRating: business.rating,
          businessDistanceKm: business.distanceKm,
          businessPriceLevel: business.priceLevel,
          recommendedBy: business.recommendedBy,
        };
      })
      .filter(Boolean) as FollowingFeedCardItem[];
  }, [businesses, followedBusinessIds]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const selectedDistanceKm =
      distance === "custom"
        ? Number(customDistance || 0)
        : distance === "nearby"
          ? 1
          : distance
            ? Number(distance)
            : null;

    const selectedRatingValue =
      rating && rating !== "custom" ? Number(rating) : null;

    return feedItems
      .filter((item) => item.type === activeTab)
      .filter((item) => {
        const businessRating = Number(item.businessRating ?? 0);
        const businessDistance = Number(item.businessDistanceKm ?? 0);

        const cuisineMatch =
          cuisines.length === 0 || cuisines.includes(item.businessCategory);

        const ratingMatch =
          selectedRatingValue === null || businessRating >= selectedRatingValue;

        const distanceMatch =
          selectedDistanceKm === null ||
          Number.isNaN(selectedDistanceKm) ||
          businessDistance <= selectedDistanceKm;

        return cuisineMatch && ratingMatch && distanceMatch;
      })
      .filter((item) => {
        if (!normalizedQuery) {
          return true;
        }

        return (
          item.businessName.toLowerCase().includes(normalizedQuery) ||
          item.businessCategory.toLowerCase().includes(normalizedQuery) ||
          item.businessLocation.toLowerCase().includes(normalizedQuery) ||
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        if (sort === "distance") {
          return (
            Number(a.businessDistanceKm ?? 0) -
            Number(b.businessDistanceKm ?? 0)
          );
        }

        if (sort === "rating") {
          return Number(b.businessRating ?? 0) - Number(a.businessRating ?? 0);
        }

        if (sort === "price_low") {
          return (
            Number(a.businessPriceLevel ?? 0) -
            Number(b.businessPriceLevel ?? 0)
          );
        }

        if (sort === "price_high") {
          return (
            Number(b.businessPriceLevel ?? 0) -
            Number(a.businessPriceLevel ?? 0)
          );
        }

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [
    feedItems,
    activeTab,
    searchQuery,
    sort,
    cuisines,
    rating,
    distance,
    customDistance,
  ]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    items: filteredItems,
    isLoading,
    isEmpty: !isLoading && filteredItems.length === 0,
    hasFollowedBusinesses: followedBusinessIds.length > 0,
  };
};
