import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buttonInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#2DBE7F",
  },
  buttonActive: {
    backgroundColor: "#2DBE7F",
    borderColor: "#2DBE7F",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  buttonTextInactive: {
    color: "#2DBE7F",
  },
  buttonTextActive: {
    color: "#FFFFFF",
  },
});