import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Switch, TextInput, View } from "react-native";

import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";

function parseDigits(formatted: string): string {
  return formatted.replace(/\D/g, "").slice(0, 4).padStart(4, "0");
}

type TimeInputProps = {
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
  onFocus: () => void;
  onBlur: () => void;
};

function TimeInput({ value, onChange, hasError, onFocus, onBlur }: TimeInputProps) {
  const { colors } = useAppTheme();

  const [digits, setDigits] = useState(() => parseDigits(value));
  const prevProp = useRef(value);

  useEffect(() => {
    if (value !== prevProp.current) {
      prevProp.current = value;
      setDigits(parseDigits(value));
    }
  }, [value]);

  const displayValue = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;

  function handleKeyPress({ nativeEvent: { key } }: { nativeEvent: { key: string } }) {
    let newDigits: string;
    if (key === "Backspace") {
      newDigits = "0" + digits.slice(0, 3);
    } else if (/^[0-9]$/.test(key)) {
      newDigits = digits.slice(1) + key;
      if (parseInt(newDigits.slice(0, 2), 10) > 23) return;
      if (parseInt(newDigits.slice(2, 4), 10) > 59) return;
    } else {
      return;
    }
    setDigits(newDigits);
    onChange(`${newDigits.slice(0, 2)}:${newDigits.slice(2, 4)}`);
  }

  return (
    <TextInput
      value={displayValue}
      onChangeText={() => {}}
      onKeyPress={handleKeyPress}
      onFocus={onFocus}
      onBlur={onBlur}
      keyboardType="number-pad"
      style={[
        styles.timeInput,
        { borderColor: hasError ? colors.error : colors.border },
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
  onValidationChange: (isValid: boolean) => void;
};

export default function EditBusinessHourRow({
  label,
  isOpen,
  onToggle,
  openTime,
  closeTime,
  onOpenTimeChange,
  onCloseTimeChange,
  onValidationChange,
}: Props) {
  const { colors } = useAppTheme();
  const rowStyles = createRowStyles(colors);

  const [openTimeError, setOpenTimeError] = useState(false);
  const [closeTimeError, setCloseTimeError] = useState(false);

  const isValid = !isOpen || (openTime !== "" && closeTime !== "");

  useEffect(() => {
    if (!isOpen) {
      setOpenTimeError(false);
      setCloseTimeError(false);
    }
  }, [isOpen]);

  // Notify parent whenever validity changes; intentionally excludes onValidationChange
  // from deps since it is recreated on every parent render but its behavior is stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onValidationChange(isValid); }, [isValid]);

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
            hasError={openTimeError}
            onBlur={() => { if (openTime === "") setOpenTimeError(true); }}
            onFocus={() => setOpenTimeError(false)}
          />
          <AppText style={rowStyles.timeSep}>–</AppText>
          <TimeInput
            value={closeTime}
            onChange={onCloseTimeChange}
            hasError={closeTimeError}
            onBlur={() => { if (closeTime === "") setCloseTimeError(true); }}
            onFocus={() => setCloseTimeError(false)}
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
