import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    activeDot: {
      width: 20,
      backgroundColor: colors.primaryGreen,
    },
  });
}