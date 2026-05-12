import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { submitReview } from "../services/review.service";
import type { Review, SubmitReviewPayload } from "../types/review.types";

export const useSubmitReview = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const handleSubmit = async (
    payload: SubmitReviewPayload,
  ): Promise<Review | null> => {
    try {
      setIsSubmitting(true);

      const review = await submitReview(payload);

      await queryClient.invalidateQueries({
        queryKey: ["reviews", payload.businessId],
      });

      return review;
    } catch (e) {
      console.error("Submit review failed", e);

      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submit: handleSubmit,
    isSubmitting,
  };
};
