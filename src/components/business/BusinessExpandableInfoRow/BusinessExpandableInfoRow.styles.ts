import type { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    containerLast: {
      borderBottomWidth: 0,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      gap: spacing.md,
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
    title: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    value: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    linkValue: {
      textDecorationLine: "underline",
      color: colors.primaryGreen,
    },
    statusText: {
      fontWeight: "700",
    },
    chevron: {
      color: colors.textSecondary,
    },
    expandedContent: {
      paddingLeft: 51,
      paddingRight: 28,
      paddingBottom: spacing.md,
    },
  });
}
