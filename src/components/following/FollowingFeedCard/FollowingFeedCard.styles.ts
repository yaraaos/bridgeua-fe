import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    feedCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: spacing.cardGap,
    },

    feedHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    feedContentRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      marginRight: 12,
    },

    feedTextWrap: {
      flex: 1,
      marginLeft: 10,
    },

    feedIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },

    feedTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.textPrimary,
      lineHeight: 22,
      marginBottom: 4,
    },

    feedDescription: {
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
    },

    feedBody: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 12,
      padding: 12,
      borderRadius: 14,
      backgroundColor: colors.background,
    },

    businessImage: {
      width: 46,
      height: 46,
      borderRadius: 12,
    },

    businessInfo: {
      flex: 1,
    },

    businessName: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },

    businessMetaRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    ratingText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textPrimary,
      marginLeft: 3,
    },

    dot: {
      fontSize: 11,
      color: colors.textMuted,
      marginHorizontal: 5,
    },

    metaText: {
      fontSize: 12,
      color: colors.textSecondary,
      flexShrink: 1,
    },
  });
}
