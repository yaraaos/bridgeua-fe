import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    input: {
      height: 50,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: 14,
      fontSize: 15,
      color: colors.textPrimary,
    },
    focused: {
      borderColor: colors.primaryGreen,
    },
    error: {
      borderColor: colors.error,
    },
    disabled: {
      backgroundColor: colors.background,
    },
  });
}