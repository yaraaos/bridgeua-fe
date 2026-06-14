// app/_layout.tsx

import "@/src/i18n";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLanguageSync } from "@/src/hooks/useLanguageSync";
import { getNavigationTheme } from "@/src/theme/navigationTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

LogBox.ignoreLogs(["already reviewed", "You have already reviewed"]);

function RootLayoutInner() {
  const { colors, isDark } = useAppTheme();
  const navTheme = getNavigationTheme(colors, isDark);
  const [queryClient] = useState(() => new QueryClient());
  useLanguageSync();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={colors.background}
        translucent
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade",
          animationDuration: 200,
        }}
        // @ts-ignore — theme prop is valid for NavigationContainer used internally
        theme={navTheme}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admin" />
        <Stack.Screen
          name="auth"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="modal/filter"
          options={{
            presentation: "transparentModal",
            animation: "none",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="modal/image-viewer"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="modal/switch-account"
          options={{
            presentation: "transparentModal",
            animation: "none",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutInner />
    </SafeAreaProvider>
  );
}
