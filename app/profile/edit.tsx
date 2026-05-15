import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppInput from "@/src/components/ui/AppInput/AppInput";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useEditProfile } from "@/src/features/profile/hooks/useEditProfile";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { personalProfileMock } from "@/src/mocks/profile.mock";
import { useProfileStore } from "@/src/store/profile.store";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInputProps,
    View,
} from "react-native";

type ClearableInputProps = TextInputProps & {
  value: string;
  onClear: () => void;
  rightSlot?: React.ReactNode;
};

const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸" },
  { code: "+34", flag: "🇪🇸" },
  { code: "+43", flag: "🇦🇹" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+380", flag: "🇺🇦" },
  { code: "+962", flag: "🇯🇴" },
];

function getPhoneFlag(value: string) {
  const normalized = value.replace(/\s/g, "");

  return COUNTRY_CODES.sort((a, b) => b.code.length - a.code.length).find(
    (item) => normalized.startsWith(item.code),
  )?.flag;
}

export default function EditProfileScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const storeProfile = useProfileStore((state) => state.profile);
  const profile = storeProfile ?? personalProfileMock;

  const initialNames = useMemo(() => {
    const parts = profile.displayName.trim().split(" ");

    return {
      firstName: profile.firstName ?? parts[0] ?? "",
      lastName: profile.lastName ?? parts.slice(1).join(" ") ?? "",
    };
  }, [profile]);

  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [firstName, setFirstName] = useState(initialNames.firstName);
  const [lastName, setLastName] = useState(initialNames.lastName);
  const [username, setUsername] = useState(profile.username ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth ?? "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [draftDateOfBirth, setDraftDateOfBirth] = useState<Date>(
    dateOfBirth ? new Date(dateOfBirth) : new Date(),
  );

  const { saveProfile, isSaving } = useEditProfile();
  const phoneFlag = getPhoneFlag(phoneNumber);

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo access to change your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    setAvatarUrl(result.assets[0]?.uri);
  };

  const hasChanges =
    avatarUrl !== profile.avatarUrl ||
    firstName.trim() !== (profile.firstName ?? "") ||
    lastName.trim() !== (profile.lastName ?? "") ||
    username.trim() !== profile.username ||
    phoneNumber.trim() !== (profile.phoneNumber ?? "") ||
    dateOfBirth.trim() !== (profile.dateOfBirth ?? "");

  const usernameError =
    username.trim().length > 0 && !/^[a-zA-Z0-9._]{3,20}$/.test(username.trim())
      ? "Username must be 3–20 characters and can only use letters, numbers, dots, or underscores."
      : "";

  const phoneError =
    phoneNumber.trim().length > 0 &&
    !/^[+0-9\s()-]{6,20}$/.test(phoneNumber.trim())
      ? "Enter a valid phone number."
      : "";

  const canSave =
    hasChanges &&
    !usernameError &&
    !phoneError &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    username.trim().length > 0 &&
    !isSaving;

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) {
      setDraftDateOfBirth(selectedDate);
    }
  };

  const handleOpenDatePicker = () => {
    Keyboard.dismiss();
    setDraftDateOfBirth(dateOfBirth ? new Date(dateOfBirth) : new Date());
    setShowDatePicker(true);
  };

  const handleConfirmDate = () => {
    setDateOfBirth(draftDateOfBirth.toISOString().split("T")[0]);
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    const success = await saveProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      phoneNumber: phoneNumber.trim(),
      dateOfBirth: dateOfBirth.trim(),
      avatarUrl,
    });

    if (success) router.back();
  };

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Edit Profile"
          titleSubtitle="Update your personal profile"
          gradientColors={DISCOVERY_GRADIENT}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View style={styles.avatarSection}>
            <Pressable style={styles.avatarWrap} onPress={handlePickAvatar}>
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />

              <View style={styles.avatarEditButton}>
                <Ionicons
                  name="camera-outline"
                  size={18}
                  color={colors.white}
                />
              </View>
            </Pressable>

            <AppText style={styles.avatarHint}>Tap to change photo</AppText>
          </View>

          <View style={styles.form}>
            <View>
              <AppText style={styles.label}>First name</AppText>
              <ClearableInput
                value={firstName}
                onChangeText={setFirstName}
                onClear={() => setFirstName("")}
                placeholder="Enter first name"
                maxLength={30}
                styles={styles}
                colors={colors}
              />
            </View>

            <View>
              <AppText style={styles.label}>Last name</AppText>
              <ClearableInput
                value={lastName}
                onChangeText={setLastName}
                onClear={() => setLastName("")}
                placeholder="Enter last name"
                maxLength={30}
                styles={styles}
                colors={colors}
              />
            </View>

            <View>
              <AppText style={styles.label}>Username</AppText>
              <ClearableInput
                value={username}
                onChangeText={setUsername}
                onClear={() => setUsername("")}
                placeholder="Enter username"
                autoCapitalize="none"
                maxLength={20}
                styles={styles}
                colors={colors}
              />
              {usernameError ? (
                <AppText style={styles.errorText}>{usernameError}</AppText>
              ) : null}
            </View>

            <View>
              <AppText style={styles.label}>Email</AppText>
              <AppInput
                value={profile.email}
                editable={false}
                placeholder="Email"
              />
              <AppText style={styles.helperText}>
                This email is linked to your account and cannot be changed here.
              </AppText>
            </View>

            <View>
              <AppText style={styles.label}>Phone number</AppText>
              <ClearableInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onClear={() => setPhoneNumber("")}
                placeholder="Add phone number"
                keyboardType="phone-pad"
                maxLength={20}
                rightSlot={
                  phoneFlag ? (
                    <AppText style={styles.phoneFlag}>{phoneFlag}</AppText>
                  ) : null
                }
                styles={styles}
                colors={colors}
              />
              {phoneError ? (
                <AppText style={styles.errorText}>{phoneError}</AppText>
              ) : null}
              <AppText style={styles.helperText}>
                Your phone number is private and will not be visible to other
                users.
              </AppText>
            </View>

            <View>
              <AppText style={styles.label}>Date of birth</AppText>

              <View style={styles.inputWrap}>
                <Pressable
                  style={styles.dateInputPressable}
                  onPress={handleOpenDatePicker}
                >
                  <AppInput
                    value={dateOfBirth}
                    placeholder="Select date of birth"
                    editable={false}
                    pointerEvents="none"
                    style={styles.clearableInput}
                  />
                </Pressable>

                <View style={styles.inputRightContent}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={colors.textMuted}
                  />

                  {dateOfBirth ? (
                    <Pressable
                      onPress={() => setDateOfBirth("")}
                      hitSlop={10}
                      style={styles.clearButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={colors.textMuted}
                      />
                    </Pressable>
                  ) : null}
                </View>
              </View>

              <AppText style={styles.helperText}>
                Your date of birth is private and is only used to suggest
                birthday promotions.
              </AppText>
            </View>
          </View>

          <View style={styles.saveButtonWrap}>
            <AppButton
              title={isSaving ? "Saving..." : "Save changes"}
              onPress={handleSave}
              disabled={!canSave}
            />
          </View>
        </ScrollView>
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerCard}>
              <View style={styles.datePickerHeader}>
                <Pressable onPress={() => setShowDatePicker(false)}>
                  <AppText style={styles.datePickerCancel}>Cancel</AppText>
                </Pressable>

                <AppText style={styles.datePickerTitle}>Date of birth</AppText>

                <Pressable onPress={handleConfirmDate}>
                  <AppText style={styles.datePickerDone}>Done</AppText>
                </Pressable>
              </View>

              <DateTimePicker
                value={draftDateOfBirth}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "spinner"}
                maximumDate={new Date()}
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

