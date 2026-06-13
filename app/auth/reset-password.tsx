import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppPasswordInput from "../../src/components/ui/AppPasswordInput/AppPasswordInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { useTranslation } from "react-i18next";
import { useResetPassword } from "../../src/features/auth/hooks/useResetPassword";
import {
  ResetPasswordFormErrors,
  validateResetPasswordForm,
} from "../../src/features/auth/validation/resetPassword.validation";

export default function ResetPasswordScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { submitResetPassword, isLoading, apiError, setApiError } =
    useResetPassword();

  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});

  const handleSubmit = async () => {
    const values = {
      password,
      confirmPassword,
    };

    const validationErrors = validateResetPasswordForm(values);

    setErrors(validationErrors);
    setApiError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const response = await submitResetPassword(values);

    if (response) {
      router.push({
        pathname: "/auth/success",
        params: {
          title: t("auth.resetPassword.successTitle"),
          subtitle: t("auth.resetPassword.successSubtitle"),
          ctaLabel: t("auth.resetPassword.backToLogin"),
          ctaRoute: "/auth/sign-in",
        },
      });
    }
  };

  return (
    <AppScreen scroll style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("auth.resetPassword.title")}</Text>

        <Text style={styles.subtitle}>{t("auth.resetPassword.subtitle")}</Text>
      </View>

      <View style={styles.form}>
        <View>
          <AppPasswordInput
            placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setErrors((current) => ({
                ...current,
                password: undefined,
              }));

              setApiError(null);
            }}
            error={Boolean(errors.password)}
            disabled={isLoading}
          />
        </View>

        <View>
          <AppPasswordInput
            placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setErrors((current) => ({
                ...current,
                confirmPassword: undefined,
              }));

              setApiError(null);
            }}
            error={Boolean(errors.confirmPassword)}
            disabled={isLoading}
          />
        </View>

        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}

        {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

        {isLoading ? (
          <AppLoader />
        ) : (
          <AppButton title={t("auth.resetPassword.resetButton")} onPress={handleSubmit} />
        )}
      </View>

      <Text style={styles.back} onPress={() => router.push("/auth/sign-in")}>
        {t("auth.resetPassword.backToLogin")}
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
