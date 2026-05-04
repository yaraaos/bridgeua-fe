import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { Dimensions, StyleSheet } from "react-native";

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
  photoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
  },
  photosScroll: {
    marginTop: spacing.md,
  },
  photoItem: {
    marginRight: spacing.sm,
  },
  photoModalClose: {
    position: "absolute",
    top: 56,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  photoModalPage: {
    width: Dimensions.get("window").width,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  photoModalImage: {
    width: "92%",
    height: "75%",
  },
  tagsWrap: {
    marginTop: spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryGreenSoft,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryGreen,
  },
});
