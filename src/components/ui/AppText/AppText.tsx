import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { styles } from "./AppText.styles";

type Props = TextProps & {
  style?: StyleProp<TextStyle>;
};

export default function AppText({ style, ...props }: Props) {
  return <Text style={[styles.base, style]} {...props} />;
}
