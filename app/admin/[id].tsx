import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppInput from "@/src/components/ui/AppInput/AppInput";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import {
  fetchAdminUser,
  updateAdminUser,
} from "@/src/features/admin/services/admin.service";
import type { AdminUser } from "@/src/features/admin/types/admin.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { spacing } from "@/src/constants/spacing";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminUserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

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
      .catch(() => Alert.alert("Error", "Failed to load user"))
      .finally(() => setIsLoading(false));
  }, [id]);

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
      Alert.alert("Saved", "User updated successfully");
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <AppLoader />;
  if (!user) return null;

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <AppText style={styles.back}>← Back</AppText>
          </TouchableOpacity>
          <AppText style={styles.badge}>{user.accountType}</AppText>
        </View>

        <AppText style={styles.sectionTitle}>Account</AppText>

        <AppText style={styles.label}>Email</AppText>
        <AppInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppText style={styles.label}>New password (leave blank to keep)</AppText>
        <AppInput
          value={password}
          onChangeText={setPassword}
          placeholder="New password"
          secureTextEntry
        />

        <View style={styles.switchRow}>
          <AppText style={styles.label}>Admin</AppText>
          <Switch
            value={isAdmin}
            onValueChange={setIsAdmin}
            trackColor={{ true: colors.primaryGreen }}
          />
        </View>

        {user.accountType === "personal" && (
          <>
            <AppText style={styles.sectionTitle}>Profile</AppText>
            <AppText style={styles.label}>First name</AppText>
            <AppInput value={firstName} onChangeText={setFirstName} placeholder="First name" />
            <AppText style={styles.label}>Last name</AppText>
            <AppInput value={lastName} onChangeText={setLastName} placeholder="Last name" />
            <AppText style={styles.label}>Username</AppText>
            <AppInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              autoCapitalize="none"
            />
            <AppText style={styles.label}>Phone</AppText>
            <AppInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
          </>
        )}

        {user.accountType === "business" && (
          <>
            <AppText style={styles.sectionTitle}>Business</AppText>
            <AppText style={styles.label}>Business name</AppText>
            <AppInput value={businessName} onChangeText={setBusinessName} placeholder="Business name" />
            <AppText style={styles.label}>Address</AppText>
            <AppInput value={address} onChangeText={setAddress} placeholder="Address" />
            <AppText style={styles.label}>City</AppText>
            <AppInput value={city} onChangeText={setCity} placeholder="City" />
            <AppText style={styles.label}>State</AppText>
            <AppInput value={state} onChangeText={setState} placeholder="State" />
            <AppText style={styles.label}>ZIP</AppText>
            <AppInput value={zipCode} onChangeText={setZipCode} placeholder="ZIP code" />
            <AppText style={styles.label}>Cuisine</AppText>
            <AppInput value={cuisine} onChangeText={setCuisine} placeholder="Cuisine" />
          </>
        )}

        <View style={styles.saveBtn}>
          <AppButton
            title={isSaving ? "Saving..." : "Save changes"}
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
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    back: { fontSize: 15, color: colors.primaryGreen },
    badge: {
      fontSize: 12,
      color: colors.textSecondary,
      backgroundColor: colors.border,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: 4,
      textTransform: "capitalize",
    },
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