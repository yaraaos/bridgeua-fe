import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { AppColors } from "@/src/constants/colors";

export function getNavigationTheme(colors: AppColors, isDark: boolean): Theme {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primaryGreen,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.accentOrange,
    },
  };
}