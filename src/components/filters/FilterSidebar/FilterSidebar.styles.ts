import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    sidebar: {
      width: 118,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      paddingTop: 8,
      backgroundColor: colors.background,
    },
    item: {
      minHeight: 52,
      justifyContent: "center",
      paddingHorizontal: 14,
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    activeDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.accentOrange,
      marginRight: 8,
    },
    inactiveDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: "transparent",
      marginRight: 8,
    },
    itemText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    itemTextActive: {
      color: colors.accentOrange,
    },
  });
}