import AppText from "@/src/components/ui/AppText/AppText";
import ClearableInput from "@/src/components/ui/ClearableInput";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
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

  const handleOpen = () => {
    Keyboard.dismiss();

    setDraftDate(value ? new Date(value) : new Date());

    setIsOpen(true);
  };

  const handleDateChange = (
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
    onChange(draftDate.toISOString().split("T")[0]);

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
              display={Platform.OS === "ios" ? "spinner" : "spinner"}
              maximumDate={new Date()}
              onChange={handleDateChange}
              style={styles.picker}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
