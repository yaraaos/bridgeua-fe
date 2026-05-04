import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  tabsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: "transparent",
  },
  tabActive: {
    backgroundColor: colors.primaryGreenSoft,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primaryGreen,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  photoWrap: {
    overflow: "hidden",
    borderRadius: radius.md,
    backgroundColor: colors.primaryGreenSoft,
  },
  photoWide: {
    width: "100%",
    height: 220,
  },
  photoHalf: {
    width: "48.8%",
    height: 150,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
});
