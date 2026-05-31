import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      gap: 12,
      marginBottom: spacing.cardGap,
      minHeight: 96,
    },
    ownedCard: {
      borderColor: colors.accentOrange,
      backgroundColor: colors.accentOrangeSoft,
    },

    cardCompact: {
      padding: 8,
      gap: 10,
      minHeight: 96,
    },

    image: {
      width: 76,
      height: 76,
      borderRadius: 18,
    },

    imageCompact: {
      width: 72,
      height: 72,
      borderRadius: 14,
    },

    content: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
    },

    textContent: {
      flex: 1,
    },

    actionSlot: {
      marginLeft: 8,
      paddingTop: 0,
      flexShrink: 0,
    },

    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 2,
      justifyContent: "space-between",
    },

    name: {
      flexShrink: 1,
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      lineHeight: 20,
      marginBottom: 2,
    },

    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 3,
    },

    ratingText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textPrimary,
      marginLeft: 4,
      lineHeight: 17,
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 3,
    },

    metaText: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 16,
      flexShrink: 1,
    },

    dot: {
      fontSize: 12,
      color: colors.textMuted,
      marginHorizontal: 6,
      lineHeight: 16,
    },

    openStatusRow: {
      marginTop: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    openStatusText: {
      fontSize: 12,
      fontWeight: '600',
    },

    recommendedRow: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      maxWidth: "100%",
    },

    recommendedLabel: {
      flexShrink: 1,
      fontSize: 12,
      color: colors.primaryGreen,
      fontWeight: "600",
      lineHeight: 16,
    },

    recommendedCount: {
      flexShrink: 0,
      marginLeft: 4,
      fontSize: 12,
      color: colors.primaryGreen,
      fontWeight: "700",
      lineHeight: 16,
    },
    cardEmbedded: {
      borderWidth: 0,
      backgroundColor: "transparent",
      padding: 0,
      marginBottom: 0,
      minHeight: 76,
    },

    imageEmbedded: {
      width: 72,
      height: 72,
      borderRadius: 14,
    },
  });
}
