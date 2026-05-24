import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import type {
  Booking,
  CreateBookingPayload,
} from "../types/booking.types";

const USE_MOCK_BOOKING_RESPONSE = true;

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<Booking> => {
  if (USE_MOCK_BOOKING_RESPONSE) {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      ...payload,
      id: `mock-booking-${Date.now()}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
  }

  const res = await apiClient.post<Booking>(ENDPOINTS.BOOKINGS, payload);
  return res.data;
};
