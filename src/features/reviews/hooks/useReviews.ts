import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { getReviews } from "../services/review.service";
import type { Review, ReviewsSummary } from "../types/review.types";

type Params = {
  businessId?: string;
  rating?: number;
  limit?: number;
};

export const useReviews = ({ businessId, rating, limit = 1000 }: Params) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewsSummary | null>(null);
  const [page, setPage] = useState(1);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const loadReviews = useCallback(
    async (nextPage = 1) => {
      if (!businessId) {
        setReviews([]);
        setSummary(null);
        setReviewCount(0);
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const isFirstPage = nextPage === 1;

      try {
        if (isFirstPage) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await getReviews({
          businessId,
          page: nextPage,
          limit,
          rating,
        });

        setReviews((current) =>
          isFirstPage ? response.data : [...current, ...response.data],
        );
        setSummary(response.summary);
        setReviewCount(response.total);
        setPage(response.page);
        setHasMore(response.page < response.totalPages);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [businessId, limit, rating],
  );

  useEffect(() => {
    loadReviews(1);
  }, [loadReviews]);

  useFocusEffect(
    useCallback(() => {
      loadReviews(1);
    }, [loadReviews]),
  );

  return {
    reviews,
    summary,
    reviewCount,
    isLoading,
    isLoadingMore,
    hasMore,
    refresh: () => loadReviews(1),
    loadMore: () => {
      if (!hasMore || isLoadingMore) return;
      loadReviews(page + 1);
    },
  };
};
