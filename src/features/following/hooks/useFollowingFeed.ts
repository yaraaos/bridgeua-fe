import { useEffect, useMemo, useState } from "react";

import { useBusinesses } from "@/src/features/businesses";
import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import { useFilterStore } from "@/src/store/filter.store";
import { useFollowingStore } from "@/src/store/following.store";
import {
  FollowingFeedCardItem,
  FollowingFeedType,
} from "../types/following.types";

type UseFollowingFeedParams = {
  visibleBusinessIds?: string[];
  state?: string;
};

export const useFollowingFeed = ({
  visibleBusinessIds,
  state,
}: UseFollowingFeedParams = {}) => {
  const { businesses, isLoading } = useBusinesses();

  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );

  const feedBusinessIds = visibleBusinessIds ?? followedBusinessIds.map(String);

  const { category, sort, cuisines, rating, distance } =
    useFilterStore((state) => state.followingFilters);

  const [activeTab, setActiveTab] = useState<FollowingFeedType>("promotion");
  const [searchQuery, setSearchQuery] = useState("");

  const [apiFeedItems, setApiFeedItems] = useState<FollowingFeedCardItem[]>([]);

  useEffect(() => {
    if (followedBusinessIds.length === 0) {
      setApiFeedItems([]);
      return;
    }

    const followedIds = followedBusinessIds.map(String);

    const stateQuery = state ? `?state=${encodeURIComponent(state)}` : '';
    void Promise.all([
      apiClient.get(`/api/promotions/public${stateQuery}`).catch(() => ({ data: [] })),
      apiClient.get(`/api/news/public${stateQuery}`).catch(() => ({ data: [] })),
    ]).then(([promoRes, newsRes]) => {
      const promos = ((promoRes.data as any).data ?? promoRes.data) as any[];
      const news = ((newsRes.data as any).data ?? newsRes.data) as any[];

      const promoItems: FollowingFeedCardItem[] = promos
        .filter((p) => followedIds.includes(String(p.businessId)))
        .map((p) => ({
          id: String(p.id),
          businessId: String(p.businessId),
          type: "promotion" as const,
          promotionId: String(p.id),
          title: p.title,
          description: p.subtitle ?? p.description ?? "",
          createdAt: p.startsAt ?? p.createdAt ?? new Date().toISOString(),
          businessName: p.business?.name ?? "",
          businessCategory:
            p.business?.category?.name ?? p.business?.category ?? "",
          businessLocation: p.business?.city ?? "",
          businessImage: p.business?.avatarUrl
            ? p.business.avatarUrl.startsWith("http")
              ? p.business.avatarUrl
              : `${API_BASE_URL}${p.business.avatarUrl}`
            : "",
          businessRating: 0,
          businessDistanceKm: 0,
          distanceKm: 0,
          recommendedByPreview: [],
          recommendedByCount: 0,
          status: p.status,
          businessCuisine: (p.business as any)?.cuisine ?? "",
        }));

      const newsItems: FollowingFeedCardItem[] = news
        .filter((n) => followedIds.includes(String(n.businessId)))
        .map((n) => ({
          id: String(n.id),
          businessId: String(n.businessId),
          type: "news" as const,
          newsId: String(n.id),
          title: n.title,
          description: n.subtitle ?? n.description ?? "",
          createdAt: n.publishedAt ?? n.createdAt ?? new Date().toISOString(),
          businessName: n.business?.name ?? "",
          businessCategory:
            n.business?.category?.name ?? n.business?.category ?? "",
          businessLocation: n.business?.city ?? "",
          businessImage: n.business?.avatarUrl
            ? n.business.avatarUrl.startsWith("http")
              ? n.business.avatarUrl
              : `${API_BASE_URL}${n.business.avatarUrl}`
            : "",
          businessRating: 0,
          businessDistanceKm: 0,
          distanceKm: 0,
          recommendedByPreview: [],
          recommendedByCount: 0,
          status: n.status,
          businessCuisine: (n.business as any)?.cuisine ?? "",
        }));

      setApiFeedItems([...promoItems, ...newsItems]);
    });
  }, [followedBusinessIds, state]);

  const feedItems = apiFeedItems;

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const selectedDistanceKm =
      distance === "nearby"
        ? 1
        : distance
          ? Number(distance)
          : null;

    const selectedRatingValue = rating ? Number(rating) : null;

    return feedItems
      .filter((item) => item.type === activeTab)
      .filter((item) => {
        const businessRating = Number(item.businessRating ?? 0);
        const businessDistance = Number(item.businessDistanceKm ?? 0);

        const cuisineMatch =
          cuisines.length === 0 ||
          cuisines.includes(item.businessCuisine ?? "") ||
          cuisines.includes(item.businessCategory);

        const categoryMatch =
          !category ||
          (category === "Food"
            ? cuisines.length > 0
              ? cuisines.includes(item.businessCuisine ?? "") || item.businessCategory === "Food"
              : item.businessCategory === "Food" || [
                  "American", "Chinese", "Italian", "Japanese",
                  "Mediterranean", "Mexican", "Ukrainian", "Vegan",
                ].includes(item.businessCategory)
            : item.businessCategory === category);

        const ratingMatch =
          selectedRatingValue === null || businessRating >= selectedRatingValue;

        const distanceMatch =
          selectedDistanceKm === null ||
          Number.isNaN(selectedDistanceKm) ||
          businessDistance <= selectedDistanceKm;

        return categoryMatch && cuisineMatch && ratingMatch && distanceMatch;
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
    category,
    cuisines,
    rating,
    distance,
  ]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    items: filteredItems,
    isLoading,
    isEmpty: !isLoading && filteredItems.length === 0,
    hasFollowedBusinesses: feedBusinessIds.length > 0,
  };
};
