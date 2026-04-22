import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";
import { radius } from "../../../constants/radius";

export const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  content: {
    paddingRight: 16,
    gap: 8,
  },
  chip: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.white,
  },
});
