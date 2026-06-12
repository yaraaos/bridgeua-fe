import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "fade",
        animationDuration: 200,
      }}
    />
  );
}
