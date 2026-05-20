import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
    reviewDate: {
      marginLeft: spacing.sm,
      fontSize: 11,
      color: colors.textSecondary,
      transform: [{ translateY: -7 }],
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
    moreButton: {
      marginTop: "auto",
      paddingTop: spacing.sm,
      alignSelf: "flex-end",
    },
    moreText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primaryGreen,
    },
    previewContent: {
      flex: 1,
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
      marginTop: spacing.sm,
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

    profileBusinessImageWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.primaryGreenSoft,
    },

    profileBusinessImage: {
      width: "100%",
      height: "100%",
    },

    profileBusinessInfo: {
      flex: 1,
    },

    profileBusinessName: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    reviewContent: {
      flex: 1,
    },

    reviewCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
      paddingVertical: spacing.md,
    },

    profileHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
    },

    profileRatingDateRow: {
      marginTop: 2,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },

    profileActionsWrap: {
      position: "relative",
      alignItems: "flex-end",
    },

    profileActionsButton: {
      width: 32,
      height: 32,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
    },

    profileActionsButtonActive: {
      backgroundColor: colors.primaryGreenSoft,
      borderWidth: 1,
      borderColor: colors.primaryGreenSoft,
    },

    profileActionsMenu: {
      position: "absolute",
      top: 38,
      right: 0,
      width: 164,
      paddingVertical: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      zIndex: 10,
      elevation: 4,
    },

    profileActionsMenuItem: {
      minHeight: 40,
      paddingHorizontal: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },

    profileActionsMenuText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primaryGreen,
    },

    profileReviewDate: {
      fontSize: 11,
      color: colors.textSecondary,
    },

    reviewDateWrap: {
      alignItems: "flex-end",
    },

    reviewPhotosScroll: {
      marginTop: spacing.sm,
    },

    reviewPhotoPreview: {
      width: 74,
      height: 74,
      borderRadius: radius.md,
      marginRight: spacing.sm,
      backgroundColor: colors.primaryGreenSoft,
    },

    reviewReadMore: {
      marginTop: spacing.xs,
      fontSize: 12,
      fontWeight: "700",
      color: colors.primaryGreen,
    },
  });
}
