import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./GradientHeader.styles";

type GradientColors = readonly [string, string, ...string[]];

type Props = PropsWithChildren<{
  colors?: GradientColors;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
}>;

const DARK_DISCOVERY_GRADIENT = ["#102019", "#183327", "#0F1A16"] as const;

export default function GradientHeader({
  children,
  colors,
  style,
  innerStyle,
}: Props) {
  const { isDark } = useAppTheme();

  const headerColors =
    colors ?? (isDark ? DARK_DISCOVERY_GRADIENT : DISCOVERY_GRADIENT);

  return (
    <LinearGradient
      colors={headerColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <SafeAreaView edges={["top"]}>
        <View style={[styles.inner, innerStyle]}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}
