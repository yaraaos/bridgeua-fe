import { BookingStepper, SpecialistCard } from "@/src/components/bookings";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ChooseSpecialistScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { businessId, serviceId, serviceName, promotionId, promoCode } =
    useLocalSearchParams<{
      businessId?: string;
      serviceId?: string;
      serviceName?: string;
      promotionId?: string;
      promoCode?: string;
    }>();

  const { business } = useBusinessDetails(businessId);

  const handleSelectSpecialist = (specialistId: string) => {
    if (!businessId || !serviceId) return;

    router.push({
      pathname: "/bookings/choose-date",
      params: {
        businessId,
        serviceId,
        serviceName,
        specialistId,
        promotionId,
        promoCode,
      },
    });
  };

  return (
    <AppScreen scroll style={styles.container}>
      <BookingStepper currentStep={2} />

      <View style={styles.header}>
        <AppText style={styles.title}>Choose specialist</AppText>
        <AppText style={styles.subtitle}>
          Pick a specialist or let the business assign anyone available.
        </AppText>
      </View>

      <View style={styles.list}>
        <SpecialistCard
          name="Any specialist"
          role="First available professional"
          rating={business?.rating ?? 5}
          reviewsCount={business?.reviewCount ?? 0}
          description="Recommended if you want the earliest available time."
          badgeText="Fastest"
          onPress={() => handleSelectSpecialist("any")}
        />

        {business?.bookingSpecialists?.map((specialist) => (
          <SpecialistCard
            key={specialist.id}
            name={specialist.name}
            role={specialist.role}
            rating={specialist.rating}
            reviewsCount={specialist.reviewsCount}
            description={specialist.description}
            avatarUrl={specialist.avatarUrl}
            onPress={() => handleSelectSpecialist(specialist.id)}
          />
        ))}
      </View>
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
    list: {
      gap: spacing.md,
    },
  });
}
