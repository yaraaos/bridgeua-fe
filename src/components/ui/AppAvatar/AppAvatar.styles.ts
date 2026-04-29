import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryGreenSoft,
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
    width: 56,
    height: 56,
    borderRadius: radius.pill,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initial: {
    fontWeight: "700",
    color: colors.primaryGreen,
  },
  smText: {
    fontSize: 13,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 20,
  },
});