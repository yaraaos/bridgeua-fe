//app/_layout.tsx

import { useAppTheme } from "@/src/hooks/useAppTheme";
import { getNavigationTheme } from "@/src/theme/navigationTheme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
        <Stack.Screen
          name="modal/image-viewer"
          options={{
            presentation: "transparentModal",
            animation: "fade",
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
