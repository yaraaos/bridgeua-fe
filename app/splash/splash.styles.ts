import { Dimensions, StyleSheet } from "react-native";

export const SVG_WIDTH = 280;
export const SCREEN_WIDTH = Dimensions.get("screen").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoWrap: {
    width: SVG_WIDTH,
    height: 210,
    alignItems: "center", // 👈 important
    justifyContent: "center",
  },
  textWrap: {
    alignItems: "center",
    marginTop: 6,
  },
});
