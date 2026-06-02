import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function EditBusinessSocialRow({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const isFilled = value.trim().length > 0;

  return (
    <View style={styles.row}>
      <Ionicons
        name={icon}
        size={20}
        color={isFilled ? colors.primaryGreen : colors.textMuted}
      />
      <AppText style={styles.label}>{label}</AppText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: 13,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    label: {
      width: 84,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
    },
  });
}
