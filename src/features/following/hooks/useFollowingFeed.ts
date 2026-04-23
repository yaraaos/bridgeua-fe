import { useMemo, useState } from "react";
import { useBusinesses } from "@/src/features/businesses";
import { followingFeedMock } from "@/src/mocks/following-feed.mock";
import { useFollowingStore } from "@/src/store/following.store";
import {
  FollowingFeedCardItem,
  FollowingFeedType,
} from "../types/following.types";

export const useFollowingFeed = () => {
  const { businesses, isLoading } = useBusinesses();
  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds
  );

  const [activeTab, setActiveTab] = useState<FollowingFeedType>("promotion");
  const [searchQuery, setSearchQuery] = useState("");

  const feedItems = useMemo<FollowingFeedCardItem[]>(() => {
    return followingFeedMock
      .filter((item) => followedBusinessIds.includes(String(item.businessId)))
      .map((item) => {
        const business = businesses.find(
          (entry) => String(entry.id) === String(item.businessId)
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
          recommendedBy: business.recommendedBy,
        };
      })
      .filter(Boolean) as FollowingFeedCardItem[];
  }, [businesses, followedBusinessIds]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return feedItems
      .filter((item) => item.type === activeTab)
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
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [feedItems, activeTab, searchQuery]);

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