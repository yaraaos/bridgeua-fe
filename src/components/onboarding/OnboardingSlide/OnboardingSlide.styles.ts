import { colors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  brandWrap: {
    alignItems: "center",
    marginBottom: 44,
  },

  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  tagline: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },

  cardsWrap: {
    alignItems: "center",
    gap: 20,
  },

  card: {
    width: "100%",
    height: 208,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
  },

  imageBackground: {
    flex: 1,
  },

  imageRadius: {
    borderRadius: 16,
  },

  imageOverlay: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  cardEyebrow: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },

  cardSubtitle: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 17,
    color: "#FFFFFF",
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.95,
  },
  dotsWrap: {
    marginTop: 18,
    alignItems: "center",
  },
});
