//app/profile/business.tsx

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BusinessProfileHeader from "../../src/components/profile/BusinessProfileHeader/BusinessProfileHeader";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function BusinessProfileScreen() {
  return (
    <AppScreen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <BusinessProfileHeader
          username="zlnska.beauty"
          businessName="Zelenska Beauty"
          category="Beauty"
          location="California"
          avatarUrl="https://picsum.photos/200/200?31"
          followersCount={244}
          followingCount={69}
          reviewsCount={92}
          businessesCount={1}
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>This week</Text>
          <Text style={styles.cardText}>24 upcoming bookings</Text>
          <Text style={styles.cardText}>69 new clients</Text>
          <Text style={styles.cardText}>92 profile views</Text>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  content: {
    paddingBottom: 24,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});