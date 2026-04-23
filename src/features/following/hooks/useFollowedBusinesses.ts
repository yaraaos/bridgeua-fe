import { useMemo } from "react";
import { useBusinesses } from "@/src/features/businesses";
import { useFollowingStore } from "@/src/store/following.store";

export const useFollowedBusinesses = () => {
  const { businesses, isLoading } = useBusinesses();
  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds
  );

  const followedBusinesses = useMemo(() => {
    return businesses.filter((business) =>
      followedBusinessIds.includes(String(business.id))
    );
  }, [businesses, followedBusinessIds]);

  return {
    followedBusinesses,
    followedBusinessIds,
    isLoading,
    isEmpty: !isLoading && followedBusinesses.length === 0,
  };
};