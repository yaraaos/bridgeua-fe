import React from "react";
import { View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";

import { createStyles } from "./BusinessDashboardStats.styles";

export type BusinessDashboardStatsProps = {
  bookings: number;
  bookingsDelta?: string;
  newClients: number;
  newClientsDelta?: string;
  profileViews: number;
  profileViewsDelta?: string;
};

export default function BusinessDashboardStats({
  bookings,
  bookingsDelta = "+12% vs last week",
  newClients,
  newClientsDelta = "+25% vs last week",
  profileViews,
  profileViewsDelta = "+8% vs last week",
}: BusinessDashboardStatsProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.row}>
      <View style={[styles.tile, styles.tileGreen]}>
        <Feather name="calendar" size={20} color={colors.primaryGreen} />
        <AppText style={styles.value}>{bookings}</AppText>
        <AppText style={styles.label}>Bookings</AppText>
        <AppText style={styles.delta}>{bookingsDelta}</AppText>
      </View>

      <View style={[styles.tile, styles.tilePurple]}>
        <Ionicons name="people-outline" size={20} color="#7B5BD9" />
        <AppText style={styles.value}>{newClients}</AppText>
        <AppText style={styles.label}>New clients</AppText>
        <AppText style={styles.delta}>{newClientsDelta}</AppText>
      </View>

      <View style={[styles.tile, styles.tileBlue]}>
        <Feather name="eye" size={20} color="#2F80ED" />
        <AppText style={styles.value}>{profileViews}</AppText>
        <AppText style={styles.label}>Profile views</AppText>
        <AppText style={styles.delta}>{profileViewsDelta}</AppText>
      </View>
    </View>
  );
}
