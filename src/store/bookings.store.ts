import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Booking } from "@/src/features/bookings/types/booking.types";

export type UpcomingBooking = Booking & {
  businessName: string;
  serviceName: string;
  specialistName: string;
  price: string;
};

type BookingsState = {
  upcomingBookings: UpcomingBooking[];
  addUpcomingBooking: (booking: UpcomingBooking) => void;
  clearBookings: () => void;
};

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set) => ({
      upcomingBookings: [],

      addUpcomingBooking: (booking) =>
        set((state) => ({
          upcomingBookings: [booking, ...state.upcomingBookings],
        })),

      clearBookings: () =>
        set({
          upcomingBookings: [],
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
