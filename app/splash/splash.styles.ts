import { StyleSheet } from "react-native";
import { colors } from "../../src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  center: {
    alignItems: "center",
  },

  logo: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  ua: {
    color: colors.primaryGreen,
  },

  subtitle: {
    marginTop: 8,
    color: "#FFFFFF",
    opacity: 0.9,
  },

  footer: {
    width: "100%",
  },
});
