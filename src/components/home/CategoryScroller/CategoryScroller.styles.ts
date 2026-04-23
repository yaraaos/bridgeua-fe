import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  content: {
    paddingRight: 16,
    gap: 8,
  },
  chip: {
    minHeight: 32,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#D4DED7",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: colors.primaryGreen,
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
