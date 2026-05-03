import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./BusinessInfoRow.styles";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
};

export default function BusinessInfoRow({ icon, title, value }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={18} style={styles.icon} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}