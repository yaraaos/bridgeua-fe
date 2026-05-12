import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    backButton: {
      flex: 1,
      alignSelf: "flex-start",
      marginLeft: -4,
      paddingTop: 4,
    },
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
      gap: 6,
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

    profileHeaderInner: {
      paddingTop: 28,
      paddingBottom: 26,
    },

    profileHeaderTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 26,
    },

    profileHeaderTitle: {
      fontSize: 34,
      lineHeight: 40,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    businessContent: {
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    businessHeaderInner: {
      height: 154,
      justifyContent: "center",
    },
    businessInfoWrap: {
      flex: 1,
      height: "100%",
      minWidth: 0,
      justifyContent: "flex-start",
      paddingTop: 7,
    },

    businessTitle: {
      fontSize: 24,
      lineHeight: 29,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    businessRatingRow: {
      marginTop: 6,
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },

    businessRatingValue: {
      marginLeft: 2,
      fontSize: 14,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    businessReviewText: {
      fontSize: 12,
      color: colors.textSecondary,
    },

    businessMetaRow: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      maxWidth: "100%",
    },

    businessMetaItem: {
      minWidth: 0,
    },

    businessMeta: {
      fontSize: 13,
      lineHeight: 17,
      color: colors.textSecondary,
    },

    businessMetaDivider: {
      fontSize: 13,
      color: colors.textSecondary,
    },

    businessStatusRow: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    businessStatusSeparator: {
      fontSize: 13,
      color: colors.textSecondary,
    },

    businessStatus: {
      fontSize: 13,
      lineHeight: 17,
      fontWeight: "700",
      color: colors.primaryGreen,
    },

    businessStatusMuted: {
      fontSize: 13,
      lineHeight: 17,
      color: colors.textSecondary,
    },

    businessImageWrap: {
      width: 96,
      height: 96,
      flexShrink: 0,
    },

    businessImage: {
      width: "100%",
      height: "100%",
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
    },

    businessImageFallback: {
      width: "100%",
      height: "100%",
      borderRadius: radius.xl,
      backgroundColor: colors.primaryGreenSoft,
      alignItems: "center",
      justifyContent: "center",
    },

    businessActionsColumn: {
      width: 36,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
    },

    businessIconButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.accentOrange,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
