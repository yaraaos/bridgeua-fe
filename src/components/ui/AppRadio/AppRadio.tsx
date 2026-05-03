import React from "react";
import { Pressable, View } from "react-native";
import { styles } from "./AppRadio.styles";

type Props = {
  selected: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

export default function AppRadio({ selected, onPress, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.outer,
          selected && styles.outerSelected,
          disabled && styles.disabled,
        ]}
      >
        {selected ? <View style={styles.inner} /> : null}
      </View>
    </Pressable>
  );
}