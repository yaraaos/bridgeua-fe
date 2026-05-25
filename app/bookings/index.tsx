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
import { ScrollView, StyleSheet, View } from "react-native";

type BookingFilter = "active" | "past" | "cancelled";

const BOOKING_TABS: AppTabPillItem<BookingFilter>[] = [
  { label: "Active", value: "active" },
  { label: "Past", value: "past" },
  { label: "Cancelled", value: "cancelled" },
];

const ACTIVE_STATUSES: BookingStatus[] = ["pending", "confirmed", "active"];
const PAST_STATUSES: BookingStatus[] = ["completed", "past"];
const CANCELLED_STATUSES: BookingStatus[] = ["cancelled"];

export default function BookingsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [activeFilter, setActiveFilter] = useState<BookingFilter>("active");
  const bookings = useBookingsStore((state) => state.bookings);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (activeFilter === "active") {
        return ACTIVE_STATUSES.includes(booking.status);
      }

      if (activeFilter === "past") {
        return PAST_STATUSES.includes(booking.status);
      }

      return CANCELLED_STATUSES.includes(booking.status);
    });
  }, [activeFilter, bookings]);

  const emptyState = getEmptyState(activeFilter);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Bookings"
        titleSubtitle="Track your appointments and rebook specialists you liked."
        onBack={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppTabsPills
          tabs={BOOKING_TABS}
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
              <BookingListCard
                key={booking.id}
                booking={booking}
                showRebook={activeFilter === "past"}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function BookingListCard({
  booking,
  showRebook,
}: {
  booking: StoredBooking;
  showRebook: boolean;
}) {
  return (
    <BookingPreviewCard
      businessName={booking.businessName}
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
      onPressRebook={
        showRebook
          ? () =>
              router.push({
                pathname: "/bookings/choose-service",
                params: { businessId: booking.businessId },
              })
          : undefined
      }
    />
  );
}

function getEmptyState(filter: BookingFilter) {
  if (filter === "past") {
    return {
      title: "No past bookings yet",
      description:
        "After an appointment is completed, it will appear here so you can find the specialist again and rebook.",
    };
  }

  if (filter === "cancelled") {
    return {
      title: "No cancelled bookings",
      description: "Cancelled appointments will appear here.",
    };
  }

  return {
    title: "No active bookings",
    description: "Appointments booked through BridgeUA will appear here.",
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
