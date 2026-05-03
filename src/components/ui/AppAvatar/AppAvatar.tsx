import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "./AppAvatar.styles";

type Props = {
  imageUrl?: string;
  name: string;
  size?: "sm" | "md" | "lg";
};

export default function AppAvatar({ imageUrl, name, size = "md" }: Props) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <View style={[styles.container, styles[size]]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={[styles.initial, styles[`${size}Text`]]}>{initial}</Text>
      )}
    </View>
  );
}