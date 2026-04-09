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
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
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