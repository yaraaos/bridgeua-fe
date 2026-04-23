import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { colors } from "../../../constants/colors";
import { LocationOption } from "../../../constants/locations";
import { styles } from "./LocationSelector.styles";

type Props = {
  label?: string;
  value?: string;
  options: LocationOption[];
  onSelectManual: (option: LocationOption) => void;
  onRequestNearby: () => void;
  subtitleLabel?: string;
  showChevron?: boolean;
};

export default function LocationSelector({
  label,
  value,
  options,
  onSelectManual,
  onRequestNearby,
  subtitleLabel = "Location",
  showChevron = true,
}: Props) {
  const triggerRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  const selectedLabel = useMemo(() => {
    if (label) return label;
    const found = options.find((option) => option.value === value);
    return found?.label ?? "Select location";
  }, [label, options, value]);

  const openDropdown = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPosition({
        top: y + height + 8,
        left: x,
      });
      setIsOpen(true);
    });
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSelect = (option: LocationOption) => {
    if (option.type === "nearby") {
      onRequestNearby();
    } else {
      onSelectManual(option);
    }

    closeDropdown();
  };

  return (
    <View style={styles.root} ref={triggerRef}>
      <Text style={styles.subtitleLabel}>{subtitleLabel}</Text>

      <Pressable style={styles.triggerRow} onPress={openDropdown}>
        <Text style={styles.subtitleValue}>{selectedLabel}</Text>

        {showChevron ? (
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={14}
            color={colors.textSecondary}
          />
        ) : null}
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.modalLayer}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.dropdown,
                  {
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                  },
                ]}
              >
                {options.map((option, index) => {
                  const isSelected = option.value === value;
                  const isNearby = option.type === "nearby";

                  return (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.option,
                        isSelected && styles.optionSelected,
                        index === options.length - 1 && styles.optionLast,
                      ]}
                      onPress={() => handleSelect(option)}
                    >
                      <View style={styles.optionContent}>
                        {isNearby ? (
                          <Ionicons
                            name="locate-outline"
                            size={16}
                            color={colors.primaryGreen}
                          />
                        ) : null}

                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </View>

                      {isSelected ? (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={colors.primaryGreen}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
