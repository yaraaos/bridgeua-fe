import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "./AppTimeSlot.styles";

type Props = {
  label: string; // e.g. "09:00"
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export default function AppTimeSlot({
  label,
  selected,
  disabled,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.slot,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.text,
          selected && styles.textSelected,
          disabled && styles.textDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}