import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowExpanded: {
    paddingBottom: spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: colors.primaryGreen,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  value: {
    marginTop: spacing.xs,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  chevron: {
    color: colors.textMuted,
  },
  expandedContent: {
    overflow: "hidden",
    paddingLeft: 36 + spacing.md,
    paddingBottom: spacing.md,
  },
  containerLast: {
    borderBottomWidth: 0,
  },
  statusText: {
    fontWeight: "700",
  },
});
