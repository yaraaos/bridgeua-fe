import { colors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  outer: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  outerSelected: {
    borderColor: colors.primaryGreen,
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.primaryGreen,
  },
  disabled: {
    opacity: 0.5,
  },
});
