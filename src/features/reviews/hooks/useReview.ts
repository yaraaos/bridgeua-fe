import { useEffect, useState } from "react";
import { getReviews } from "../services/review.service";
import type { Review } from "../types/review.types";

type Params = {
  businessId: string;
  rating?: number;
};

export const useReviews = ({ businessId, rating }: Params) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const loadReviews = async (reset = false) => {
    try {
      setIsLoading(true);

      const nextPage = reset ? 1 : page;

      const res = await getReviews({
        businessId,
        page: nextPage,
        rating,
      });

      setReviews((prev) =>
        reset ? res.data : [...prev, ...res.data],
      );

      setHasMore(nextPage < res.totalPages);

      if (!reset) setPage((p) => p + 1);
      else setPage(2);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(true);
  }, [businessId, rating]);

  return {
    reviews,
    isLoading,
    hasMore,
    loadMore: () => loadReviews(false),
    refresh: () => loadReviews(true),
  };
};