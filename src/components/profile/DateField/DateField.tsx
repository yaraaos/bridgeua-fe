import AppText from "@/src/components/ui/AppText/AppText";
import ClearableInput from "@/src/components/ui/ClearableInput";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Keyboard, Modal, Platform, Pressable, View } from "react-native";
import { createStyles } from "./DateField.styles";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function DateField({
  value,
  onChange,
  placeholder = "Select date",
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [isOpen, setIsOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(
    value ? new Date(value) : new Date(),
  );

  const handleAndroidChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type !== "set" || !selectedDate) {
      return;
    }

    onChange(formatDate(selectedDate));
  };

  const handleOpen = () => {
    Keyboard.dismiss();

    const nextDate = value ? new Date(value) : new Date();
    setDraftDate(nextDate);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: nextDate,
        mode: "date",
        display: "spinner",
        maximumDate: new Date(),
        onChange: handleAndroidChange,
      });

      return;
    }

    setIsOpen(true);
  };

  const handleIosDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) {
      setDraftDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    onChange(formatDate(draftDate));
    setIsOpen(false);
  };

  return (
    <>
      <Pressable onPress={handleOpen}>
        <ClearableInput
          value={value}
          onClear={() => onChange("")}
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
          rightSlot={
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.textMuted}
            />
          }
        />
      </Pressable>

      {Platform.OS === "ios" ? (
        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Pressable onPress={() => setIsOpen(false)}>
                  <AppText style={styles.cancel}>Cancel</AppText>
                </Pressable>

                <AppText style={styles.title}>Date of birth</AppText>

                <Pressable onPress={handleConfirm}>
                  <AppText style={styles.done}>Done</AppText>
                </Pressable>
              </View>

              <DateTimePicker
                value={draftDate}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={handleIosDateChange}
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}
