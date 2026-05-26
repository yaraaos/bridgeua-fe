import React from "react";
import { StyleSheet, Switch, TextInput, View } from "react-native";

import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type Props = {
  label: string;
  isOpen: boolean;
  onToggle: (value: boolean) => void;
  openTime: string;
  closeTime: string;
  onOpenTimeChange: (value: string) => void;
  onCloseTimeChange: (value: string) => void;
};

export default function EditBusinessHourRow({
  label,
  isOpen,
  onToggle,
  openTime,
  closeTime,
  onOpenTimeChange,
  onCloseTimeChange,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.row}>
      <AppText style={styles.dayLabel}>{label}</AppText>

      <Switch
        value={isOpen}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primaryGreenSoft }}
        thumbColor={isOpen ? colors.primaryGreen : colors.textMuted}
      />

      {isOpen ? (
        <View style={styles.timesRow}>
          <TextInput
            style={styles.timeInput}
            value={openTime}
            onChangeText={onOpenTimeChange}
            placeholder="09:00"
            placeholderTextColor={colors.textMuted}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
          />
          <AppText style={styles.timeSep}>–</AppText>
          <TextInput
            style={styles.timeInput}
            value={closeTime}
            onChangeText={onCloseTimeChange}
            placeholder="18:00"
            placeholderTextColor={colors.textMuted}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
          />
        </View>
      ) : (
        <AppText style={styles.closedText}>Closed</AppText>
      )}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    dayLabel: {
      width: 88,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    timesRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    timeInput: {
      width: 54,
      height: 36,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      textAlign: "center",
      fontSize: 13,
      color: colors.textPrimary,
    },
    timeSep: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    closedText: {
      flex: 1,
      fontSize: 14,
      color: colors.textMuted,
    },
  });
}
