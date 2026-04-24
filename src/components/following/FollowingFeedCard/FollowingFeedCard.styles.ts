import { StyleSheet } from "react-native";

import { colors } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  feedCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 10,
  },
  feedCardTop: {
    flexDirection: "row",
    gap: 10,
  },
  businessImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  feedCardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  businessName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginRight: 8,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  recommendedText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  feedBody: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },
  feedTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  feedDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
