import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { submitReview, uploadReviewPhoto } from "../services/review.service";
import type { Review, SubmitReviewPayload } from "../types/review.types";

export const useSubmitReview = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const handleSubmit = async (
    payload: SubmitReviewPayload,
  ): Promise<{ review: Review | null; error: string | null }> => {
    try {
      setIsSubmitting(true);

      const review = await submitReview(payload);

      if (payload.photos?.length && review?.id) {
        for (const uri of payload.photos) {
          await uploadReviewPhoto(payload.businessId, review.id, uri);
        }
      }

      await queryClient.invalidateQueries({
        queryKey: ["reviews", payload.businessId],
      });

      return { review, error: null };
    } catch (e) {
      console.error("Submit review failed", e);
      const error = e instanceof Error ? e.message : "Failed to submit review";
      return { review: null, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submit: handleSubmit,
    isSubmitting,
  };
};
