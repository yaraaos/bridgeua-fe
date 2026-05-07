import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    switchRow: {
      flexDirection: "row",
      backgroundColor: colors.border,
      borderRadius: 999,
      padding: 4,
    },
    switchTab: {
      flex: 1,
      minHeight: 32,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
    },
    switchTabActive: {
      backgroundColor: colors.primaryGreen,
    },
    switchText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    switchTextActive: {
      color: colors.white,
    },
  });
}