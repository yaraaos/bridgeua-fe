import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
  },
  leftBlock: {
    flex: 1,
    paddingTop: 4,
  },
  subtitleLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  subtitleValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  titleWrap: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 38,
  },
  titleSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInputWrap: {
    flex: 1,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accentOrange,
    alignItems: "center",
    justifyContent: "center",
  },
});
