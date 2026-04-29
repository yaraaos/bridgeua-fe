import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";
import { radius } from "../../../constants/radius";
import { spacing } from "../../../constants/spacing";

export const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
  },
  leftBlock: {
    flex: 1,
    paddingTop: 18,
    gap: 6,
  },
  subtitleLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  subtitleValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  titleWrap: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 38,
  },
  titleSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInputWrap: {
    flex: 1,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accentOrange,
    alignItems: "center",
    justifyContent: "center",
  },

  // BUSINESS PAGE
  businessIconButton: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  businessHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  businessLogo: {
    width: 82,
    height: 82,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  businessInfo: {
    flex: 1,
    minWidth: 0,
  },
  businessTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  businessRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
  },
  businessRatingValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginLeft: 4,
  },
  businessReviewText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  businessMeta: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  businessStatus: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    color: colors.primaryGreen,
  },
  businessTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  businessInlineActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});

//