import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    button: {
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
    },
    buttonSm: {
      minHeight: 28,
      paddingHorizontal: 10,
    },
    buttonMd: {
      minHeight: 36,
      paddingHorizontal: 14,
    },
    buttonOutline: {
      backgroundColor: colors.surface,
      borderColor: colors.primaryGreen,
    },
    buttonFilled: {
      backgroundColor: colors.primaryGreen,
      borderColor: colors.primaryGreen,
    },
    buttonText: {
      fontWeight: "600",
    },
    buttonTextSm: {
      fontSize: 12,
    },
    buttonTextMd: {
      fontSize: 14,
    },
    buttonTextOutline: {
      color: colors.primaryGreen,
    },
    buttonTextFilled: {
      color: colors.white,
    },
    iconButton: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.primaryGreenSoft,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}