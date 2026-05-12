import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import type { TextInputProps } from "react-native";
import { Pressable, View } from "react-native";
import AppInput from "../AppInput/AppInput";
import { createStyles } from "./AppPasswordInput.styles";

type Props = TextInputProps & {
  error?: boolean;
  disabled?: boolean;
};

export default function AppPasswordInput(props: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <AppInput
        {...props}
        secureTextEntry={!isVisible}
        style={[props.style, styles.inputWithIcon]}
      />

      <Pressable
        style={styles.toggleButton}
        onPress={() => setIsVisible((current) => !current)}
        disabled={props.disabled}
        hitSlop={10}
      >
        <Feather
          name={isVisible ? "eye" : "eye-off"}
          size={18}
          color={colors.textMuted}
        />
      </Pressable>
    </View>
  );
}
