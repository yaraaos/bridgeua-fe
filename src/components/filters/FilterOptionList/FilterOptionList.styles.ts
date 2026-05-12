import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    title: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 0.6,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    optionsWrap: {
      gap: 16,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionText: {
      marginLeft: 10,
      fontSize: 15,
      color: colors.textPrimary,
    },
    radioOuter: {
      width: 18,
      height: 18,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: colors.textMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterActive: {
      borderColor: colors.accentOrange,
    },
    radioInner: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.accentOrange,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxActive: {
      borderColor: colors.accentOrange,
      backgroundColor: colors.accentOrange,
    },
  });
}