function ClearableInput({
  value,
  onClear,
  rightSlot,
  styles,
  colors,
  ...props
}: ClearableInputProps & {
  styles: ReturnType<typeof createStyles>;
  colors: AppColors;
}) {
  return (
    <View style={styles.inputWrap}>
      <AppInput {...props} value={value} style={styles.clearableInput} />

      <View style={styles.inputRightContent}>
        {rightSlot}

        {value.trim().length > 0 ? (
          <Pressable onPress={onClear} hitSlop={10} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
    avatarSection: {
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    avatarWrap: {
      width: 104,
      height: 104,
      borderRadius: 52,
    },
    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: 52,
      backgroundColor: colors.primaryGreenSoft,
    },
    avatarEditButton: {
      position: "absolute",
      right: 0,
      bottom: 4,
      width: 34,
      height: 34,
      borderRadius: radius.pill,
      backgroundColor: colors.primaryGreen,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.background,
    },
    avatarHint: {
      marginTop: spacing.sm,
      fontSize: 13,
      color: colors.textSecondary,
    },
    form: {
      gap: spacing.lg,
    },
    label: {
      marginBottom: spacing.xs,
      fontSize: 13,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    helperText: {
      marginTop: spacing.xs,
      fontSize: 12,
      lineHeight: 17,
      color: colors.textSecondary,
    },
    errorText: {
      marginTop: spacing.xs,
      fontSize: 12,
      lineHeight: 17,
      color: colors.error,
    },
    dateInputPressable: {
      width: "100%",
    },

    datePickerOverlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
      backgroundColor: "rgba(0,0,0,0.35)",
    },

    datePickerCard: {
      width: "100%",
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },

    datePickerHeader: {
      minHeight: 52,
      paddingHorizontal: spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    datePickerTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    datePickerCancel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },

    datePickerDone: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primaryGreen,
    },

    datePicker: {
      alignSelf: "center",
    },
    saveButtonWrap: {
      marginTop: spacing.xl,
      marginBottom: spacing.xl,
    },
    inputWrap: {
      position: "relative",
      justifyContent: "center",
    },
    clearableInput: {
      paddingRight: 72,
    },
    inputRightContent: {
      position: "absolute",
      right: spacing.md,
      top: 0,
      bottom: 0,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    clearButton: {
      width: 22,
      height: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    phoneFlag: {
      fontSize: 18,
    },
  });
}
