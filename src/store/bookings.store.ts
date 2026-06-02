import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Booking, BookingStatus } from "@/src/features/bookings/types/booking.types";

export type StoredBooking = Booking & {
  businessName: string;
  serviceName: string;
  specialistName: string;
  price: string;
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
    (set) => ({
      bookings: [],

      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
        })),

      updateBookingStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            String(b.id) === String(id) ? { ...b, status } : b,
          ),
        })),

      clearBookings: () =>
        set({
          bookings: [],
        }),

      fetchBookings: async () => {
        const { apiClient } = await import("@/src/services/api/client");
        const res = await apiClient.get<{ success: boolean; data: any[] }>("/api/bookings/me");
        const bookings = ((res as any).data ?? []).map((b: any) => ({
          id: String(b.id),
          businessId: String(b.businessId),
          serviceId: String(b.serviceId),
          specialistId: b.professionalId ? String(b.professionalId) : "any",
          date: b.date,
          time: b.startTime,
          status: b.status,
          businessName: b.business?.name ?? "Business",
          serviceName: b.service?.name ?? "Service",
          specialistName: b.professional ? `${b.professional.firstName} ${b.professional.lastName}` : "Any specialist",
          price: b.service?.price ? `$${b.service.price}` : "Price on request",
          customer: { firstName: "", lastName: "", phoneNumber: "" },
        }));
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
