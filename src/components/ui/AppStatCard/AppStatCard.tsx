import React from "react";
import { Text, View } from "react-native";
import { styles } from "./AppStatCard.styles";

type Props = {
  value: string | number;
  label: string;
  hint?: string;
};

export default function AppStatCard({ value, label, hint }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {!!hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}