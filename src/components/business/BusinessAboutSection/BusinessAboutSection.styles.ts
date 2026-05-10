import type { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      padding: spacing.lg,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    topRow: {
      width: "100%",
    },
    textColumn: {
      flex: 1,
    },
    description: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "500",
      color: colors.textPrimary,
    },
  });
}
