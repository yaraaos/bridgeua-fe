import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";
import { radius } from "../../../constants/radius";

const styles = StyleSheet.create({
  title: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  optionsWrap: {
    gap: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#999999",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: colors.accentOrange,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accentOrange,
  },
  customWrap: {
    marginLeft: 10,
    minHeight: 30,
    minWidth: 112,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  kmText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default styles;
