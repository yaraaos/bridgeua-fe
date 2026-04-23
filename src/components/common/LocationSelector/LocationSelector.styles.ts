import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
  root: {
    position: "relative",
  },
  subtitleLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  subtitleValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  modalLayer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdown: {
    position: "absolute",
    width: 260,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 20,
  },
  option: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  optionSelected: {
    backgroundColor: colors.primaryGreenSoft,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primaryGreenDark,
    fontWeight: "600",
  },
});
