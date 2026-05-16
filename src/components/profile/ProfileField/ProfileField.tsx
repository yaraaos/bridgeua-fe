import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import React from "react";
import { View } from "react-native";
import { createStyles } from "./ProfileField.styles";

type Props = {
  label: string;
  helperText?: string;
  errorText?: string;
  children: React.ReactNode;
};

export default function ProfileField({
  label,
  helperText,
  errorText,
  children,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View>
      <AppText style={styles.label}>{label}</AppText>

      {children}

      {errorText ? (
        <AppText style={styles.errorText}>{errorText}</AppText>
      ) : null}

      {helperText ? (
        <AppText style={styles.helperText}>{helperText}</AppText>
      ) : null}
    </View>
  );
}
