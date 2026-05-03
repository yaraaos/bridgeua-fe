import { StyleSheet } from "react-native";
import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  select: {
    height: 50,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  selectError: {
    borderColor: colors.error,
  },
  selectDisabled: {
    backgroundColor: "#F3F4F6",
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textMuted,
  },
  disabledText: {
    color: colors.textMuted,
  },
});