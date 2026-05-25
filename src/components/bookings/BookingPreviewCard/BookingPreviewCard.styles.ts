import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
    },

    textWrap: {
      flex: 1,
    },

    title: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    description: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },

    metaRow: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },

    meta: {
      flex: 1,
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
    },

    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: colors.primaryGreenSoft,
    },

    statusText: {
      fontSize: 11,
      fontWeight: "800",
      color: colors.primaryGreen,
      textTransform: "capitalize",
    },

    rebookButton: {
      alignSelf: "flex-start",
      marginTop: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 999,
      backgroundColor: colors.primaryGreenSoft,
    },

    rebookText: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.primaryGreen,
    },
  });
}
