import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import type {
    Booking,
    BookingAvailabilityParams,
    BookingTimeSlot,
    CreateBookingPayload,
} from "../types/booking.types";

const USE_MOCK_BOOKING_RESPONSE = false;
const USE_MOCK_AVAILABILITY_RESPONSE = false;

const fallbackSlots: BookingTimeSlot[] = [
  { id: "09-00", time: "09:00", isAvailable: true },
  { id: "10-00", time: "10:00", isAvailable: true },
  { id: "11-00", time: "11:00", isAvailable: false },
  { id: "12-30", time: "12:30", isAvailable: true },
  { id: "14-00", time: "14:00", isAvailable: true },
  { id: "15-30", time: "15:30", isAvailable: false },
  { id: "17-00", time: "17:00", isAvailable: true },
  { id: "18-30", time: "18:30", isAvailable: true },
];

export const getBookingAvailability = async (
  params: BookingAvailabilityParams,
): Promise<BookingTimeSlot[]> => {
  if (USE_MOCK_AVAILABILITY_RESPONSE) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return fallbackSlots;
  }

  const query = new URLSearchParams({
    businessId: params.businessId,
    serviceId: params.serviceId,
    specialistId: params.specialistId,
    date: params.date,
  });

  const res = await apiClient.get<BookingTimeSlot[]>(
    `${ENDPOINTS.BOOKINGS_AVAILABILITY}?${query.toString()}`,
  );

  return res.data;
};

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
