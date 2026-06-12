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
      Alert.alert("Validation", "Email and password are required");
      return;
    }
    if (accountType === "business" && !businessName.trim()) {
      Alert.alert("Validation", "Business name is required");
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
      Alert.alert("Created", "User created successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppScreen withTopInset={false} style={{ padding: 0 }}>
      <ScreenHeader
        title="New user"
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.typeRow}>
          {(["personal", "business"] as AccountType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, accountType === t && styles.typeChipActive]}
              onPress={() => setAccountType(t)}
            >
              <AppText
                style={[styles.typeChipText, accountType === t && styles.typeChipTextActive]}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <AppText style={styles.sectionTitle}>Account</AppText>

        <AppText style={styles.label}>Email *</AppText>
        <AppInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppText style={styles.label}>Password *</AppText>
        <AppInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        {accountType === "personal" && (
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

        {accountType === "business" && (
          <>
            <AppText style={styles.sectionTitle}>Business</AppText>
            <AppText style={styles.label}>Business name *</AppText>
            <AppInput value={businessName} onChangeText={setBusinessName} placeholder="Business name" />
            <AppText style={styles.label}>Owner name</AppText>
            <AppInput value={ownerName} onChangeText={setOwnerName} placeholder="Owner full name" />
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

        <View style={styles.createBtn}>
          <AppButton
            title={isLoading ? "Creating..." : "Create user"}
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