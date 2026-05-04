import { useState } from "react";
import { submitReview } from "../services/review.service";
import type { SubmitReviewPayload, Review } from "../types/review.types";

export const useSubmitReview = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    payload: SubmitReviewPayload,
  ): Promise<Review | null> => {
    try {
      setIsSubmitting(true);

      const review = await submitReview(payload);

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