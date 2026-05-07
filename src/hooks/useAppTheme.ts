import { useColorScheme } from "react-native";
import { lightColors, darkColors, AppColors } from "@/src/constants/colors";
import { useAppStore } from "@/src/store/app.store";

export function useAppTheme(): { colors: AppColors; isDark: boolean } {
  const themeMode = useAppStore((s) => s.themeMode);
  const systemScheme = useColorScheme();

  const isDark =
    themeMode === "dark" ||
    (themeMode === "system" && systemScheme === "dark");

  return { colors: isDark ? darkColors : lightColors, isDark };
}