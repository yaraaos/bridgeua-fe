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
  fullArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  topCloseArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "12.5%",
    zIndex: 1,
  },
  bottomCloseArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "12.5%",
    zIndex: 1,
  },
  imageWrap: {
    width: "92%",
    height: "75%",
    alignSelf: "center",
    position: "relative",
    zIndex: 2,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  viewAllOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
  },

  viewAllText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
