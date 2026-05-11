import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    feedCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 12,
    },

    feedBody: {
      marginTop: 12,
      padding: 12,
      borderRadius: 14,
      backgroundColor: colors.background,
    },

    feedTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },

    feedDescription: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary,
    },
  });
}
