import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      backgroundColor: colors.accentOrangeSoft,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
    containerCompact: {
      paddingHorizontal: 6,
      paddingVertical: 3,
    },
    text: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    textCompact: {
      fontSize: 11,
    },
  });
}