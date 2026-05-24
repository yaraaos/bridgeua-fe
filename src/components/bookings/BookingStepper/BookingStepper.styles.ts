import type { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    label: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primaryGreen,
    },
    stepText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textMuted,
    },
    track: {
      flexDirection: "row",
      gap: spacing.xs,
    },
    segment: {
      flex: 1,
      height: 5,
      borderRadius: radius.pill,
      backgroundColor: colors.border,
    },
    segmentActive: {
      backgroundColor: colors.primaryGreen,
    },
  });
}
