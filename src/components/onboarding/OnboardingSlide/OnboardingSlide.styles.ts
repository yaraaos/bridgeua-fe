import { colors } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  brandWrap: {
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.primaryGreenDark,
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
    height: 238,
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
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },

  cardSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 18,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontStyle: "normal",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dotsWrap: {
    marginTop: 18,
    alignItems: "center",
  },
});
