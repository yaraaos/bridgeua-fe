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
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    chipGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipIcon: {
      color: colors.primaryGreen,
    },
    chipText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
  });
}
