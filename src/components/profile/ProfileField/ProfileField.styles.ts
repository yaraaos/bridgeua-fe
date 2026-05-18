import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    label: {
      marginBottom: spacing.xs,
      fontSize: 13,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    helperText: {
      marginTop: spacing.xs,
      fontSize: 12,
      lineHeight: 17,
      color: colors.textSecondary,
    },

    errorText: {
      marginTop: spacing.xs,
      fontSize: 12,
      lineHeight: 17,
      color: colors.error,
    },
  });
}
