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
import { ScrollView, StyleSheet, View } from "react-native";

const fallbackBookingServices = [
  {
    id: "mock-service-1",
    name: "Consultation",
    duration: "30 min",
    priceFrom: "Free",
  },
  {
    id: "mock-service-2",
    name: "Standard appointment",
    duration: "60 min",
    priceFrom: "Price on request",
  },
];

export default function ChooseServiceScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { businessId, serviceId, promotionId, promoCode } =
    useLocalSearchParams<{
      businessId?: string;
      serviceId?: string;
      promotionId?: string;
      promoCode?: string;
    }>();

  const { business } = useBusinessDetails(businessId);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    serviceId ?? null,
  );

  const services = business?.services?.length
    ? business.services
    : fallbackBookingServices;

  const selectedService = services.find(
    (service) => service.id === selectedServiceId,
  );

  const handleNext = () => {
    if (!businessId || !selectedServiceId) return;

    router.push({
      pathname: "/bookings/choose-specialist",
      params: {
        businessId,
        serviceId: selectedServiceId,
        serviceName: selectedService?.name,
        promotionId,
        promoCode,
      },
    });
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <BookingStepper currentStep={1} />

        <View style={styles.header}>
          <AppText style={styles.title}>Choose service</AppText>
          <AppText style={styles.subtitle}>
            Select one service for your appointment.
          </AppText>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {services.map((service) => (
            <ServiceSelectionCard
              key={service.id}
              title={service.name}
              duration={service.duration ?? "Duration varies"}
              price={service.priceFrom ?? "Price on request"}
              isSelected={selectedServiceId === service.id}
              onPress={() => setSelectedServiceId(service.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Next"
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
