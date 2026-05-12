import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setError("");
    setIsLoading(true);

    // AFTER BE

    setTimeout(() => {
      setIsLoading(false);
      router.push("/auth/reset-password");
    }, 1000);
  };

  return (
    <AppScreen scroll style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.subtitle}>
          Enter your email and we will send reset instructions.
        </Text>
      </View>

      <View style={styles.form}>
        <View>
          <AppInput
            placeholder="Email address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError("");
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            error={!!error}
            disabled={isLoading}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {isLoading ? (
          <AppLoader />
        ) : (
          <AppButton title="Send reset link" onPress={handleSubmit} />
        )}
      </View>

      <Text style={styles.back} onPress={() => router.push("/auth/sign-in")}>
        Back to login
      </Text>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      justifyContent: "center",
      gap: 24,
    },

    header: {
      alignItems: "center",
      gap: 8,
    },

    title: {
      fontSize: 34,
      fontWeight: "800",
      color: colors.primaryGreen,
    },

    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
    },

    form: {
      gap: 12,
    },

    errorText: {
      marginTop: 4,
      fontSize: 12,
      color: colors.error,
    },

    back: {
      textAlign: "center",
      color: colors.primaryGreen,
      fontWeight: "700",
    },
  });
}
