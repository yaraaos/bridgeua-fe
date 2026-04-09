import React, { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { styles } from "./AppInput.styles";

type Props = TextInputProps & {
  error?: boolean;
  disabled?: boolean;
};

export default function AppInput({ error, disabled, style, ...props }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TextInput
        editable={!disabled}
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