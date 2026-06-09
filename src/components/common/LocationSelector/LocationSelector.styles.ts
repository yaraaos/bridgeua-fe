import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      position: "relative",
    },
    subtitleLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    triggerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      alignSelf: "flex-start",
    },
    subtitleValue: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    modalLayer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.15)',
    },
    dropdown: {
      position: "absolute",
      width: 260,
      backgroundColor: colors.primaryGreenDark,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.primaryGreen,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 20,
    },
    option: {
      minHeight: 44,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.08)',
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    optionLast: {
      borderBottomWidth: 0,
    },
    optionSelected: {
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    optionText: {
      fontSize: 14,
      color: colors.white,
    },
    optionTextSelected: {
      color: colors.white,
      fontWeight: "700",
    },
  });
}