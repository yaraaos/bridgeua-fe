import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import ClearableInput from "../../src/components/ui/ClearableInput";
import { useForgotPassword } from "../../src/features/auth/hooks/useForgotPassword";
import {
  ForgotPasswordFormErrors,
  validateForgotPasswordForm,
} from "../../src/features/auth/validation/forgotPassword.validation";

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [email, setEmail] = useState("");

  const { submitForgotPassword, isLoading, apiError, setApiError } =
    useForgotPassword();

  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});

  const clearEmail = () => {
    setEmail("");
    setErrors((current) => ({
      ...current,
      email: undefined,
    }));
    setApiError(null);
  };

  const handleSubmit = async () => {
    const values = { email };

    const validationErrors = validateForgotPasswordForm(values);

    setErrors(validationErrors);
    setApiError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const response = await submitForgotPassword(values);

    if (response) {
      console.log(
        "[DEV] Reset password code:",
        (response as any).resetPasswordCode,
      );
      router.push("/auth/reset-password");
    }
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
          <ClearableInput
            placeholder="Email address"
            value={email}
            onClear={clearEmail}
            onChangeText={(value) => {
              setEmail(value.toLowerCase().trim());
              setErrors((current) => ({
                ...current,
                email: undefined,
              }));

              setApiError(null);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            error={Boolean(errors.email)}
            disabled={isLoading}
          />

          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

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
