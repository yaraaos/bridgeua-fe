import { useAppTheme } from "@/src/hooks/useAppTheme";
import React from "react";
import { Image, Text, View } from "react-native";
import { createStyles } from "./AppAvatar.styles";

type Props = {
  name?: string;
  username?: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
};

const AVATAR_COLORS = [
  "#1F5E46",
  "#F79A2E",
  "#6C63FF",
  "#2F80ED",
  "#9B51E0",
  "#EB5757",
  "#219653",
];

function getInitial(username?: string, name?: string) {
  const value = username?.trim() || name?.trim() || "?";

  return value.charAt(0).toUpperCase();
}

function getAvatarColor(username?: string, name?: string) {
  const value = username?.trim() || name?.trim() || "user";

  const index =
    value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    AVATAR_COLORS.length;

  return AVATAR_COLORS[index];
}

export default function AppAvatar({
  imageUrl,
  name,
  username,
  size = "md",
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const initial = getInitial(username, name);
  const fallbackColor = getAvatarColor(username, name);

  return (
    <View
      style={[
        styles.container,
        styles[size],
        !imageUrl && { backgroundColor: fallbackColor },
      ]}
    >
      {!!imageUrl?.trim() ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={[styles.initial, styles[`${size}Text`]]}>{initial}</Text>
      )}
    </View>
  );
}
