import { BookingPreviewCard } from "@/src/components/bookings";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppTabsPills, {
    AppTabPillItem,
} from "@/src/components/ui/AppTabsPills/AppTabsPills";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import type { BookingStatus } from "@/src/features/bookings/types/booking.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { StoredBooking } from "@/src/store/bookings.store";
import { useBookingsStore } from "@/src/store/bookings.store";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

type BusinessBookingFilter = "upcoming" | "past" | "cancelled";

type BusinessBooking = StoredBooking & {
  clientName: string;
};

const BUSINESS_BOOKING_TABS: AppTabPillItem<BusinessBookingFilter>[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
  { label: "Cancelled", value: "cancelled" },
];

const UPCOMING_STATUSES: BookingStatus[] = ["pending", "confirmed", "active"];
const PAST_STATUSES: BookingStatus[] = ["completed", "past"];
const CANCELLED_STATUSES: BookingStatus[] = ["cancelled"];

const mockBusinessBookings: BusinessBooking[] = [
  {
    id: "business-booking-1",
    businessId: "1",
    serviceId: "service-1",
    specialistId: "specialist-1",
    date: "2026-05-29",
    timeSlotId: "slot-1",
    time: "14:00",
    customer: {
      firstName: "Oleg",
      lastName: "Novak",
      phoneNumber: "+1 555 0101",
    },
    status: "confirmed",
    createdAt: "2026-05-20T10:00:00.000Z",
    businessName: "Your Business",
    serviceName: "Manicure",
    specialistName: "Any specialist",
    price: "Price on request",
    clientName: "Oleg Novak",
  },
  {
    id: "business-booking-2",
    businessId: "1",
    serviceId: "service-2",
    specialistId: "specialist-2",
    date: "2026-05-29",
    timeSlotId: "slot-2",
    time: "17:00",
    customer: {
      firstName: "Olena",
      lastName: "Chris",
      phoneNumber: "+1 555 0102",
    },
    status: "confirmed",
    createdAt: "2026-05-21T12:00:00.000Z",
    businessName: "Your Business",
    serviceName: "Manicure",
    specialistName: "Olena Chris",
    price: "Price on request",
    clientName: "Olena Chris",
  },
  {
    id: "business-booking-3",
    businessId: "1",
    serviceId: "service-3",
    specialistId: "specialist-3",
    date: "2026-05-30",
    timeSlotId: "slot-3",
    time: "11:00",
    customer: {
      firstName: "Kyril",
      lastName: "Novak",
      phoneNumber: "+1 555 0103",
    },
    status: "pending",
    createdAt: "2026-05-22T09:00:00.000Z",
    businessName: "Your Business",
    serviceName: "Manicure",
    specialistName: "Kyril Novak",
    price: "Price on request",
    clientName: "Kyril Novak",
  },
];

export default function BusinessBookingsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [activeFilter, setActiveFilter] =
    useState<BusinessBookingFilter>("upcoming");
  const [refreshing, setRefreshing] = useState(false);

  const storedBookings = useBookingsStore((state) => state.bookings);

  const businessBookings = useMemo<BusinessBooking[]>(() => {
    const storedBusinessBookings = storedBookings.map((booking) => ({
      ...booking,
      clientName:
        `${booking.customer.firstName} ${booking.customer.lastName}`.trim(),
    }));

    return [...storedBusinessBookings, ...mockBusinessBookings];
  }, [storedBookings]);

  const filteredBookings = useMemo(() => {
    return businessBookings.filter((booking) => {
      if (activeFilter === "upcoming") {
        return UPCOMING_STATUSES.includes(booking.status);
      }

      if (activeFilter === "past") {
        return PAST_STATUSES.includes(booking.status);
      }

      return CANCELLED_STATUSES.includes(booking.status);
    });
  }, [activeFilter, businessBookings]);

  const emptyState = getEmptyState(activeFilter);

  const handleRefresh = () => {
    setRefreshing(true);

    // BE-ready: later replace this local refresh with business bookings refetch.
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Bookings"
        titleSubtitle="Manage upcoming and past bookings for your business."
        onBack={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <AppTabsPills
          tabs={BUSINESS_BOOKING_TABS}
          activeTab={activeFilter}
          onChange={setActiveFilter}
        />

        {filteredBookings.length === 0 ? (
          <View style={styles.emptyWrap}>
            <AppEmptyState
              title={emptyState.title}
              description={emptyState.description}
            />
          </View>
        ) : (
          <View style={styles.list}>
            {filteredBookings.map((booking) => (
              <BookingPreviewCard
                key={booking.id}
                businessName={booking.clientName}
                serviceName={booking.serviceName}
                specialistName={booking.specialistName}
                date={booking.date}
                time={booking.time}
                price={booking.price}
                status={booking.status}
                onPress={() =>
                  router.push({
                    pathname: "/bookings/[bookingId]",
                    params: { bookingId: booking.id },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function getEmptyState(filter: BusinessBookingFilter) {
  if (filter === "past") {
    return {
      title: "No past bookings yet",
      description:
        "Completed business bookings will appear here after appointments are finished.",
    };
  }

  if (filter === "cancelled") {
    return {
      title: "No cancelled bookings",
      description: "Cancelled customer bookings will appear here.",
    };
  }

  return {
    title: "No upcoming bookings",
    description:
      "New customer bookings will appear here once clients book your services.",
  };
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.lg,
    },

    list: {
      gap: spacing.cardGap,
    },

    emptyWrap: {
      paddingTop: spacing.xl,
    },
  });
}
