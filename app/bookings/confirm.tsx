import { BookingStepper, BookingSummaryCard } from "@/src/components/bookings";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useBookingFlow } from "@/src/features/bookings/hooks/useBookingFlow";
import { useCreateBooking } from "@/src/features/bookings/hooks/useCreateBooking";
import type { CreateBookingPayload } from "@/src/features/bookings/types/booking.types";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useBookingsStore } from "@/src/store/bookings.store";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function BookingConfirmScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const { params, canCreateBooking } = useBookingFlow();

  const { business } = useBusinessDetails(params.businessId);
  const { submitBooking, isCreating, error } = useCreateBooking();
  const addBooking = useBookingsStore((state) => state.addBooking);

  const selectedService = business?.services.find(
    (service) =>
      service.serviceId === params.serviceId || service.id === params.serviceId,
  );

  const specialistName = params.specialistName ?? t("bookings.fallbackSpecialist");

  const serviceName =
    params.serviceName ?? selectedService?.name ?? t("bookings.fallbackService");

  const price = params.price ?? t("bookings.priceOnRequest");

  const servicePrice = selectedService?.price ?? null;
  const discountPercentage = params.discountLabel
    ? parseFloat(params.discountLabel)
    : null;

  const discountAmount =
    servicePrice != null && discountPercentage != null && discountPercentage > 0
      ? servicePrice * (discountPercentage / 100)
      : null;

  const finalPrice =
    servicePrice != null && discountAmount != null
      ? servicePrice - discountAmount
      : null;

  const originalPriceDisplay =
    servicePrice != null ? `$${servicePrice.toFixed(2)}` : undefined;
  const discountAmountDisplay =
    discountAmount != null ? `$${discountAmount.toFixed(2)}` : undefined;
  const finalPriceDisplay =
    finalPrice != null ? `$${finalPrice.toFixed(2)}` : undefined;

  const customerName = useMemo(() => {
    return [params.firstName, params.lastName].filter(Boolean).join(" ");
  }, [params.firstName, params.lastName]);

  const handleConfirm = async () => {
    if (!canCreateBooking || isCreating) return;
    if (!params.specialistId || params.specialistId === "any") return;

    const payload: CreateBookingPayload = {
      businessId: params.businessId!,
      serviceId: params.serviceId!,
      specialistId: params.specialistId,
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

    addBooking({
      ...booking,
      time: (booking as any).startTime ?? payload.time,
      date: (booking as any).date ?? payload.date,
      customer: payload.customer,
      businessId: payload.businessId,
      serviceId: payload.serviceId,
      specialistId: payload.specialistId,
      businessName: business?.name ?? t("bookings.fallbackBusiness"),
      serviceName,
      specialistName,
      price,
      originalPrice: originalPriceDisplay,
      discountPercentage: discountPercentage ?? undefined,
      discountAmount: discountAmountDisplay,
      finalPrice: finalPriceDisplay,
    });

    router.dismissAll();
    router.replace("/(tabs)/profile");
  };

  return (
    <AppScreen scroll style={styles.container}>
      <BookingStepper currentStep={5} />

      <View style={styles.header}>
        <AppText style={styles.title}>{t("bookings.confirmTitle")}</AppText>
        <AppText style={styles.subtitle}>
          {t("bookings.confirmSubtitle")}
        </AppText>
      </View>

      <BookingSummaryCard
        businessName={business?.name ?? t("bookings.fallbackBusiness")}
        serviceName={serviceName}
        specialistName={specialistName}
        date={params.date ?? t("bookings.fallbackDateNotSelected")}
        time={params.time ?? t("bookings.fallbackTimeNotSelected")}
        price={price}
        customerName={customerName || t("bookings.fallbackCustomer")}
        phoneNumber={params.phoneNumber ?? t("bookings.fallbackPhoneNotAdded")}
        originalPrice={originalPriceDisplay}
        discountPercentage={discountPercentage ?? undefined}
        discountAmount={discountAmountDisplay}
        finalPrice={finalPriceDisplay}
      />

      {!!error && (
        <View style={styles.errorBox}>
          <AppText style={styles.errorTitle}>
            {error.isNetworkError ? t("home.errorNoInternet") : t("bookings.bookingFailed")}
          </AppText>
          <AppText style={styles.errorText}>
            {error.isNetworkError
              ? t("home.errorNoInternetDesc")
              : error.message}
          </AppText>
          <AppButton
            title={t("bookings.retryButton")}
            variant="secondary"
            disabled={!canCreateBooking || isCreating}
            onPress={handleConfirm}
          />
        </View>
      )}

      {!canCreateBooking && (
        <View style={styles.errorBox}>
          <AppText style={styles.errorTitle}>{t("bookings.missingDetailsTitle")}</AppText>
          <AppText style={styles.errorText}>
            {t("bookings.missingDetailsDesc")}
          </AppText>
        </View>
      )}

      {params.specialistId === "any" && (
        <View style={styles.errorBox}>
          <AppText style={styles.errorTitle}>{t("bookings.selectSpecialistTitle")}</AppText>
          <AppText style={styles.errorText}>
            {t("bookings.selectSpecialistDesc")}
          </AppText>
        </View>
      )}

      <AppButton
        title={isCreating ? t("bookings.confirmingButton") : t("bookings.confirmButton")}
        disabled={
          !canCreateBooking || isCreating || params.specialistId === "any"
        }
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
