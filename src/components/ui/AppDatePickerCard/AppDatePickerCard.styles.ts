import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: 72,
    minHeight: 86,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
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
    opacity: 0.7,
  },
  day: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  date: {
    marginTop: spacing.xs,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  month: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  textSelected: {
    color: colors.white,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
