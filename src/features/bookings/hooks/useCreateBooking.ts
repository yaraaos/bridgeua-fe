import { useState } from "react";
import { ApiError, parseApiError } from "@/src/services/api/types";
import { createBooking } from "../services/booking.service";
import type { Booking, CreateBookingPayload } from "../types/booking.types";

export const useCreateBooking = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const submitBooking = async (
    payload: CreateBookingPayload,
  ): Promise<Booking | null> => {
    try {
      setIsCreating(true);
      setError(null);

      return await createBooking(payload);
    } catch (e) {
      setError(parseApiError(e));
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    submitBooking,
    isCreating,
    error,
  };
};