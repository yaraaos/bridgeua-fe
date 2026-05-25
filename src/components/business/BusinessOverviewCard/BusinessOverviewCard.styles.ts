import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      marginHorizontal: spacing.lg,
      marginTop: 0,
      padding: spacing.lg,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    hoursRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    hoursDay: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    hoursValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    hoursRowLast: {
      paddingBottom: 0,
    },
  });
}
