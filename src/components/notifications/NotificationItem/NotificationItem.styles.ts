import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      position: "relative",
    },

    cardWithThumbnail: {
      paddingRight: 104,
    },

    cardWithoutThumbnail: {
      paddingRight: 42,
    },

    cardPressed: {
      backgroundColor: colors.background,
    },

    iconWrap: {
      width: 42,
      height: 42,
      borderRadius: radius.lg,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
    },

    unreadDot: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: colors.accentOrange,
      borderWidth: 1.5,
      borderColor: colors.surface,
    },

    content: {
      flex: 1,
      minWidth: 0,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: spacing.sm,
    },

    title: {
      flex: 1,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    titleRead: {
      fontWeight: "700",
      color: colors.textPrimary,
    },

    time: {
      fontSize: 11,
      fontWeight: "600",
      textAlign: "right",
      color: colors.textMuted,
    },

    timeSlot: {
      position: "absolute",
      right: spacing.md,
      width: 32,
      alignItems: "flex-end",
    },

    subtitle: {
      marginTop: 4,
      fontSize: 12,
      lineHeight: 17,
      color: colors.textSecondary,
    },

    subtitleRead: {
      color: colors.textMuted,
    },

    thumbnail: {
      position: "absolute",
      right: 42,
      width: 44,
      height: 44,
      borderRadius: radius.md,
    },
  });
}
