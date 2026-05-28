import { StyleSheet } from "react-native";

import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      padding: spacing.lg,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    cardTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    editButton: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },

    editText: {
      color: colors.primaryGreen,
      fontSize: 14,
      fontWeight: "700",
    },

    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: 8,
      rowGap: 18,
    },

    actionTile: {
      alignItems: "center",
      gap: 8,
    },

    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
    },

    actionLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
      width: 72,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      justifyContent: "flex-end",
    },

    modalCard: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      backgroundColor: colors.surface,
      gap: spacing.md,
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    modalList: {
      gap: spacing.sm,
    },

    modalItem: {
      minHeight: 48,
      borderRadius: 16,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },

    modalItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      flex: 1,
    },

    modalItemText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    modalActions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 24,
    },

    modalButton: {
      flex: 1,
    },
  });
}
