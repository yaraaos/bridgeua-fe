import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import type { CountryCode } from "libphonenumber-js";
import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import IntlPhoneField from "react-native-intl-phone-field";
import { createStyles } from "./PhoneField.styles";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
};

export default function PhoneField({
  value,
  onChange,
  onValidationChange,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [inputKey, setInputKey] = useState(0);

  const defaultCountry = useMemo<CountryCode>(() => {
    return (Localization.getLocales()[0]?.regionCode ?? "ES") as CountryCode;
  }, []);

  const handleClear = () => {
    onChange("");

    onValidationChange(false);

    setInputKey((currentKey) => currentKey + 1);
  };

  return (
    <View style={styles.wrap}>
      <IntlPhoneField
        key={inputKey}
        defaultCountry={defaultCountry}
        defaultValue={value}
        flagUndetermined=""
        onValueUpdate={onChange}
        onValidation={onValidationChange}
        containerStyle={styles.container}
        textInputStyle={styles.input}
        flagTextStyle={styles.flag}
        textInputProps={{
          placeholder: "Add phone number",
          returnKeyType: "done",
        }}
      />

      {value.trim().length > 0 ? (
        <Pressable
          onPress={handleClear}
          hitSlop={10}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}
