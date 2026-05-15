import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: {
      position: "relative",
    },

    container: {
      minHeight: 52,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      alignItems: "center",
    },

    input: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 15,
      paddingRight: 28,
    },

    clearButton: {
      position: "absolute",
      right: spacing.md,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      zIndex: 10,
    },

    flag: {
      fontSize: 18,
    },
  });
}