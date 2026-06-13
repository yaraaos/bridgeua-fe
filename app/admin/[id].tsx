import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppInput from "@/src/components/ui/AppInput/AppInput";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import {
  fetchAdminUser,
  updateAdminUser,
} from "@/src/features/admin/services/admin.service";
import type { AdminUser } from "@/src/features/admin/types/admin.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { spacing } from "@/src/constants/spacing";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";

export default function AdminUserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Personal fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Business fields
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cuisine, setCuisine] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchAdminUser(Number(id))
      .then((data) => {
        setUser(data);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        if (data.accountType === "personal" && data.profile) {
          setFirstName(data.profile.firstName ?? "");
          setLastName(data.profile.lastName ?? "");
          setUsername(data.profile.username ?? "");
          setPhoneNumber(data.profile.phoneNumber ?? "");
        }
        if (data.accountType === "business") {
          const biz = data.businesses?.[0];
          if (biz) {
            setBusinessName(biz.name ?? "");
            setAddress(biz.address ?? "");
            setCity(biz.city ?? "");
            setState(biz.state ?? "");
            setZipCode(biz.zipCode ?? "");
            setCuisine(biz.cuisine ?? "");
          }
        }
      })
      .catch(() => Alert.alert(t("common.error"), t("admin.userDetail.errorLoad")))
      .finally(() => setIsLoading(false));
  }, [id, t]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload: Record<string, unknown> = { email, isAdmin };
      if (password.trim()) payload.password = password.trim();

      if (user?.accountType === "personal") {
        payload.profileData = { firstName, lastName, username, phoneNumber };
      } else if (user?.accountType === "business") {
        payload.businessData = { businessName, address, city, state, zipCode, cuisine };
      }

      const updated = await updateAdminUser(Number(id), payload as any);
      setUser(updated);
      setPassword("");
      Alert.alert(t("admin.userDetail.saveSuccess"), t("admin.userDetail.saveSuccessMessage"));
    } catch (err: any) {
      Alert.alert(t("common.error"), err?.message ?? t("admin.userDetail.errorSave"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <AppScreen><AppLoader /></AppScreen>;
  if (!user) return null;

  const displayTitle = user.accountType === "business"
    ? (user.businesses?.[0]?.name ?? user.email)
    : [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <AppScreen withTopInset={false} style={{ padding: 0 }}>
      <ScreenHeader
        title={displayTitle}
        titleSubtitle={user.email}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.sectionTitle}>{t("admin.userDetail.sectionAccount")}</AppText>

        <AppText style={styles.label}>{t("admin.userDetail.labelEmail")}</AppText>
        <AppInput
          value={email}
          onChangeText={setEmail}
          placeholder={t("admin.userDetail.placeholderEmail")}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppText style={styles.label}>{t("admin.userDetail.labelPassword")}</AppText>
        <AppInput
          value={password}
          onChangeText={setPassword}
          placeholder={t("admin.userDetail.placeholderPassword")}
          secureTextEntry
        />

        <View style={styles.switchRow}>
          <AppText style={styles.label}>{t("admin.userDetail.labelAdmin")}</AppText>
          <Switch
            value={isAdmin}
            onValueChange={setIsAdmin}
            trackColor={{ true: colors.primaryGreen }}
          />
        </View>

        {user.accountType === "personal" && (
          <>
            <AppText style={styles.sectionTitle}>{t("admin.userDetail.sectionProfile")}</AppText>
            <AppText style={styles.label}>{t("admin.userDetail.labelFirstName")}</AppText>
            <AppInput value={firstName} onChangeText={setFirstName} placeholder={t("admin.userDetail.placeholderFirstName")} />
            <AppText style={styles.label}>{t("admin.userDetail.labelLastName")}</AppText>
            <AppInput value={lastName} onChangeText={setLastName} placeholder={t("admin.userDetail.placeholderLastName")} />
            <AppText style={styles.label}>{t("admin.userDetail.labelUsername")}</AppText>
            <AppInput
              value={username}
              onChangeText={setUsername}
              placeholder={t("admin.userDetail.placeholderUsername")}
              autoCapitalize="none"
            />
            <AppText style={styles.label}>{t("admin.userDetail.labelPhone")}</AppText>
            <AppInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder={t("admin.userDetail.placeholderPhone")}
              keyboardType="phone-pad"
            />
          </>
        )}

        {user.accountType === "business" && (
          <>
            <AppText style={styles.sectionTitle}>{t("admin.userDetail.sectionBusiness")}</AppText>
            <AppText style={styles.label}>{t("admin.userDetail.labelBusinessName")}</AppText>
            <AppInput value={businessName} onChangeText={setBusinessName} placeholder={t("admin.userDetail.placeholderBusinessName")} />
            <AppText style={styles.label}>{t("admin.userDetail.labelAddress")}</AppText>
            <AppInput value={address} onChangeText={setAddress} placeholder={t("admin.userDetail.placeholderAddress")} />
            <AppText style={styles.label}>{t("admin.userDetail.labelCity")}</AppText>
            <AppInput value={city} onChangeText={setCity} placeholder={t("admin.userDetail.placeholderCity")} />
            <AppText style={styles.label}>{t("admin.userDetail.labelState")}</AppText>
            <AppInput value={state} onChangeText={setState} placeholder={t("admin.userDetail.placeholderState")} />
            <AppText style={styles.label}>{t("admin.userDetail.labelZip")}</AppText>
            <AppInput value={zipCode} onChangeText={setZipCode} placeholder={t("admin.userDetail.placeholderZip")} />
            <AppText style={styles.label}>{t("admin.userDetail.labelCuisine")}</AppText>
            <AppInput value={cuisine} onChangeText={setCuisine} placeholder={t("admin.userDetail.placeholderCuisine")} />
          </>
        )}

        <View style={styles.saveBtn}>
          <AppButton
            title={isSaving ? t("admin.userDetail.savingButton") : t("admin.userDetail.saveButton")}
            onPress={handleSave}
            disabled={isSaving}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { padding: spacing.lg, paddingBottom: spacing.xxl },
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
    switchRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: spacing.md,
    },
    saveBtn: { marginTop: spacing.xl },
  });
