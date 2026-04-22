//app/profile/personal.tsx

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import { colors } from "../../src/constants/colors";

export default function PersonalProfileScreen() {
  return (
    <AppScreen style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.username}>kate1111</Text>
          <Text style={styles.name}>Kateryna Zelenska</Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>58</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>11</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Businesses</Text>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <AppButton
            title="Edit Profile"
            variant="secondary"
            onPress={() => router.push("/profile/edit")}
          />
          <AppButton
            title="Saved"
            variant="ghost"
            onPress={() => router.push("/profile/saved")}
          />
        </View>

        {/* SECTION: REVIEWS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Reviews</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Zelenska Beauty</Text>
            <Text style={styles.cardText}>
              Amazing service, super clean and professional. Will definitely come back!
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tory Pro Nails</Text>
            <Text style={styles.cardText}>
              Loved the attention to detail and the final result.
            </Text>
          </View>
        </View>

        {/* SECTION: BUSINESSES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Businesses</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Zelenska Beauty</Text>
            <Text style={styles.cardText}>Beauty • California</Text>
          </View>
        </View>

        {/* SETTINGS */}
        <View style={styles.footer}>
          <AppButton
            title="Settings"
            onPress={() => router.push("/settings")}
          />
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
    paddingBottom: 32,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  username: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  name: {
    marginTop: 6,
    fontSize: 16,
    color: colors.textSecondary,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
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
  },

  actions: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },

  section: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  footer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
});