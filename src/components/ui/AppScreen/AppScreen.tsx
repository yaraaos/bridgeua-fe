import React, { PropsWithChildren } from "react";
import { ScrollView, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./AppScreen.styles";

type Props = PropsWithChildren<{
  scroll?: boolean;
  style?: ViewStyle;
  withTopInset?: boolean;
}>;

export default function AppScreen({
  children,
  scroll = false,
  style,
  withTopInset = true,
}: Props) {
  const edges = withTopInset
    ? (["top", "left", "right"] as const)
    : (["left", "right"] as const);

  if (scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={edges}>
        <ScrollView
          contentContainerStyle={[styles.content, style]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, styles.content, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}