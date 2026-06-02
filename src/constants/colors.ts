export type AppColors = typeof lightColors;

export const lightColors = {
  primaryGreen: "#1F5E46",
  primaryGreenDark: "#184C38",
  primaryGreenSoft: "#DDEBE4",
  accentOrange: "#F79A2E",
  accentOrangeSoft: "#FDE8CF",
  white: "#FFFFFF",
  background: "#F7F7F5",
  surface: "#FFFFFF",
  border: "#E6E6E1",
  textPrimary: "#161616",
  textSecondary: "#5E665F",
  textMuted: "#98A09A",
  error: "#D9534F",
  errorSoft: "#FADADD",
  statTilePurple: "#EDE7FB",
  statTileBlue: "#E0EEFC",
};

export const darkColors: AppColors = {
  primaryGreen: "#1F5E46",
  primaryGreenDark: "#184C38",
  primaryGreenSoft: "#1A3D2E",
  accentOrange: "#F79A2E",
  accentOrangeSoft: "#3D2810",
  white: "#FFFFFF",
  background: "#0F1A16",
  surface: "#1C2B24",
  border: "#2A3D32",
  textPrimary: "#F2F5F3",
  textSecondary: "#8FA896",
  textMuted: "#5A7063",
  error: "#D9534F",
  errorSoft: "#3D1010",
  statTilePurple: "#2A2342",
  statTileBlue: "#1C2D44",
};

// Backward-compatible default export (light palette)
export const colors = lightColors;
