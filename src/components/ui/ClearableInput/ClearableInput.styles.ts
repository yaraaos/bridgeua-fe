import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    inputWrap: {
      position: "relative",
      justifyContent: "center",
    },

    input: {
      paddingRight: 72,
    },

    rightContent: {
      position: "absolute",
      right: spacing.md,
      top: 0,
      bottom: 0,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },

    clearButton: {
      width: 22,
      height: 22,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
