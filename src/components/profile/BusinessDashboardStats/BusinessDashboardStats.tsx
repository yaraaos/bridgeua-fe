import React from "react";
import { View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";

import { createStyles } from "./BusinessDashboardStats.styles";

export type BusinessDashboardStatsProps = {
  bookings: number;
  bookingsDelta?: string;
  newClients: number;
  newClientsDelta?: string;
  followers: number;
  followersDelta?: string;
};

export default function BusinessDashboardStats({
  bookings,
  bookingsDelta,
  newClients,
  newClientsDelta,
  followers,
  followersDelta,
}: BusinessDashboardStatsProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={[styles.tile, styles.tileGreen]}>
        <Feather name="calendar" size={20} color={colors.primaryGreen} />
        <AppText style={styles.value}>{bookings}</AppText>
        <AppText style={styles.label}>{t("dashboard.bookings")}</AppText>
        <AppText style={styles.delta}>{bookingsDelta || "—"}</AppText>
      </View>

      <View style={[styles.tile, styles.tilePurple]}>
        <Ionicons name="people-outline" size={20} color="#7B5BD9" />
        <AppText style={styles.value}>{newClients}</AppText>
        <AppText style={styles.label}>{t("dashboard.newClients")}</AppText>
        <AppText style={styles.delta}>{newClientsDelta || "—"}</AppText>
      </View>

      <View style={[styles.tile, styles.tileBlue]}>
        <Ionicons name="person-add-outline" size={20} color="#2F80ED" />
        <AppText style={styles.value}>{followers}</AppText>
        <AppText style={styles.label}>{t("dashboard.followers")}</AppText>
        <AppText style={styles.delta}>{followersDelta || "—"}</AppText>
      </View>
    </View>
  );
}
