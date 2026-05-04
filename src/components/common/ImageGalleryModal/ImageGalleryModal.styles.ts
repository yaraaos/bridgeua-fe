import { radius } from "@/src/constants/radius";
import { Dimensions, StyleSheet } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
  },
  close: {
    position: "absolute",
    top: 56,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  page: {
    width: SCREEN_WIDTH,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "92%",
    height: "75%",
  },
});
