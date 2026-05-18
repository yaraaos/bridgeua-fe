import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 8,
    },
    closeButton: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },
    body: {
      flexDirection: "row",
      gap: 12,
      paddingRight: 32,
    },
    image: {
      width: 72,
      height: 72,
      borderRadius: 14,
    },
    textContent: {
      flex: 1,
    },
    name: {
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
    distanceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    distanceText: {
      fontSize: 12,
      color: colors.textMuted,
      lineHeight: 16,
    },
    actionsRow: {
      marginTop: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    directionsButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primaryGreen,
      borderRadius: radius.pill,
      paddingVertical: 12,
    },
    directionsLabel: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "700",
    },
    shareButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.primaryGreen,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
