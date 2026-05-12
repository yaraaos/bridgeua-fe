import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },

  input: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  inputFocused: {
    borderColor: colors.primaryGreen,
  },

  inputError: {
    borderColor: "#D92D20",
  },
});