import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  slot: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  disabled: {
    backgroundColor: "#F3F4F6",
    borderColor: colors.border,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  textSelected: {
    color: colors.white,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
