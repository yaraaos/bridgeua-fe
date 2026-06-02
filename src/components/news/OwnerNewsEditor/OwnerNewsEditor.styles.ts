import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xl,
      paddingBottom: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },

    scrollContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.lg,
    },

    card: {
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.md,
    },

    label: {
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      fontSize: 14,
      fontWeight: "600",
    },

    field: {
      minHeight: 52,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      marginBottom: spacing.md,
      color: colors.textPrimary,
      fontSize: 16,
    },

    textAreaSmall: {
      minHeight: 88,
      textAlignVertical: "top",
    },

    textArea: {
      minHeight: 140,
      textAlignVertical: "top",
    },

    previewTitle: {
      marginBottom: spacing.sm,
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: "700",
    },

    footer: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      gap: spacing.sm,
    },

    footerRow: {
      flexDirection: "row",
      gap: spacing.sm,
    },

    footerButton: {
      flex: 1,
    },
  });
}
