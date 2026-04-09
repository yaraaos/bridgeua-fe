import React, { PropsWithChildren } from "react";
import { View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./GradientHeader.styles";

type GradientColors = readonly [string, string, ...string[]];

type Props = PropsWithChildren<{
  colors?: GradientColors;
  style?: ViewStyle;
}>;

export default function GradientHeader({ children, colors, style }: Props) {
  return (
    <LinearGradient
      colors={colors ?? (["#C8DBD0", "#DDE9E2", "#F7F7F5"] as const)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <SafeAreaView edges={["top"]}>
        <View style={styles.inner}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}