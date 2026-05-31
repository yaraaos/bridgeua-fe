import { useMemo } from "react";

import { useReviewsStore } from "@/src/store/reviews.store";

type Params = {
  businessId?: string;
  fallbackRating?: number;
  fallbackReviewCount?: number;
};

export function useBusinessReviewSummary({
  businessId,
  fallbackRating = 0,
  fallbackReviewCount = 0,
}: Params) {
  const submittedReviews = useReviewsStore((state) => state.submittedReviews);

  return useMemo(() => {
    if (!businessId) {
      return {
        rating: fallbackRating,
        reviewCount: fallbackReviewCount,
      };
    }

    const allReviews = submittedReviews.filter(
      (review) => String(review.businessId) === String(businessId),
    );

    if (allReviews.length === 0) {
      return {
        rating: fallbackRating,
        reviewCount: fallbackReviewCount,
      };
    }

    const averageRating =
      allReviews.reduce((sum, review) => sum + review.rating, 0) /
      allReviews.length;

    return {
      rating: averageRating,
      reviewCount: allReviews.length,
    };
  }, [businessId, fallbackRating, fallbackReviewCount, submittedReviews]);
}
