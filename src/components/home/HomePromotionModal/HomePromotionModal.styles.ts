import { StyleSheet } from "react-native";

import { colors } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 16,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 170,
    borderRadius: 18,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accentOrange,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  ctaButton: {
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accentOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
});
