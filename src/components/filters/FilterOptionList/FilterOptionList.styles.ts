import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

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
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#B6B6B6",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    borderColor: colors.accentOrange,
    backgroundColor: colors.accentOrange,
  },
});

export default styles;
