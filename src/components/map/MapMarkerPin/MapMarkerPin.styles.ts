import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

const SIZE = 40;
const TAIL_HEIGHT = 8;
const TAIL_OVERLAP = 2;

export const MAP_MARKER_WIDTH = SIZE;
export const MAP_MARKER_HEIGHT = SIZE + TAIL_HEIGHT - TAIL_OVERLAP;
export const MAP_MARKER_ANCHOR_Y = 1;

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrapper: {
      width: MAP_MARKER_WIDTH,
      height: MAP_MARKER_HEIGHT,
      alignItems: "center",
      overflow: "visible",
    },
    pin: {
      width: SIZE,
      height: SIZE,
      borderRadius: SIZE / 2,
      borderWidth: 3,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    tail: {
      width: 0,
      height: 0,
      marginTop: -TAIL_OVERLAP,
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderTopWidth: TAIL_HEIGHT,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
    },
  });
}