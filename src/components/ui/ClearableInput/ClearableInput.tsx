import AppInput from "@/src/components/ui/AppInput/AppInput";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Keyboard,
  Pressable,
  TextInputProps,
  View,
} from "react-native";
import { createStyles } from "./ClearableInput.styles";

type ClearableInputProps = TextInputProps & {
  value: string;
  onClear: () => void;
  rightSlot?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
};

export default function ClearableInput({
  value,
  onClear,
  rightSlot,
  error,
  disabled = false,
  editable,
  style,
  ...props
}: ClearableInputProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const isEditable = editable ?? !disabled;

  const handleClear = () => {
    Keyboard.dismiss();
    onClear();
  };

  return (
    <View style={styles.inputWrap}>
      <AppInput
        {...props}
        value={value}
        editable={isEditable}
        style={[styles.input, style]}
      />

      <View style={styles.rightContent}>
        {rightSlot}

        {value ? (
          <Pressable
            onPress={handleClear}
            disabled={!isEditable}
            hitSlop={10}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}