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
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    serviceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: 0,
    },
    serviceRowBordered: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
      marginTop: spacing.md,
    },
    iconBox: {
      width: 38,
      height: 38,
      borderRadius: radius.md,
      backgroundColor: colors.primaryGreenSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      color: colors.primaryGreen,
    },
    content: {
      flex: 1,
    },
    serviceName: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    metaRow: {
      marginTop: spacing.xs,
      flexDirection: "row",
      alignItems: "center",
    },
    metaText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    metaDot: {
      marginHorizontal: spacing.sm,
      fontSize: 13,
      color: colors.textMuted,
    },
    chevron: {
      color: colors.textMuted,
    },
    emptyContainer: {
      marginHorizontal: spacing.lg,
      marginTop: 0,
      padding: spacing.lg,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    emptyText: {
      marginTop: spacing.xs,
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
}
