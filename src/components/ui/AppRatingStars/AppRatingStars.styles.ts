import { StyleSheet } from "react-native";

export function createStyles(size: number) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    starWrap: {
      width: size,
      height: size,
      position: "relative",
    },
    emptyStar: {
      position: "absolute",
      left: 0,
      top: 0,
    },
    filledStarClip: {
      position: "absolute",
      left: 0,
      top: 0,
      height: size,
      overflow: "hidden",
    },
  });
}
