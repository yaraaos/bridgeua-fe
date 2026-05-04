import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/src/constants/colors";
import { styles } from "./AppSelect.styles";

type Props = {
  label?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  onPress?: () => void;
};

export default function AppSelect({
  label,
  value,
  placeholder = "Select option",
  disabled,
  error,
  onPress,
}: Props) {
  const displayValue = value || placeholder;

  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.select,
          error && styles.selectError,
          disabled && styles.selectDisabled,
        ]}
      >
        <Text
          style={[
            styles.value,
            !value && styles.placeholder,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {displayValue}
        </Text>

        <Ionicons
          name="chevron-down"
          size={18}
          color={disabled ? colors.textMuted : colors.textSecondary}
        />
      </Pressable>
    </View>
  );
}