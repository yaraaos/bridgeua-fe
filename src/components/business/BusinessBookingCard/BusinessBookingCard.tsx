import { AuthRequiredModal, useRequireAuth } from "@/src/features/auth";
import { getCategoryIcon } from "@/src/features/businesses/utils/categoryIcons";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { createStyles } from "./BusinessBookingCard.styles";

type Props = {
  businessId: string;
  category?: string;
  disabled?: boolean;
};

type BookingAction = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  pathname:
    | "/bookings/choose-date"
    | "/bookings/choose-specialist"
    | "/bookings/choose-service";
};

export default function BusinessBookingCard({ businessId, category, disabled }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const { isAuthModalVisible, closeAuthModal, confirmAuthModal, requireAuth } =
    useRequireAuth();

  const BOOKING_ACTIONS: BookingAction[] = [
    /*
    {
      title: t("businessBooking.chooseProfessional"),
      subtitle: t("businessBooking.chooseProfessionalSubtitle"),
      icon: "person-outline",
      pathname: "/bookings/choose-specialist",
    },
    {
      title: t("businessBooking.pickDate"),
      subtitle: t("businessBooking.pickDateSubtitle"),
      icon: "calendar-outline",
      pathname: "/bookings/choose-date",
    },
    */
    {
      title: t("businessBooking.selectServices"),
      subtitle: t("businessBooking.selectServicesSubtitle"),
      icon: "cut-outline",
      pathname: "/bookings/choose-service",
    },
  ];

  const handlePress = (pathname: BookingAction["pathname"]) => {
    requireAuth(
      () => {
        router.push({
          pathname,
          params: { businessId },
        });
      },
      {
        action: "book",
      },
    );
  };

  return (
    <View style={[styles.container, disabled && { opacity: 0.5 }]}>
      <Text style={styles.title}>{t("businessBooking.title")}</Text>

      <View style={styles.actions}>
        {BOOKING_ACTIONS.map((action, index) => (
          <Pressable
            key={action.pathname}
            style={[
              styles.actionRow,
              index !== 0 ? styles.actionRowBordered : null,
            ]}
            onPress={disabled ? undefined : () => handlePress(action.pathname)}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name={getCategoryIcon(
                  category?.toLowerCase().replace(/\s+/g, "-"),
                )}
                size={18}
                color={colors.primaryGreen}
              />
            </View>

            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </Pressable>
        ))}
      </View>

      <AuthRequiredModal
        visible={isAuthModalVisible}
        onClose={closeAuthModal}
        onConfirm={confirmAuthModal}
      />
    </View>
  );
}