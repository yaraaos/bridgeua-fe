import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  ratingRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    marginLeft: spacing.xs,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
