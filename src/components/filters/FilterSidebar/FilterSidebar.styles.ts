import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

const styles = StyleSheet.create({
  sidebar: {
    width: 118,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingTop: 8,
    backgroundColor: "#FBFBF9",
  },
  item: {
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accentOrange,
    marginRight: 8,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "transparent",
    marginRight: 8,
  },
  itemText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  itemTextActive: {
    color: colors.accentOrange,
  },
});

export default styles;
