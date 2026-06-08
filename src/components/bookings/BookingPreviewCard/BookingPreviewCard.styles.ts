import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrapper: {
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },

    wrapperWithRebook: {
      borderRadius: 24,
    },

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

    cardWithRebook: {
      borderRadius: 0,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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

    rebookButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
    },

    rebookText: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.primaryGreen,
    },
  });
}
