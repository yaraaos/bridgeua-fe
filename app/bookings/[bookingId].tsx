import { BookingSummaryCard } from "@/src/components/bookings";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useBookingsStore } from "@/src/store/bookings.store";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function BookingDetailsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();

  const booking = useBookingsStore((state) =>
    state.upcomingBookings.find((item) => item.id === bookingId),
  );

  if (!booking) {
    return (
      <View style={styles.safeArea}>
        <ScreenHeader
          title="Appointment details"
          titleSubtitle="This booking may have been cancelled or removed."
          onBack={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScreenHeader
        title="Appointment details"
        titleSubtitle="Review the details of your upcoming booking."
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BookingSummaryCard
          businessName={booking.businessName}
          serviceName={booking.serviceName}
          specialistName={booking.specialistName}
          date={booking.date}
          time={booking.time}
          price={booking.price}
          customerName={`${booking.customer.firstName} ${booking.customer.lastName}`}
          phoneNumber={booking.customer.phoneNumber}
          status={booking.status}
        />
      </ScrollView>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
    },
  });
}
