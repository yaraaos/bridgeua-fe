import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

import AppText from "@/src/components/ui/AppText/AppText";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type Props = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
};

export default function SelectableChip({ label, icon, selected, onPress }: Props) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primaryGreen : colors.surface,
          borderColor: selected ? colors.primaryGreen : colors.border,
        },
      ]}
      onPress={onPress}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? colors.white : colors.textSecondary}
        />
      )}
      <AppText
        style={[
          styles.label,
          { color: selected ? colors.white : colors.textPrimary },
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
});
