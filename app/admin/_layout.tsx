import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAuthStore } from "@/src/store/auth.store";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function AdminLayout() {
  const { colors } = useAppTheme();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user?.isAdmin) {
      router.replace("/");
    }
  }, [user]);

  if (!user?.isAdmin) return null;

  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
      animation: "fade",
      animationDuration: 200,
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}