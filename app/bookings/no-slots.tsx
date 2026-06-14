import { BookingStepper } from "@/src/components/bookings";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet, View } from "react-native";

export default function NoAvailableSlotsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const {
    businessId,
    serviceId,
    serviceName,
    specialistId,
    promotionId,
    promoCode,
  } = useLocalSearchParams<{
    businessId?: string;
    serviceId?: string;
    serviceName?: string;
    specialistId?: string;
    promotionId?: string;
    promoCode?: string;
  }>();

  const { business } = useBusinessDetails(businessId);

  const handleTryDifferentDate = () => {
    router.replace({
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

  const handleChooseDifferentSpecialist = () => {
    router.replace({
      pathname: "/bookings/choose-specialist",
      params: {
        businessId,
        serviceId,
        serviceName,
        promotionId,
        promoCode,
      },
    });
  };

  const handleContactBusiness = () => {
    if (business?.phone) {
      void Linking.openURL(`tel:${business.phone}`);
      return;
    }

    if (businessId) {
      router.push({
        pathname: "/business/[id]",
        params: { id: businessId },
      });
      return;
    }

    router.back();
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <BookingStepper currentStep={3} />

        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons
              name="calendar-clear-outline"
              size={34}
              color={colors.primaryGreen}
            />
          </View>

          <AppText style={styles.title}>No available slots</AppText>

          <AppText style={styles.subtitle}>
            There are no available appointment times for the selected date,
            service, or specialist. Try another option or contact the business
            directly.
          </AppText>

          {!!serviceName && (
            <View style={styles.infoBox}>
              <AppText style={styles.infoLabel}>Selected service</AppText>
              <AppText style={styles.infoValue}>{serviceName}</AppText>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <AppButton
            title={t("bookings.noSlotsTryDate")}
            onPress={handleTryDifferentDate}
          />

          <AppButton
            title={t("bookings.noSlotsChooseSpecialist")}
            variant="secondary"
            onPress={handleChooseDifferentSpecialist}
          />

          <AppButton
            title={t("bookings.noSlotsContactBusiness")}
            variant="ghost"
            onPress={handleContactBusiness}
          />
        </View>
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

    card: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },

    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
      marginBottom: spacing.sm,
    },

    title: {
      fontSize: 26,
      lineHeight: 32,
      fontWeight: "900",
      color: colors.textPrimary,
      textAlign: "center",
    },

    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      textAlign: "center",
    },

    infoBox: {
      width: "100%",
      padding: spacing.md,
      borderRadius: 16,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.xs,
      marginTop: spacing.sm,
    },

    infoLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
    },

    infoValue: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    actions: {
      gap: spacing.sm,
      paddingBottom: spacing.xl,
    },
  });
}
