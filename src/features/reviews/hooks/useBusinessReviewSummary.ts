import { useMemo } from "react";

import { businessDetailsMock } from "@/src/mocks/business-details.mock";
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

    const business = businessDetailsMock.find(
      (item) => String(item.id) === String(businessId),
    );

    const mockReviews =
      business?.reviews.map((review) => ({
        ...review,
        businessId,
      })) ?? [];

    const liveSubmittedReviews = submittedReviews.filter(
      (review) => String(review.businessId) === String(businessId),
    );

    const allReviews = [...liveSubmittedReviews, ...mockReviews];

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
