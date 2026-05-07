import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./AppText.styles";

type Props = TextProps & {
  style?: StyleProp<TextStyle>;
};

export default function AppText({ style, ...props }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return <Text style={[styles.base, style]} {...props} />;
}