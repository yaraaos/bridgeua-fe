import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    width: "100%",
  },
  textColumn: {
    flex: 1,
  },
  title: {
    marginBottom: spacing.md,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  contactList: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  hoursPanel: {
    overflow: "hidden",
    paddingLeft: 36 + spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  hoursDay: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  hoursValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  lastExpandableRow: {
    borderBottomWidth: 0,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipIcon: {
    color: colors.primaryGreen,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  recommendationsList: {
    gap: spacing.md,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  recommendationAvatar: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendationAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryGreen,
  },
  recommendationTextWrap: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  recommendationSubtitle: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
