import { useAppTheme } from "@/src/hooks/useAppTheme";
import React, { PropsWithChildren } from "react";
import { ScrollView, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyles } from "./AppScreen.styles";

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
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const edges = withTopInset
    ? (["top", "left", "right"] as const)
    : (["left", "right"] as const);

  if (scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={edges}>
        <ScrollView
          contentContainerStyle={[styles.content, styles.scrollContent, style]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
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
