import { useState } from "react";
import { createBooking } from "../services/booking.service";
import type {
  Booking,
  CreateBookingPayload,
} from "../types/booking.types";

export const useCreateBooking = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBooking = async (
    payload: CreateBookingPayload,
  ): Promise<Booking | null> => {
    try {
      setIsCreating(true);
      setError(null);

      return await createBooking(payload);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to create booking.";
      setError(message);
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
