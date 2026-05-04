import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    gap: spacing.lg,
  },
  left: {
    width: 96,
    alignItems: "center",
  },
  rating: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  starsRow: {
    marginTop: spacing.xs,
    flexDirection: "row",
  },
  reviewCount: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
  },
  right: {
    flex: 1,
    gap: spacing.xs,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  breakdownLabel: {
    width: 12,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryGreenSoft,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.accentOrange,
  },
  breakdownCount: {
    width: 18,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "right",
  },
});
