import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  containerPreview: {
    width: 200,
    minHeight: 150,
    padding: spacing.md,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  authorNamePreview: {
    fontSize: 13,
  },
  starsRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginTop: spacing.md,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  textPreview: {
    marginTop: spacing.xs,
    fontSize: 12,
    lineHeight: 17,
  },
  moreText: {
    marginTop: spacing.xs,
    alignSelf: "flex-end",
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryGreen,
  },
  photosRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  reviewPhoto: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.primaryGreenSoft,
  },
});
