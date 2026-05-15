import { useAppTheme } from "@/src/hooks/useAppTheme";
import React, { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
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
        returnKeyType={props.returnKeyType ?? "done"}
        submitBehavior={props.submitBehavior ?? "blurAndSubmit"}
        style={[
          styles.input,
          isFocused && styles.focused,
          error && styles.error,
          disabled && styles.disabled,
          style,
        ]}
        onFocus={(event) => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          props.onBlur?.(event);
        }}
      />
    </View>
  );
}
