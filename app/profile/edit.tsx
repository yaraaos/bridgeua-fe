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
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

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

  const handleSave = async () => {
    const success = await saveProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      avatarUrl,
    });

    if (success) {
      router.back();
    }
  };

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="Edit Profile"
        titleSubtitle="Update your personal profile"
        gradientColors={DISCOVERY_GRADIENT}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.avatarSection}>
          <Pressable style={styles.avatarWrap} onPress={handlePickAvatar}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />

            <View style={styles.avatarEditButton}>
              <Ionicons name="camera-outline" size={18} color={colors.white} />
            </View>
          </Pressable>

          <AppText style={styles.avatarHint}>Tap to change photo</AppText>
        </View>

        <View style={styles.form}>
          <View>
            <AppText style={styles.label}>First name</AppText>
            <AppInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
            />
          </View>

          <View>
            <AppText style={styles.label}>Last name</AppText>
            <AppInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
            />
          </View>

          <View>
            <AppText style={styles.label}>Username</AppText>

            <AppInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              autoCapitalize="none"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title={isSaving ? "Saving..." : "Save changes"}
          onPress={handleSave}
          disabled={isSaving}
        />
      </View>
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
      paddingBottom: 120,
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
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
  });
}
