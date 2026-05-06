import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
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
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
  },
  readMoreButton: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  readMoreText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primaryGreen,
  },
  readMoreIcon: {
    color: colors.primaryGreen,
    marginLeft: 2,
  },
  contactList: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  contactRow: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactRowLast: {
    borderBottomWidth: 0,
  },
  contactIconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  contactIcon: {
    color: colors.primaryGreen,
  },
  contactTextWrap: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  contactValue: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  chevron: {
    color: colors.primaryGreen,
    marginLeft: spacing.sm,
  },
  featuresTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  featuresGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  featureItem: {
    flex: 1,
    alignItems: "center",
  },
  featureIconWrap: {
    width: 48,
    height: 48,
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
    color: colors.textPrimary,
    textAlign: "center",
  },
});
