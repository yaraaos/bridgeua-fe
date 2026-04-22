//FE — src/components/bookings/ServiceSelectionCard/ServiceSelectionCard.styles.ts

import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";
import { radius } from "../../../constants/radius";

const styles = StyleSheet.create({
  card: {
    minHeight: 88,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardSelected: {
    borderColor: colors.primaryGreen,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metaDot: {
    marginHorizontal: 6,
    fontSize: 12,
    color: colors.textMuted,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleSelected: {
    borderColor: colors.primaryGreen,
    backgroundColor: colors.primaryGreen,
  },
});

export default styles;