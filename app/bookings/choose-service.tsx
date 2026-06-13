import {
  BookingStepper,
  ServiceSelectionCard,
} from "@/src/components/bookings";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ChooseServiceScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const { businessId, serviceId, promotionId, promoCode, discountLabel } =
    useLocalSearchParams<{
      businessId?: string;
      serviceId?: string;
      promotionId?: string;
      promoCode?: string;
      discountLabel?: string;
    }>();

  const { business, isLoading } = useBusinessDetails(businessId);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    serviceId ?? null,
  );

  const services = business?.services ?? [];

  const selectedService = services.find(
    (service) => service.id === selectedServiceId,
  );

  const handleNext = () => {
    if (!businessId || !selectedServiceId) return;

    router.push({
      pathname: "/bookings/choose-specialist",
      params: {
        businessId,
        serviceId: selectedService?.serviceId ?? selectedServiceId,
        serviceName: selectedService?.name,
        price: selectedService?.priceFrom ?? (selectedService as any)?.price ?? t("bookings.priceOnRequest"),
        promotionId,
        promoCode,
        discountLabel,
      },
    });
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <BookingStepper currentStep={1} />

        <View style={styles.header}>
          <AppText style={styles.title}>{t("bookings.chooseServiceTitle")}</AppText>
          <AppText style={styles.subtitle}>
            {t("bookings.chooseServiceSubtitle")}
          </AppText>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <AppText style={styles.emptyText}>{t("bookings.chooseServiceLoading")}</AppText>
          ) : services.length === 0 ? (
            <AppText style={styles.emptyText}>
              {t("bookings.chooseServiceEmpty")}
            </AppText>
          ) : (
            services.map((service) => (
              <ServiceSelectionCard
                key={service.id}
                title={service.name}
                duration={service.duration ?? t("bookings.durationVaries")}
                price={service.priceFrom ?? t("bookings.priceOnRequest")}
                isSelected={selectedServiceId === service.id}
                onPress={() => setSelectedServiceId(service.id)}
              />
            ))
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <AppButton
          title={t("bookings.nextButton")}
          disabled={!selectedServiceId}
          onPress={handleNext}
        />
      </View>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      gap: spacing.lg,
    },
    scroll: {
      flex: 1,
    },
    list: {
      gap: spacing.cardGap,
      paddingBottom: spacing.lg,
    },
    footer: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
      backgroundColor: colors.background,
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
    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
    },
  });
}
