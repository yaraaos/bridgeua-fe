import { colors } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import { styles } from "./AppCheckBox.styles";

type Props = {
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
};

export default function AppCheckBox({ value, onChange, disabled }: Props) {
  const handlePress = () => {
    if (disabled) return;
    onChange?.(!value);
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <View
        style={[
          styles.box,
          value && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {value ? (
          <Ionicons name="checkmark" size={16} color={colors.white} />
        ) : null}
      </View>
    </Pressable>
  );
}
