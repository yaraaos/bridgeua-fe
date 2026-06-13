import { BookingPreviewCard } from "@/src/components/bookings";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppTabsPills, {
    AppTabPillItem,
} from "@/src/components/ui/AppTabsPills/AppTabsPills";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { StoredBooking } from "@/src/store/bookings.store";
import { useBookingsStore } from "@/src/store/bookings.store";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

type BookingFilter = "active" | "past" | "cancelled";

export default function BookingsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const BOOKING_TABS: AppTabPillItem<BookingFilter>[] = [
    { label: t("bookings.tabActive"), value: "active" },
    { label: t("bookings.tabPast"), value: "past" },
    { label: t("bookings.tabCancelled"), value: "cancelled" },
  ];

  const [activeFilter, setActiveFilter] = useState<BookingFilter>("active");
  const bookings = useBookingsStore((state) => state.bookings);
  const fetchBookings = useBookingsStore((state) => state.fetchBookings);

  useFocusEffect(
    useCallback(() => {
      void fetchBookings();
    }, [fetchBookings])
  );

  const filteredBookings = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter((booking) => {
      if (activeFilter === "active") {
        return ["pending", "confirmed"].includes(booking.status) && booking.date >= today;
      }
      if (activeFilter === "past") {
        return booking.status === "completed" || (["pending", "confirmed"].includes(booking.status) && booking.date < today);
      }
      return booking.status === "cancelled";
    });
  }, [activeFilter, bookings]);

  const emptyState = useMemo(() => {
    if (activeFilter === "past") {
      return { title: t("bookings.emptyPast"), description: t("bookings.emptyPastDesc") };
    }
    if (activeFilter === "cancelled") {
      return { title: t("bookings.emptyCancelled"), description: t("bookings.emptyCancelledDesc") };
    }
    return { title: t("bookings.emptyActive"), description: t("bookings.emptyActiveDesc") };
  }, [activeFilter, t]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t("bookings.title")}
        titleSubtitle={t("bookings.subtitle")}
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
      isPast={showRebook}
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
