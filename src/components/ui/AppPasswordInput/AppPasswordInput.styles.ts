import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrapper: {
      position: "relative",
    },
    inputWithIcon: {
      paddingRight: 44,
    },
    toggleButton: {
      position: "absolute",
      right: 14,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
  });
}
