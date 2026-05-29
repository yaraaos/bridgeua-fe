import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    bordered: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
      marginTop: spacing.md,
    },
    content: {
      flex: 1,
    },
    name: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 2,
    },
    meta: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    recommendedRow: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      maxWidth: "100%",
    },

    recommendedLabel: {
      flexShrink: 1,
      fontSize: 12,
      color: colors.primaryGreen,
      fontWeight: "600",
      lineHeight: 16,
    },

    recommendedCount: {
      flexShrink: 0,
      marginLeft: 4,
      fontSize: 12,
      color: colors.primaryGreen,
      fontWeight: "700",
      lineHeight: 16,
    },
  });
}
