import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Booking } from "@/src/features/bookings/types/booking.types";

export type StoredBooking = Booking & {
  businessName: string;
  serviceName: string;
  specialistName: string;
  price: string;
};

type BookingsState = {
  bookings: StoredBooking[];
  addBooking: (booking: StoredBooking) => void;
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

      clearBookings: () =>
        set({
          bookings: [],
        }),
    }),
    {
      name: "bookings-storage",
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
