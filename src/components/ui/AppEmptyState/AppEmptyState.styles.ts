import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: "center",
    },
    description: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
      textAlign: "center",
    },
    actionButton: {
      marginTop: 18,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.accentOrangeSoft,
    },

    actionText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.accentOrange,
    },
  });
}
