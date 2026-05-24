import type { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      padding: spacing.lg,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    title: {
      fontSize: 18,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    rows: {
      gap: spacing.md,
    },
    row: {
      gap: spacing.xs,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    label: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
      textTransform: "uppercase",
    },
    value: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },
  });
}
