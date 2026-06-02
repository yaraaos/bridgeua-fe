import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";

import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";

const ITEM_HEIGHT = 44;
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

function timeToDate(time: string) {
  const [hours = "9", minutes = "0"] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date;
}

function dateToTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

type IOSPickerProps = {
  visible: boolean;
  initialTime: string;
  onConfirm: (time: string) => void;
  onCancel: () => void;
  colors: AppColors;
};

function IOSTimePicker({
  visible,
  initialTime,
  onConfirm,
  onCancel,
  colors,
}: IOSPickerProps) {
  const [h, m] = initialTime.split(":");
  const [selectedHour, setSelectedHour] = useState(h ?? "09");
  const [selectedMinute, setSelectedMinute] = useState(m ?? "00");

  const hourRef = useRef<ScrollView>(null);
  const minuteRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      const [initH, initM] = initialTime.split(":");
      setSelectedHour(initH ?? "09");
      setSelectedMinute(initM ?? "00");
      setTimeout(() => {
        hourRef.current?.scrollTo({
          y: Number(initH ?? 9) * ITEM_HEIGHT,
          animated: false,
        });
        minuteRef.current?.scrollTo({
          y: Number(initM ?? 0) * ITEM_HEIGHT,
          animated: false,
        });
      }, 50);
    }
  }, [visible, initialTime]);

  const pickerStyles = createPickerStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={pickerStyles.backdrop} onPress={onCancel} />
      <View style={pickerStyles.sheet}>
        <View style={pickerStyles.toolbar}>
          <Pressable onPress={onCancel}>
            <AppText style={pickerStyles.toolbarCancel}>Cancel</AppText>
          </Pressable>
          <AppText style={pickerStyles.toolbarTitle}>Select Time</AppText>
          <Pressable
            onPress={() =>
              onConfirm(
                `${selectedHour.padStart(2, "0")}:${selectedMinute.padStart(2, "0")}`,
              )
            }
          >
            <AppText style={pickerStyles.toolbarDone}>Done</AppText>
          </Pressable>
        </View>

        <View style={pickerStyles.wheelsRow}>
          <View style={pickerStyles.wheelWrapper}>
            <ScrollView
              ref={hourRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.y / ITEM_HEIGHT,
                );
                setSelectedHour(HOURS[Math.max(0, Math.min(index, 23))]);
              }}
            >
              {HOURS.map((hour) => (
                <View key={hour} style={pickerStyles.wheelItem}>
                  <AppText
                    style={[
                      pickerStyles.wheelItemText,
                      selectedHour === hour && pickerStyles.wheelItemSelected,
                    ]}
                  >
                    {hour}
                  </AppText>
                </View>
              ))}
            </ScrollView>
            <View style={pickerStyles.selectionOverlay} pointerEvents="none" />
          </View>

          <AppText style={pickerStyles.colon}>:</AppText>

          <View style={pickerStyles.wheelWrapper}>
            <ScrollView
              ref={minuteRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.y / ITEM_HEIGHT,
                );
                setSelectedMinute(MINUTES[Math.max(0, Math.min(index, 59))]);
              }}
            >
              {MINUTES.map((minute) => (
                <View key={minute} style={pickerStyles.wheelItem}>
                  <AppText
                    style={[
                      pickerStyles.wheelItemText,
                      selectedMinute === minute &&
                        pickerStyles.wheelItemSelected,
                    ]}
                  >
                    {minute}
                  </AppText>
                </View>
              ))}
            </ScrollView>
            <View style={pickerStyles.selectionOverlay} pointerEvents="none" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
  const [activePicker, setActivePicker] = useState<"open" | "close" | null>(
    null,
  );

  const isValid = !isOpen || (openTime !== "" && closeTime !== "");

  useEffect(() => {
    if (!isOpen) {
      setOpenTimeError(false);
      setCloseTimeError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid]);

  const handleConfirm = (time: string) => {
    if (activePicker === "open") {
      onOpenTimeChange(time);
    } else {
      onCloseTimeChange(time);
    }
    setActivePicker(null);
  };

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
          <Pressable
            style={[
              rowStyles.timeInput,
              { borderColor: openTimeError ? colors.error : colors.border },
            ]}
            onPress={() => {
              setOpenTimeError(false);
              setActivePicker("open");
            }}
          >
            <AppText style={rowStyles.timeText}>{openTime || "09:00"}</AppText>
          </Pressable>

          <AppText style={rowStyles.timeSep}>–</AppText>

          <Pressable
            style={[
              rowStyles.timeInput,
              { borderColor: closeTimeError ? colors.error : colors.border },
            ]}
            onPress={() => {
              setCloseTimeError(false);
              setActivePicker("close");
            }}
          >
            <AppText style={rowStyles.timeText}>{closeTime || "18:00"}</AppText>
          </Pressable>
        </View>
      ) : (
        <AppText style={rowStyles.closedText}>Closed</AppText>
      )}

      {Platform.OS === "android" && activePicker ? (
        <DateTimePicker
          value={timeToDate(
            activePicker === "open"
              ? openTime || "09:00"
              : closeTime || "18:00",
          )}
          mode="time"
          is24Hour
          display="default"
          onChange={(event, selectedDate) => {
            setActivePicker(null);
            if (event.type === "dismissed" || !selectedDate) return;
            handleConfirm(dateToTime(selectedDate));
          }}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <IOSTimePicker
          visible={activePicker !== null}
          initialTime={
            activePicker === "open" ? openTime || "09:00" : closeTime || "18:00"
          }
          onConfirm={handleConfirm}
          onCancel={() => setActivePicker(null)}
          colors={colors}
        />
      ) : null}
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
    timeInput: {
      width: 64,
      height: 36,
      borderWidth: 1,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    timeText: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textPrimary,
    },
  });
}

function createPickerStyles(colors: AppColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: spacing.xl,
    },
    toolbar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    toolbarCancel: {
      fontSize: 16,
      color: colors.textMuted,
    },
    toolbarTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    toolbarDone: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primaryGreen,
    },
    wheelsRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: ITEM_HEIGHT * 5,
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    wheelWrapper: {
      width: 72,
      height: ITEM_HEIGHT * 5,
      overflow: "hidden",
    },
    wheelItem: {
      height: ITEM_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    wheelItemText: {
      fontSize: 22,
      color: colors.textMuted,
    },
    wheelItemSelected: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    selectionOverlay: {
      position: "absolute",
      top: ITEM_HEIGHT * 2,
      left: 0,
      right: 0,
      height: ITEM_HEIGHT,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    colon: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
  });
}
