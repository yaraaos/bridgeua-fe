import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
      backgroundColor: "rgba(0,0,0,0.35)",
    },

    card: {
      width: "100%",
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },

    header: {
      minHeight: 52,
      paddingHorizontal: spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    title: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    cancel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },

    done: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primaryGreen,
    },

    picker: {
      alignSelf: "center",
    },
  });
}
