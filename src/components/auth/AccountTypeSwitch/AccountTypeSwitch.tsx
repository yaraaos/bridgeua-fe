import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./AccountTypeSwitch.styles";

type SwitchOption<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  options: [SwitchOption<T>, SwitchOption<T>];
  value: T;
  onChange: (value: T) => void;
};

export default function AccountTypeSwitch<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.switchRow}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <Pressable
            key={option.value}
            style={[styles.switchTab, isActive && styles.switchTabActive]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[styles.switchText, isActive && styles.switchTextActive]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}