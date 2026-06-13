import { BookingStepper, SpecialistCard } from "@/src/components/bookings";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { getEarliestAvailableSlot } from "@/src/features/bookings/services/booking.service";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import type { TeamMember } from "@/src/types/team";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

function formatEarliestSlot(date: string, time: string): string {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  const timeLabel = time.slice(0, 5);
  if (date === todayStr) return `Today at ${timeLabel}`;
  if (date === tomorrowStr) return `Tomorrow at ${timeLabel}`;
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year.slice(2)} at ${timeLabel}`;
}

export default function ChooseSpecialistScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

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
  const [specialistSlots, setSpecialistSlots] = useState<
    Record<string, string | null | undefined>
  >({});

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

        normalized.forEach((member) => {
          void getEarliestAvailableSlot({
            businessId,
            serviceId,
            specialistId: String(member.id),
          }).then((result) => {
            const label = result
              ? formatEarliestSlot(result.date, result.time)
              : null;
            setSpecialistSlots((prev) => ({
              ...prev,
              [String(member.id)]: label,
            }));
          });
        });
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
          <AppText style={styles.title}>{t("bookings.chooseSpecialistTitle")}</AppText>
          <AppText style={styles.subtitle}>
            {t("bookings.chooseSpecialistSubtitle")}
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
                {t("bookings.chooseSpecialistEmpty")}
              </AppText>
              <AppText style={styles.emptyText}>
                {t("bookings.chooseSpecialistEmptyDesc")}
              </AppText>
            </View>
          ) : (
            specialists.map((member) => {
              const slotInfo = specialistSlots[String(member.id)];
              return (
                <SpecialistCard
                  key={String(member.id)}
                  name={`${member.firstName} ${member.lastName}`.trim()}
                  role={t("bookings.specialistRole")}
                  avatarUrl={member.photoUrl}
                  onPress={() => setSelectedSpecialistId(String(member.id))}
                  isSelected={selectedSpecialistId === String(member.id)}
                  isLoadingSlot={slotInfo === undefined}
                  earliestSlot={typeof slotInfo === "string" ? slotInfo : null}
                />
              );
            })
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <AppButton
          title={t("bookings.nextButton")}
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
