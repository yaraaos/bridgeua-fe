import { StyleSheet } from "react-native";

import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      overflow: "hidden",
    },
    handleWrap: {
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 6,
    },
    handle: {
      width: 46,
      height: 5,
      borderRadius: 999,
      backgroundColor: colors.border,
    },
    header: {
      minHeight: 52,
      paddingHorizontal: 24,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    closeButton: {
      width: 28,
      height: 28,
      borderRadius: 999,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    scroll: {
      maxHeight: 520,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      gap: spacing.sm,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowActive: {
      borderColor: colors.primaryGreen,
      backgroundColor: colors.primaryGreenSoft,
    },
    rowText: {
      flex: 1,
      minWidth: 0,
    },
    rowName: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    rowHandle: {
      marginTop: 2,
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    rowSubtype: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "600",
      color: colors.textMuted,
    },
    notificationCount: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "700",
      color: colors.accentOrange,
    },
    rowRight: {
      alignItems: "center",
      justifyContent: "center",
    },
    activeBadge: {
      width: 26,
      height: 26,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primaryGreen,
    },
    addRow: {
      marginTop: spacing.xs,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: 18,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.primaryGreen,
      backgroundColor: colors.surface,
    },
    addIcon: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: colors.primaryGreenSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    addText: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.primaryGreen,
    },
  });
}