//app/_layout.tsx

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { getNavigationTheme } from "@/src/theme/navigationTheme";

function RootLayoutInner() {
  const { colors, isDark } = useAppTheme();
  const navTheme = getNavigationTheme(colors, isDark);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{ headerShown: false }}
        // @ts-ignore — theme prop is valid for NavigationContainer used internally
        theme={navTheme}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal/filter"
          options={{
            presentation: "transparentModal",
            animation: "none",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutInner />
    </SafeAreaProvider>
  );
}