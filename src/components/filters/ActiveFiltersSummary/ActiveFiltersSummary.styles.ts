import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

import type { AppColors } from "@/src/constants/colors";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    title: {
      marginBottom: 8,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.8,
      color: colors.textMuted,
    },
    chipsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      minHeight: 30,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.cardGap,
    },
    chipText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textPrimary,
    },
  });
}
