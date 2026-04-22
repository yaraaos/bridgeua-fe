//src/components/bookings/SpecialistCard/SpecialistCard.styles.ts

import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";
import { radius } from "../../../constants/radius";

const styles = StyleSheet.create({
  card: {
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
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 999,
  },
  avatarPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  nameWrap: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  role: {
    fontSize: 12,
    color: colors.primaryGreen,
    marginTop: 1,
  },
  badge: {
    backgroundColor: "#1F1F1F",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
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