import { BookingStepper, SpecialistCard } from "@/src/components/bookings";
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

  const [selectedSpecialistId, setSelectedSpecialistId] = useState<
    string | null
  >(null);

  const handleNext = () => {
    if (!businessId || !serviceId || !selectedSpecialistId) return;

    router.push({
      pathname: "/bookings/choose-date",
      params: {
        businessId,
        serviceId,
        serviceName,
        specialistId: selectedSpecialistId,
        promotionId,
        promoCode,
      },
    });
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <BookingStepper currentStep={2} />

        <View style={styles.header}>
          <AppText style={styles.title}>Choose specialist</AppText>
          <AppText style={styles.subtitle}>
            Pick a specialist or let the business assign anyone available.
          </AppText>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          <SpecialistCard
            name="Any specialist"
            role="First available professional"
            rating={business?.rating ?? 5}
            reviewsCount={business?.reviewCount ?? 0}
            description="Recommended if you want the earliest available time."
            badgeText="Fastest"
            onPress={() => setSelectedSpecialistId("any")}
            isSelected={selectedSpecialistId === "any"}
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
              onPress={() => setSelectedSpecialistId(specialist.id)}
              isSelected={selectedSpecialistId === specialist.id}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <AppButton
          title="Next"
          disabled={!selectedSpecialistId}
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
      gap: spacing.md,
      paddingBottom: spacing.md,
    },
    footer: {
      paddingTop: spacing.sm,
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
  });
}
