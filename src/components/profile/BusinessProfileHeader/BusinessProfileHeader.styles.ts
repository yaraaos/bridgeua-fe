//src/components/profile/BusinessProfileHeader/BusinessProfileHeader.styles.ts

import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { StyleSheet } from "react-native";

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: "#F5C28F",
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 14,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    username: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    profileRow: {
      marginTop: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    avatar: {
      width: 66,
      height: 66,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: "#FFFFFFAA",
    },
    avatarPlaceholder: {
      width: 66,
      height: 66,
      borderRadius: 999,
      backgroundColor: "#FFF2E3",
      borderWidth: 2,
      borderColor: "#FFFFFFAA",
      alignItems: "center",
      justifyContent: "center",
    },
    info: {
      flex: 1,
    },
    businessName: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    subInfo: {
      marginTop: 4,
      fontSize: 12,
      color: colors.textSecondary,
    },
    actionsRow: {
      marginTop: 14,
      flexDirection: "row",
      gap: 10,
    },
    secondaryButton: {
      flex: 1,
      minHeight: 36,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.cardGap,
      paddingHorizontal: 10,
    },
    secondaryButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    statsRow: {
      marginTop: 14,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#E9A96C",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statValue: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    statLabel: {
      marginTop: 2,
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
}