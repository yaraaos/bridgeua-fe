import { AppColors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

const SIZE = 40;
const OWNED_SIZE = 48;
const TAIL_HEIGHT = 8;
const TAIL_OVERLAP = 2;
const OWNED_BADGE_HEIGHT = 16;
const OWNED_BADGE_GAP = 4;

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
    wrapperOwned: {
      width: 110,
      height: OWNED_SIZE + TAIL_HEIGHT - TAIL_OVERLAP + OWNED_BADGE_HEIGHT + OWNED_BADGE_GAP,
    },
    ownedBadge: {
      marginBottom: OWNED_BADGE_GAP,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: colors.statTilePurple,
    },
    ownedBadgeText: {
      fontSize: 10,
      fontWeight: "800",
      color: colors.textPrimary,
      lineHeight: 12,
    },
    pin: {
      width: SIZE,
      height: SIZE,
      borderRadius: SIZE / 2,
      borderWidth: 3,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    pinOwned: {
      width: OWNED_SIZE,
      height: OWNED_SIZE,
      borderRadius: OWNED_SIZE / 2,
      borderWidth: 4,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    fallback: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
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