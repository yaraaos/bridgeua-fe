import { BookingSummaryCard } from "@/src/components/bookings";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import { useBookingsStore } from "@/src/store/bookings.store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

type ApiBooking = {
  id: string | number;
  date: string;
  startTime: string;
  status: string;
  service?: { name: string; price?: number };
  professional?: { name: string };
  business?: { name: string };
  user?: {
    profile?: { firstName?: string; lastName?: string };
    email?: string;
  };
};

export default function BookingDetailsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();

  const storedBooking = useBookingsStore((state) =>
    state.bookings.find((item) => String(item.id) === String(bookingId)),
  );
  const updateBookingStatus = useBookingsStore((state) => state.updateBookingStatus);

  const [apiBooking, setApiBooking] = useState<ApiBooking | null>(null);
  const [isLoading, setIsLoading] = useState(!storedBooking);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (storedBooking || !bookingId) {
      setIsLoading(false);
      return;
    }

    void apiClient
      .get<ApiBooking>(ENDPOINTS.BOOKINGS_ME)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [res.data];
        const found = list.find((b) => String(b.id) === String(bookingId));
        setApiBooking(found ?? null);
      })
      .catch(() => setApiBooking(null))
      .finally(() => setIsLoading(false));
  }, [bookingId, storedBooking]);

  const handleCancel = () => {
    Alert.alert(
      "Cancel booking",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, cancel",
          style: "destructive",
          onPress: async () => {
            setIsCancelling(true);
            try {
              await apiClient.patch(ENDPOINTS.BOOKING_STATUS(String(bookingId)), {
                status: "cancelled",
              });

              // Update local store if booking is there
              if (storedBooking) {
                updateBookingStatus(String(bookingId), "cancelled");
              }

              // Update local API booking state
              if (apiBooking) {
                setApiBooking({ ...apiBooking, status: "cancelled" });
              }

              Alert.alert("Cancelled", "Your booking has been cancelled.", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch {
              Alert.alert("Error", "Could not cancel the booking. Please try again.");
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ],
    );
  };

  const currentStatus = storedBooking?.status ?? apiBooking?.status;
  const canCancel = currentStatus === "pending" || currentStatus === "confirmed";

  if (isLoading) {
    return (
      <View style={[styles.safeArea, { alignItems: "center", justifyContent: "center" }]}>
        <AppLoader />
      </View>
    );
  }

  if (storedBooking) {
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
            businessName={storedBooking.businessName}
            serviceName={storedBooking.serviceName}
            specialistName={storedBooking.specialistName}
            date={storedBooking.date}
            time={storedBooking.time}
            price={storedBooking.price}
            customerName={storedBooking.customer ? `${storedBooking.customer.firstName} ${storedBooking.customer.lastName}` : ""}
            phoneNumber={storedBooking.customer?.phoneNumber ?? ""}
            status={storedBooking.status}
            originalPrice={storedBooking.originalPrice}
            discountPercentage={storedBooking.discountPercentage}
            discountAmount={storedBooking.discountAmount}
            finalPrice={storedBooking.finalPrice}
          />

          {canCancel && (
            <AppButton
              title={isCancelling ? "Cancelling..." : "Cancel booking"}
              variant="secondary"
              disabled={isCancelling}
              onPress={handleCancel}
            />
          )}
        </ScrollView>
      </View>
    );
  }

  if (apiBooking) {
    const customerName = apiBooking.user?.profile
      ? [apiBooking.user.profile.firstName, apiBooking.user.profile.lastName]
          .filter(Boolean)
          .join(" ")
      : apiBooking.user?.email ?? "Client";

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
            businessName={apiBooking.business?.name ?? "Business"}
            serviceName={apiBooking.service?.name ?? "Service"}
            specialistName={apiBooking.professional?.name ?? "Any specialist"}
            date={apiBooking.date}
            time={apiBooking.startTime?.slice(0, 5) ?? ""}
            price={apiBooking.service?.price ? `$${apiBooking.service.price}` : "Price on request"}
            customerName={customerName}
            phoneNumber=""
            status={apiBooking.status as any}
          />

          {canCancel && (
            <AppButton
              title={isCancelling ? "Cancelling..." : "Cancel booking"}
              variant="secondary"
              disabled={isCancelling}
              onPress={handleCancel}
            />
          )}
        </ScrollView>
      </View>
    );
  }

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
      gap: spacing.lg,
    },
  });
}
