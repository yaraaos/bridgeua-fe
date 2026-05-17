import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.md,
    },
    bordered: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    content: {
      flex: 1,
    },
    name: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    meta: {
      marginTop: spacing.xs,
      fontSize: 13,
      color: colors.textSecondary,
    },
    count: {
      marginTop: spacing.xs,
      fontSize: 13,
      fontWeight: "600",
      color: colors.primaryGreen,
    },
  });
}