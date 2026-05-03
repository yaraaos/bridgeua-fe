import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  checked: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  disabled: {
    opacity: 0.5,
  },
});
