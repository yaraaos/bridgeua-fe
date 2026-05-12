import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppPasswordInput from "../../src/components/ui/AppPasswordInput/AppPasswordInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";

export default function ResetPasswordScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      alert("Password successfully changed");

      router.replace("/auth/sign-in");
    }, 1000);
  };

  return (
    <AppScreen scroll style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>

        <Text style={styles.subtitle}>
          Create a new password for your account.
        </Text>
      </View>

      <View style={styles.form}>
        <View>
          <AppPasswordInput
            placeholder="New password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setError("");
            }}
            error={!!error}
            disabled={isLoading}
          />
        </View>

        <View>
          <AppPasswordInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setError("");
            }}
            error={!!error}
            disabled={isLoading}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {isLoading ? (
          <AppLoader />
        ) : (
          <AppButton title="Reset password" onPress={handleSubmit} />
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
      fontSize: 12,
      color: colors.error,
      textAlign: "center",
    },

    back: {
      textAlign: "center",
      color: colors.primaryGreen,
      fontWeight: "700",
    },
  });
}
