import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  writeCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  writeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  writeStars: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  writeStar: {
    color: colors.accentOrange,
  },
  writeHint: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  photosSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  photosRow: {
    marginTop: spacing.md,
    paddingRight: spacing.lg,
  },
  photoItem: {
    marginRight: spacing.sm,
  },
  reviewPhoto: {
    width: 120,
    height: 92,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryGreenSoft,
  },

  listHeader: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  list: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emptyText: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
});
