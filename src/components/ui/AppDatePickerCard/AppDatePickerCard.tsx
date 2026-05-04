import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./AppDatePickerCard.styles";

type Props = {
  day: string; // e.g. "Mon"
  date: string; // e.g. "12"
  month?: string; // e.g. "May"
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export default function AppDatePickerCard({
  day,
  date,
  month,
  selected,
  disabled,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.card,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.day,
          selected && styles.textSelected,
          disabled && styles.textDisabled,
        ]}
      >
        {day}
      </Text>

      <Text
        style={[
          styles.date,
          selected && styles.textSelected,
          disabled && styles.textDisabled,
        ]}
      >
        {date}
      </Text>

      {!!month && (
        <Text
          style={[
            styles.month,
            selected && styles.textSelected,
            disabled && styles.textDisabled,
          ]}
        >
          {month}
        </Text>
      )}
    </Pressable>
  );
}