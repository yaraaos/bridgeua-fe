import { useAppTheme } from "@/src/hooks/useAppTheme";
import React from "react";
import { Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { createStyles } from "./AppButton.styles";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "accent";
  size?: "sm" | "md";
  disabled?: boolean;
  disabledPressable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  disabledPressable = false,
  style,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      onPress={disabled && !disabledPressable ? undefined : onPress}
      style={[
        styles.base,
        size === "sm" && styles.baseSm,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        variant === "accent" && styles.accent,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === "sm" && styles.textSm,
          variant === "primary" && styles.primaryText,
          variant === "secondary" && styles.secondaryText,
          variant === "ghost" && styles.ghostText,
          variant === "accent" && styles.accentText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
