import { StyleSheet } from "react-native";

import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    tile: {
      flex: 1,
      padding: spacing.md,
      borderRadius: 18,
      gap: 4,
    },
    tileGreen: {
      backgroundColor: colors.primaryGreenSoft,
    },
    tilePurple: {
      backgroundColor: "#EDE7FB",
    },
    tileBlue: {
      backgroundColor: "#E0EEFC",
    },
    value: {
      marginTop: 2,
      fontSize: 24,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    label: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    delta: {
      marginTop: 2,
      fontSize: 10,
      fontWeight: "600",
      color: colors.textSecondary,
    },
  });
}