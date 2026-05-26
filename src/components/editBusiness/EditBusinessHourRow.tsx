import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Switch, TextInput, View } from "react-native";

import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type TimeInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

function TimeInput({ value, onChange, placeholder = "09:00" }: TimeInputProps) {
  const { colors } = useAppTheme();

  function toRaw(formatted: string): string {
    return formatted.replace(/\D/g, "").slice(0, 4);
  }

  function formatDigits(digits: string): string {
    switch (digits.length) {
      case 0:
        return "";
      case 1:
        return `${digits[0]}:`;
      case 2:
        return `${digits}:`;
      case 3:
        return `${digits.slice(0, 2)}:${digits[2]}`;
      default:
        return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    }
  }

  const [raw, setRaw] = useState(() => toRaw(value));
  const prevProp = useRef(value);

  useEffect(() => {
    if (value !== prevProp.current) {
      prevProp.current = value;
      setRaw(toRaw(value));
    }
  }, [value]);

  function handleChange(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 4);

    if (digits.length >= 2 && parseInt(digits.slice(0, 2), 10) > 23) return;
    if (digits.length === 4 && parseInt(digits.slice(2, 4), 10) > 59) return;

    setRaw(digits);
    onChange(digits.length === 4 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : "");
  }

  function handleBlur() {
    if (raw.length < 4) {
      setRaw("");
      onChange("");
    }
  }

  const displayValue = formatDigits(raw);

  return (
    <TextInput
      value={displayValue}
      onChangeText={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      keyboardType="number-pad"
      maxLength={5}
      style={[
        styles.timeInput,
        { borderColor: colors.border },
        { color: colors.textPrimary, backgroundColor: colors.surface },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  timeInput: {
    width: 54,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 13,
  },
});

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
  const rowStyles = createRowStyles(colors);

  return (
    <View style={rowStyles.row}>
      <AppText style={rowStyles.dayLabel}>{label}</AppText>

      <Switch
        value={isOpen}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primaryGreenSoft }}
        thumbColor={isOpen ? colors.primaryGreen : colors.textMuted}
      />

      {isOpen ? (
        <View style={rowStyles.timesRow}>
          <TimeInput
            value={openTime}
            onChange={onOpenTimeChange}
            placeholder="09:00"
          />
          <AppText style={rowStyles.timeSep}>–</AppText>
          <TimeInput
            value={closeTime}
            onChange={onCloseTimeChange}
            placeholder="18:00"
          />
        </View>
      ) : (
        <AppText style={rowStyles.closedText}>Closed</AppText>
      )}
    </View>
  );
}

function createRowStyles(colors: AppColors) {
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
