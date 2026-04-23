import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#FFF5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  containerCompact: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111111",
  },
  textCompact: {
    fontSize: 11,
  },
});