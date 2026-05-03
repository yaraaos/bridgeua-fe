import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  buttonSm: {
    minHeight: 28,
    paddingHorizontal: 10,
  },
  buttonMd: {
    minHeight: 36,
    paddingHorizontal: 14,
  },

  buttonOutline: {
    backgroundColor: colors.white,
    borderColor: colors.primaryGreen,
  },
  buttonFilled: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },

  buttonText: {
    fontWeight: "600",
  },
  buttonTextSm: {
    fontSize: 12,
  },
  buttonTextMd: {
    fontSize: 14,
  },

  buttonTextOutline: {
    color: colors.primaryGreen,
  },
  buttonTextFilled: {
    color: colors.white,
  },
});
