import { BookingStepper, BookingSummaryCard } from "@/src/components/bookings";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useCreateBooking } from "@/src/features/bookings/hooks/useCreateBooking";
import type { CreateBookingPayload } from "@/src/features/bookings/types/booking.types";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function BookingConfirmScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const params = useLocalSearchParams<{
    businessId?: string;
    serviceId?: string;
    serviceName?: string;
    specialistId?: string;
    date?: string;
    timeSlotId?: string;
    time?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    promotionId?: string;
    promoCode?: string;
  }>();

  const { business, isLoading } = useBusinessDetails(params.businessId);
  const { submitBooking, isCreating, error } = useCreateBooking();

  const selectedService = business?.services.find(
    (service) => service.id === params.serviceId,
  );

  const selectedSpecialist = business?.bookingSpecialists?.find(
    (specialist) => specialist.id === params.specialistId,
  );

  const specialistName =
    params.specialistId === "any"
      ? "Any specialist"
      : (selectedSpecialist?.name ?? "Selected specialist");

  const serviceName =
    params.serviceName ?? selectedService?.name ?? "Selected service";

  const price = selectedService?.priceFrom ?? "Price on request";

  const customerName = useMemo(() => {
    return [params.firstName, params.lastName].filter(Boolean).join(" ");
  }, [params.firstName, params.lastName]);

  const canConfirm =
    !!params.businessId &&
    !!params.serviceId &&
    !!params.specialistId &&
    !!params.date &&
    !!params.timeSlotId &&
    !!params.time &&
    !!params.firstName &&
    !!params.lastName &&
    !!params.phoneNumber;

  const handleConfirm = async () => {
    if (!canConfirm) return;

    const payload: CreateBookingPayload = {
      businessId: params.businessId!,
      serviceId: params.serviceId!,
      specialistId: params.specialistId!,
      date: params.date!,
      timeSlotId: params.timeSlotId!,
      time: params.time!,
      customer: {
        firstName: params.firstName!.trim(),
        lastName: params.lastName!.trim(),
        phoneNumber: params.phoneNumber!.trim(),
      },
      promotionId: params.promotionId,
      promoCode: params.promoCode,
    };

    const booking = await submitBooking(payload);

    if (!booking) return;

    router.replace("/profile/personal");
  };

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <AppScreen scroll style={styles.container}>
      <BookingStepper currentStep={5} />

      <View style={styles.header}>
        <AppText style={styles.title}>Confirm booking</AppText>
        <AppText style={styles.subtitle}>
          Review your appointment details before sending the booking request.
        </AppText>
      </View>

      <BookingSummaryCard
        businessName={business?.name ?? "Selected business"}
        serviceName={serviceName}
        specialistName={specialistName}
        date={params.date ?? "Date not selected"}
        time={params.time ?? "Time not selected"}
        price={price}
        customerName={customerName || "Customer"}
        phoneNumber={params.phoneNumber ?? "Phone not added"}
      />

      {!!error && (
        <View style={styles.errorBox}>
          <AppText style={styles.errorTitle}>Booking failed</AppText>
          <AppText style={styles.errorText}>{error}</AppText>
          <AppButton
            title="Retry"
            variant="secondary"
            disabled={!canConfirm || isCreating}
            onPress={handleConfirm}
          />
        </View>
      )}

      {!canConfirm && (
        <View style={styles.errorBox}>
          <AppText style={styles.errorTitle}>Missing booking details</AppText>
          <AppText style={styles.errorText}>
            Please go back and complete all booking steps.
          </AppText>
        </View>
      )}

      <AppButton
        title={isCreating ? "Confirming..." : "Confirm booking"}
        disabled={!canConfirm || isCreating}
        onPress={handleConfirm}
      />
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.xl,
      gap: spacing.lg,
    },
    header: {
      gap: spacing.xs,
    },
    title: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    errorBox: {
      gap: spacing.sm,
      padding: spacing.lg,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.error,
    },
    errorTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.error,
    },
    errorText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
    },
  });
}
