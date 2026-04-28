import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
  },
  mainImageWrap: {
    flex: 1.4,
    height: 210,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.primaryGreenSoft,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  sideColumn: {
    flex: 1,
    gap: spacing.sm,
  },
  sideImageWrap: {
    height: 101,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.primaryGreenSoft,
  },
  sideImage: {
    width: "100%",
    height: "100%",
  },
  viewAllOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.36)",
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
});