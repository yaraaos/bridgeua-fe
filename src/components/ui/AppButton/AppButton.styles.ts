import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    base: {
      height: 52,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    baseSm: {
      height: 34,
      borderRadius: radius.sm,
      paddingHorizontal: 14,
    },
    primary: {
      backgroundColor: colors.primaryGreen,
    },
    secondary: {
      backgroundColor: colors.accentOrange,
    },
    ghost: {
      backgroundColor: "transparent",
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
    },
    textSm: {
      fontSize: 13,
    },
    primaryText: {
      color: colors.white,
    },
    secondaryText: {
      color: colors.white,
    },
    ghostText: {
      color: colors.primaryGreen,
    },
    accent: {
      backgroundColor: colors.accentOrange,
    },

    accentText: {
      color: colors.white,
    },
  });
}
