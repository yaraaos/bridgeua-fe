import { BookingStepper, SpecialistCard } from "@/src/components/bookings";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import type { TeamMember } from "@/src/types/team";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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

  const [specialists, setSpecialists] = useState<TeamMember[]>([]);
  const [isLoadingSpecialists, setIsLoadingSpecialists] = useState(true);

  const [selectedSpecialistId, setSelectedSpecialistId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!businessId || !serviceId) {
      setIsLoadingSpecialists(false);
      return;
    }
    setIsLoadingSpecialists(true);
    void apiClient
      .get<{ data: TeamMember[] }>(
        `/api/businesses/${businessId}/team?serviceId=${serviceId}`,
      )
      .then((res) => {
        const normalized = res.data.data.map((m) => ({
          ...m,
          photoUrl: m.photoUrl
            ? m.photoUrl.startsWith("http")
              ? m.photoUrl
              : `${API_BASE_URL}${m.photoUrl}`
            : undefined,
        }));
        setSpecialists(normalized);
        setIsLoadingSpecialists(false);
      })
      .catch(() => {
        setIsLoadingSpecialists(false);
      });
  }, [businessId, serviceId]);

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

          {isLoadingSpecialists ? (
            <View
              style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: spacing.xl }}
            >
              <AppLoader />
            </View>
          ) : (
            specialists.map((member) => (
              <SpecialistCard
                key={String(member.id)}
                name={`${member.firstName} ${member.lastName}`}
                role="Specialist"
                rating={business?.rating ?? 5}
                reviewsCount={business?.reviewCount ?? 0}
                avatarUrl={member.photoUrl}
                onPress={() => setSelectedSpecialistId(String(member.id))}
                isSelected={selectedSpecialistId === String(member.id)}
              />
            ))
          )}
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
      gap: spacing.cardGap,
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
