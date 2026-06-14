import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import DateField from "@/src/components/profile/DateField/DateField";
import PhoneField from "@/src/components/profile/PhoneField/PhoneField";
import ProfileField from "@/src/components/profile/ProfileField/ProfileField";
import AppAvatar from "@/src/components/ui/AppAvatar";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppInput from "@/src/components/ui/AppInput/AppInput";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import ClearableInput from "@/src/components/ui/ClearableInput/ClearableInput";
import { AppColors } from "@/src/constants/colors";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { validateSignUpPersonalUsername } from "@/src/features/auth/validation/signUpPersonal.validation";
import { useEditProfile } from "@/src/features/profile/hooks/useEditProfile";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useProfileStore } from "@/src/store/profile.store";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, usePreventRemove } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from "react-native";

export default function EditProfileScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const navigation = useNavigation();

  const profile = useProfileStore((state) => state.profile);

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
  const [isPhoneValid, setIsPhoneValid] = useState(!!profile.phoneNumber);
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth ?? "");

  const { saveProfile, isSaving } = useEditProfile();

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

  usePreventRemove(hasChanges, ({ data }) => {
    Alert.alert(
      "Discard changes?",
      "You have unsaved changes. Are you sure you want to leave?",
      [
        {
          text: "Keep editing",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });

  const usernameError =
    username.trim().length > 0
      ? validateSignUpPersonalUsername(username.trim())
      : undefined;

  const phoneError =
    phoneNumber.trim().length > 0 && !isPhoneValid
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

  const handleBackPress = () => {
    if (!hasChanges) {
      router.back();
      return;
    }

    Alert.alert(
      "Discard changes?",
      "You have unsaved changes. Are you sure you want to leave?",
      [
        {
          text: "Keep editing",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
  };

  const handleSave = async () => {
    const result = await saveProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      phoneNumber: phoneNumber.trim(),
      dateOfBirth: dateOfBirth.trim(),
      avatarUrl,
    });

    if (result.ok) {
      if (result.avatarUrl !== undefined) setAvatarUrl(result.avatarUrl);
      router.back();
    } else {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="Edit Profile"
        titleSubtitle="Update your personal profile"
        gradientColors={DISCOVERY_GRADIENT}
        leftSlot={
          <Pressable
            onPress={handleBackPress}
            style={{ alignSelf: "flex-start", marginLeft: -4, marginTop: -4 }}
            hitSlop={12}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={colors.textPrimary}
            />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="always"
      >
        <View style={styles.avatarSection}>
          <Pressable style={styles.avatarWrap} onPress={handlePickAvatar}>
            <AppAvatar
              imageUrl={avatarUrl}
              name={`${firstName} ${lastName}`.trim() || profile.displayName}
              username={username || profile.username}
              size="lg"
            />

            <View style={styles.avatarEditButton}>
              <Ionicons name="camera-outline" size={18} color={colors.white} />
            </View>
          </Pressable>

          <AppText style={styles.avatarHint}>Tap to change photo</AppText>
        </View>

        <View style={styles.form}>
          <ProfileField label="First name">
            <ClearableInput
              value={firstName}
              onChangeText={setFirstName}
              onClear={() => setFirstName("")}
              placeholder="Enter first name"
              maxLength={30}
            />
          </ProfileField>

          <ProfileField label="Last name">
            <ClearableInput
              value={lastName}
              onChangeText={setLastName}
              onClear={() => setLastName("")}
              placeholder="Enter last name"
              maxLength={30}
            />
          </ProfileField>

          <ProfileField label="Username" errorText={usernameError}>
            <ClearableInput
              value={username}
              onChangeText={(value) =>
                setUsername(value.toLowerCase().replace(/\s/g, ""))
              }
              onClear={() => setUsername("")}
              placeholder="Enter username"
              autoCapitalize="none"
              maxLength={20}
            />
          </ProfileField>

          <ProfileField
            label="Email"
            helperText="This email is linked to your account and cannot be changed here."
          >
            <AppInput
              value={profile.email}
              editable={false}
              placeholder="Email"
            />
          </ProfileField>

          <ProfileField
            label="Phone number"
            errorText={phoneError}
            helperText="Your phone number is private and will not be visible to other users."
          >
            <PhoneField
              value={phoneNumber}
              onChange={setPhoneNumber}
              onValidationChange={setIsPhoneValid}
            />
          </ProfileField>

          <ProfileField
            label="Date of birth"
            helperText="Your date of birth is private and is only used to suggest birthday promotions."
          >
            <DateField
              value={dateOfBirth}
              onChange={setDateOfBirth}
              placeholder="Select date of birth"
            />
          </ProfileField>
        </View>

        <View style={styles.saveButtonWrap}>
          <AppButton
            title={isSaving ? "Saving..." : "Save changes"}
            onPress={handleSave}
            disabled={!canSave}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
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
    saveButtonWrap: {
      marginTop: spacing.xl,
      marginBottom: spacing.xl,
    },
  });
}
