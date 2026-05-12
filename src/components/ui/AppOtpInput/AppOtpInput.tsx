import React, { useRef, useState } from "react";
import {
    Keyboard,
    NativeSyntheticEvent,
    TextInput,
    TextInputKeyPressEventData,
    View,
} from "react-native";

import { styles } from "./AppOtpInput.styles";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
};

export default function AppOtpInput({
  value,
  onChange,
  length = 4,
  error = false,
}: Props) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const inputsRef = useRef<(TextInput | null)[]>([]);

  const values = value.split("");

  const handleChange = (text: string, index: number) => {
    const sanitized = text.replace(/[^0-9]/g, "");

    if (!sanitized) {
      return;
    }

    const nextValues = [...values];
    nextValues[index] = sanitized[0];

    const joined = nextValues.join("").slice(0, length);

    onChange(joined);
    if (joined.length === length) {
      Keyboard.dismiss();
    }

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (event.nativeEvent.key !== "Backspace") {
      return;
    }

    if (values[index]) {
      const nextValues = [...values];
      nextValues[index] = "";

      onChange(nextValues.join(""));
      return;
    }

    if (index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputsRef.current[index] = ref;
          }}
          value={values[index] ?? ""}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="number-pad"
          maxLength={1}
          style={[
            styles.input,
            focusedIndex === index && styles.inputFocused,
            error && styles.inputError,
          ]}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
        />
      ))}
    </View>
  );
}
