import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      gap: 12,
      marginBottom: 6,
      minHeight: 96,
    },
    cardCompact: {
      padding: 8,
      gap: 10,
      minHeight: 96,
    },

    image: {
      width: 76,
      height: 76,
      borderRadius: 18,
    },

    imageCompact: {
      width: 72,
      height: 72,
      borderRadius: 14,
    },

    content: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
    },

    textContent: {
      flex: 1,
    },

    actionSlot: {
      marginLeft: 8,
      paddingTop: 0,
      flexShrink: 0,
    },

    name: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      lineHeight: 20,
      marginBottom: 2,
    },

    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 3,
    },

    ratingText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textPrimary,
      marginLeft: 4,
      lineHeight: 17,
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 3,
    },

    metaText: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 16,
      flexShrink: 1,
    },

    dot: {
      fontSize: 12,
      color: colors.textMuted,
      marginHorizontal: 6,
      lineHeight: 16,
    },

    recommendedBy: {
      fontSize: 12,
      color: colors.primaryGreen,
      fontWeight: "600",
      lineHeight: 16,
    },
  });
}
