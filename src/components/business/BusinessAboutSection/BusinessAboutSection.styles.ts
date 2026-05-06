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
  readMoreButton: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryGreen,
  },
  readMoreIcon: {
    color: colors.primaryGreen,
    marginLeft: 2,
  },
  contactList: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactRowLast: {
    borderBottomWidth: 0,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  contactIcon: {
    color: colors.primaryGreen,
  },
  contactTextWrap: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  contactValue: {
    marginTop: spacing.xs,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  chevron: {
    color: colors.textMuted,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featuresGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  featureItem: {
    flex: 1,
    alignItems: "center",
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  featureIcon: {
    color: colors.primaryGreen,
  },
  featureLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
  },
});
