import { Dimensions, StyleSheet } from "react-native";

import { colors } from "@/src/constants/colors";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const HOME_PROMOTION_BANNER_HORIZONTAL_MARGIN = 16;
export const HOME_PROMOTION_BANNER_WIDTH =
  SCREEN_WIDTH - HOME_PROMOTION_BANNER_HORIZONTAL_MARGIN * 2;

export const HOME_PROMOTION_BANNER_HEIGHT = 120;

export const styles = StyleSheet.create({
  wrapper: {
    height: HOME_PROMOTION_BANNER_HEIGHT,
    marginHorizontal: HOME_PROMOTION_BANNER_HORIZONTAL_MARGIN,
    marginTop: 12,
    marginBottom: 12,
  },
  window: {
    width: "100%",
    height: HOME_PROMOTION_BANNER_HEIGHT,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  slide: {
    width: HOME_PROMOTION_BANNER_WIDTH,
    height: HOME_PROMOTION_BANNER_HEIGHT,
  },
  image: {
    flex: 1,
    justifyContent: "space-between",
    padding: 14,
  },
  imageRadius: {
    borderRadius: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 3,
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: colors.accentOrange,
    paddingHorizontal: 12,
    paddingVertical: 5,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.white,
  },
  content: {
    zIndex: 2,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "900",
    color: colors.white,
    marginBottom: 4,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.white,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.textPrimary,
  },
});
