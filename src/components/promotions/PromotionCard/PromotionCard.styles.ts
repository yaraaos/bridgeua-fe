import type { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },

    image: {
      width: "100%",
      height: 180,
    },

    content: {
      padding: 16,
      gap: 10,
    },

    badge: {
      alignSelf: "flex-start",
      backgroundColor: colors.primaryGreenSoft,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },

    badgeText: {
      color: colors.primaryGreenDark,
      fontSize: 12,
      fontWeight: "700",
    },

    title: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    description: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textSecondary,
    },

    businessRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    businessText: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: "600",
    },

    actions: {
      marginTop: 4,
    },
  });
}
