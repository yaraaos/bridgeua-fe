import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";
import { radius } from "../../../constants/radius";

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  input: {
    height: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  focused: {
    borderColor: colors.primaryGreen,
  },
  error: {
    borderColor: colors.error,
  },
  disabled: {
    backgroundColor: "#F3F4F6",
  },
});