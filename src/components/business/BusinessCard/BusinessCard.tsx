import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";
import { radius } from "../../../constants/radius";
import { Business } from "../../../types/business";

type Props = {
  business: Business;
};

export default function BusinessCard({ business }: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/business/[id]",
          params: { id: business.id },
        })
      }
    >
      <Image source={{ uri: business.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{business.name}</Text>
        <Text style={styles.meta}>{business.category}</Text>
        <Text style={styles.meta}>{business.location}</Text>
        <Text style={styles.recommended}>{business.recommendedBy}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  info: {
    flex: 1,
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
