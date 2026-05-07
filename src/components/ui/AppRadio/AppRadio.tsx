import React from "react";
import { Pressable, View } from "react-native";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./AppRadio.styles";

type Props = {
  selected: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

export default function AppRadio({ selected, onPress, disabled }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

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