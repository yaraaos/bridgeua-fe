import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrapper: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
      backgroundColor: colors.background,
    },
    content: {
      paddingRight: 16,
      gap: 8,
    },
    chip: {
      minHeight: 32,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    chipActive: {
      backgroundColor: colors.primaryGreen,
    },
    chipText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    chipTextActive: {
      color: colors.white,
    },
  });
}