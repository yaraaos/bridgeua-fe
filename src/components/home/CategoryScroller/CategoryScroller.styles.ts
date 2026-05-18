import {AppColors} from "@/src/constants/colors";
import {StyleSheet} from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrapper: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
      backgroundColor: colors.background,
    },
    wrapperOverlay: {
      paddingHorizontal: 0,
      backgroundColor: "transparent",
    },
    content: {
      paddingLeft: 12,
      paddingRight: 12,
      gap: 8,
    },
    contentOverlay: {
      paddingHorizontal: 0,
    },
    chip: {
      minHeight: 32,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    chipActive: {
      backgroundColor: colors.accentOrange,
    },
    chipText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    chipTextActive: {
      color: colors.white,
    },
  });
}
