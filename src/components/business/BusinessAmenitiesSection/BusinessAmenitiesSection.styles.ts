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
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: spacing.lg,
    },
    item: {
      width: "25%",
      alignItems: "center",
      paddingHorizontal: spacing.xs,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: radius.md,
      backgroundColor: colors.primaryGreenSoft,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.sm,
    },
    icon: {
      color: colors.primaryGreen,
    },
    label: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "500",
      color: colors.textPrimary,
      textAlign: "center",
    },
  });
}
