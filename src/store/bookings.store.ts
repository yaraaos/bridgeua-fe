import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  Booking,
  BookingStatus,
} from "@/src/features/bookings/types/booking.types";

export type StoredBooking = Booking & {
  businessName: string;
  serviceName: string;
  specialistName: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  discountAmount?: string;
  finalPrice?: string;
};

type BookingsState = {
  bookings: StoredBooking[];
  addBooking: (booking: StoredBooking) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  clearBookings: () => void;
  fetchBookings: () => Promise<void>;
};

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
        })),

      updateBookingStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            String(booking.id) === String(id)
              ? { ...booking, status }
              : booking,
          ),
        })),

      clearBookings: () =>
        set({
          bookings: [],
        }),

      fetchBookings: async () => {
        const { apiClient } = await import("@/src/services/api/client");

        let res: { data: any };
        try {
          res = await apiClient.get<{ success: boolean; data: any[] }>(
            "/api/bookings/me",
          );
        } catch {
          return;
        }

        const existing = get().bookings;

        const bookings = ((res as any).data ?? []).map((booking: any) => {
          const existingBooking = existing.find(
            (item: StoredBooking) => String(item.id) === String(booking.id),
          );

          const specialistId = booking.professionalId
            ? String(booking.professionalId)
            : "";

          return {
            id: String(booking.id),
            businessId: String(booking.businessId),
            serviceId: String(booking.serviceId),
            specialistId,
            date: booking.date,
            time: booking.startTime,
            status: booking.status,
            businessName: booking.business?.name ?? "Business",
            serviceName: booking.service?.name ?? "Service",
            specialistName: booking.professional
              ? `${booking.professional.firstName} ${booking.professional.lastName}`.trim()
              : "Selected specialist",
            price: booking.service?.price
              ? `$${booking.service.price}`
              : "Price on request",
            customer: existingBooking?.customer ?? {
              firstName: "",
              lastName: "",
              phoneNumber: "",
            },
            originalPrice: existingBooking?.originalPrice,
            discountPercentage: existingBooking?.discountPercentage,
            discountAmount: existingBooking?.discountAmount,
            finalPrice: existingBooking?.finalPrice,
          };
        });

        set({ bookings });
      },
    }),
    {
      name: "bookings-storage-v2",
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
