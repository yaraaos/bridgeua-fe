import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";
import { radius } from "../../../constants/radius";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    gap: 12,
    marginBottom: 12,
  },
  cardCompact: {
    padding: 8,
    gap: 10,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  imageCompact: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  ratingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#FFF5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ratingWrapCompact: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  ratingTextCompact: {
    fontSize: 11,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  recommended: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
});
