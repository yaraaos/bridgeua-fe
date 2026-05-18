import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
    },
    sm: {
      width: 32,
      height: 32,
      borderRadius: radius.pill,
    },
    md: {
      width: 42,
      height: 42,
      borderRadius: radius.pill,
    },
    lg: {
      width: 96,
      height: 96,
      borderRadius: radius.pill,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    initial: {
      fontWeight: "700",
      color: colors.white,
    },
    smText: {
      fontSize: 13,
    },
    mdText: {
      fontSize: 16,
    },
    lgText: {
      fontSize: 50,
    },
  });
}
