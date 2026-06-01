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
