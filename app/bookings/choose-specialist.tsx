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
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ChooseSpecialistScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const {
    businessId,
    serviceId,
    serviceName,
    price,
    promotionId,
    promoCode,
    discountLabel,
  } = useLocalSearchParams<{
    businessId?: string;
    serviceId?: string;
    serviceName?: string;
    price?: string;
    promotionId?: string;
    promoCode?: string;
    discountLabel?: string;
  }>();

  useBusinessDetails(businessId);

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
      .get<TeamMember[]>(
        `/api/businesses/${businessId}/team?serviceId=${serviceId}`,
      )
      .then((res) => {
        const normalized = res.data.map((member) => ({
          ...member,
          photoUrl: member.photoUrl
            ? member.photoUrl.startsWith("http")
              ? member.photoUrl
              : `${API_BASE_URL}${member.photoUrl}`
            : undefined,
        }));

        setSpecialists(normalized);
        setIsLoadingSpecialists(false);
      })
      .catch(() => {
        setSpecialists([]);
        setIsLoadingSpecialists(false);
      });
  }, [businessId, serviceId]);

  const selectedSpecialist = useMemo(() => {
    return specialists.find(
      (specialist) => String(specialist.id) === selectedSpecialistId,
    );
  }, [selectedSpecialistId, specialists]);

  const handleNext = () => {
    if (!businessId || !serviceId || !selectedSpecialistId) return;
    if (!selectedSpecialist) return;

    router.push({
      pathname: "/bookings/choose-date",
      params: {
        businessId,
        serviceId,
        serviceName,
        price,
        specialistId: String(selectedSpecialist.id),
        specialistName:
          `${selectedSpecialist.firstName} ${selectedSpecialist.lastName}`.trim(),
        promotionId,
        promoCode,
        discountLabel,
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
            Pick the specialist you want to book with.
          </AppText>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {isLoadingSpecialists ? (
            <View style={styles.loaderWrap}>
              <AppLoader />
            </View>
          ) : specialists.length === 0 ? (
            <View style={styles.emptyWrap}>
              <AppText style={styles.emptyTitle}>
                No specialists available
              </AppText>
              <AppText style={styles.emptyText}>
                This service does not have available specialists yet. Please
                choose another service or contact the business.
              </AppText>
            </View>
          ) : (
            specialists.map((member) => (
              <SpecialistCard
                key={String(member.id)}
                name={`${member.firstName} ${member.lastName}`.trim()}
                role="Specialist"
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
          disabled={!selectedSpecialistId || !selectedSpecialist}
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
    loaderWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xl,
    },
    emptyWrap: {
      paddingVertical: spacing.xl,
      gap: spacing.xs,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
      textAlign: "center",
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
