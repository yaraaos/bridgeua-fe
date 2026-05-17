import type { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      padding: spacing.lg,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primaryGreen,
    },
    actions: {
      marginTop: spacing.md,
    },
  });
}