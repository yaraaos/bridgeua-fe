import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "./AppButton.styles";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

export default function AppButton({ title, onPress, variant = "primary" }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" && styles.primaryText,
          variant === "secondary" && styles.secondaryText,
          variant === "ghost" && styles.ghostText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}