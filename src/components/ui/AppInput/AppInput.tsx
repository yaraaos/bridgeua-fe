import React, { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./AppInput.styles";

type Props = TextInputProps & {
  error?: boolean;
  disabled?: boolean;
};

export default function AppInput({ error, disabled, style, ...props }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrapper}>
      <TextInput
        editable={!disabled}
        placeholderTextColor={colors.textMuted}
        {...props}
        style={[
          styles.input,
          isFocused && styles.focused,
          error && styles.error,
          disabled && styles.disabled,
          style,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}