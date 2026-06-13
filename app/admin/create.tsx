import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppInput from "@/src/components/ui/AppInput/AppInput";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { createAdminUser } from "@/src/features/admin/services/admin.service";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { spacing } from "@/src/constants/spacing";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type AccountType = "personal" | "business";

export default function AdminCreateUserScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [accountType, setAccountType] = useState<AccountType>("personal");
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Personal
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Business
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cuisine, setCuisine] = useState("");

  const handleCreate = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t("admin.createUser.validationTitle"), t("admin.createUser.validationEmailPassword"));
      return;
    }
    if (accountType === "business" && !businessName.trim()) {
      Alert.alert(t("admin.createUser.validationTitle"), t("admin.createUser.validationBusinessName"));
      return;
    }

    try {
      setIsLoading(true);
      await createAdminUser({
        email: email.trim(),
        password: password.trim(),
        accountType,
        profileData:
          accountType === "personal"
            ? { firstName, lastName, username: username || undefined, phoneNumber }
            : undefined,
        businessData:
          accountType === "business"
            ? { businessName, ownerName, address, city, state, zipCode, cuisine }
            : undefined,
      });
      Alert.alert(t("admin.createUser.createSuccess"), t("admin.createUser.createSuccessMessage"), [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(t("common.error"), err?.message ?? t("admin.createUser.errorCreate"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppScreen withTopInset={false} style={{ padding: 0 }}>
      <ScreenHeader
        title={t("admin.createUser.title")}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.typeRow}>
          {(["personal", "business"] as AccountType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeChip, accountType === type && styles.typeChipActive]}
              onPress={() => setAccountType(type)}
            >
              <AppText
                style={[styles.typeChipText, accountType === type && styles.typeChipTextActive]}
              >
                {type === "personal" ? t("admin.users.filterPersonal") : t("admin.users.filterBusiness")}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <AppText style={styles.sectionTitle}>{t("admin.createUser.sectionAccount")}</AppText>

        <AppText style={styles.label}>{t("admin.createUser.labelEmail")}</AppText>
        <AppInput
          value={email}
          onChangeText={setEmail}
          placeholder={t("admin.createUser.placeholderEmail")}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppText style={styles.label}>{t("admin.createUser.labelPassword")}</AppText>
        <AppInput
          value={password}
          onChangeText={setPassword}
          placeholder={t("admin.createUser.placeholderPassword")}
          secureTextEntry
        />

        {accountType === "personal" && (
          <>
            <AppText style={styles.sectionTitle}>{t("admin.createUser.sectionProfile")}</AppText>
            <AppText style={styles.label}>{t("admin.createUser.labelFirstName")}</AppText>
            <AppInput value={firstName} onChangeText={setFirstName} placeholder={t("admin.createUser.placeholderFirstName")} />
            <AppText style={styles.label}>{t("admin.createUser.labelLastName")}</AppText>
            <AppInput value={lastName} onChangeText={setLastName} placeholder={t("admin.createUser.placeholderLastName")} />
            <AppText style={styles.label}>{t("admin.createUser.labelUsername")}</AppText>
            <AppInput
              value={username}
              onChangeText={setUsername}
              placeholder={t("admin.createUser.placeholderUsername")}
              autoCapitalize="none"
            />
            <AppText style={styles.label}>{t("admin.createUser.labelPhone")}</AppText>
            <AppInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder={t("admin.createUser.placeholderPhone")}
              keyboardType="phone-pad"
            />
          </>
        )}

        {accountType === "business" && (
          <>
            <AppText style={styles.sectionTitle}>{t("admin.createUser.sectionBusiness")}</AppText>
            <AppText style={styles.label}>{t("admin.createUser.labelBusinessName")}</AppText>
            <AppInput value={businessName} onChangeText={setBusinessName} placeholder={t("admin.createUser.placeholderBusinessName")} />
            <AppText style={styles.label}>{t("admin.createUser.labelOwnerName")}</AppText>
            <AppInput value={ownerName} onChangeText={setOwnerName} placeholder={t("admin.createUser.placeholderOwnerName")} />
            <AppText style={styles.label}>{t("admin.createUser.labelAddress")}</AppText>
            <AppInput value={address} onChangeText={setAddress} placeholder={t("admin.createUser.placeholderAddress")} />
            <AppText style={styles.label}>{t("admin.createUser.labelCity")}</AppText>
            <AppInput value={city} onChangeText={setCity} placeholder={t("admin.createUser.placeholderCity")} />
            <AppText style={styles.label}>{t("admin.createUser.labelState")}</AppText>
            <AppInput value={state} onChangeText={setState} placeholder={t("admin.createUser.placeholderState")} />
            <AppText style={styles.label}>{t("admin.createUser.labelZip")}</AppText>
            <AppInput value={zipCode} onChangeText={setZipCode} placeholder={t("admin.createUser.placeholderZip")} />
            <AppText style={styles.label}>{t("admin.createUser.labelCuisine")}</AppText>
            <AppInput value={cuisine} onChangeText={setCuisine} placeholder={t("admin.createUser.placeholderCuisine")} />
          </>
        )}

        <View style={styles.createBtn}>
          <AppButton
            title={isLoading ? t("admin.createUser.creatingButton") : t("admin.createUser.createButton")}
            onPress={handleCreate}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { padding: spacing.lg, paddingBottom: spacing.xxl },
    typeRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    typeChip: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      backgroundColor: colors.surface,
    },
    typeChipActive: {
      backgroundColor: colors.primaryGreen,
      borderColor: colors.primaryGreen,
    },
    typeChipText: { fontSize: 14, color: colors.textSecondary },
    typeChipTextActive: { color: colors.white, fontWeight: "600" },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      marginTop: spacing.xl,
      marginBottom: spacing.sm,
    },
    label: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      marginTop: spacing.sm,
    },
    createBtn: { marginTop: spacing.xl },
  });