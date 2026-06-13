import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { checkUsernameAvailability } from "@/src/features/auth/services/auth.service";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useNotificationsStore } from "@/src/store/notifications.store";
import { useProfileStore } from "@/src/store/profile.store";
import { AccountTypeSwitch } from "../../src/components/auth";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppPasswordInput from "../../src/components/ui/AppPasswordInput/AppPasswordInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import ClearableInput from "../../src/components/ui/ClearableInput";
import { useRegisterPersonal } from "../../src/features/auth/hooks/useRegisterPersonal";
import {
  SignUpPersonalFormErrors,
  validateSignUpPersonalForm,
  validateSignUpPersonalUsername,
} from "../../src/features/auth/validation/signUpPersonal.validation";

type UsernameAvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "error";

export default function SignUpPersonalScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const setProfile = useProfileStore((state) => state.setProfile);
  const setNotificationsAccountType = useNotificationsStore(
    (state) => state.setActiveAccountType,
  );

  const { submitRegisterPersonal, isLoading, apiError, setApiError } =
    useRegisterPersonal();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<SignUpPersonalFormErrors>({});
  const [usernameAvailabilityStatus, setUsernameAvailabilityStatus] =
    useState<UsernameAvailabilityStatus>("idle");

  const debouncedUsername = useDebounce(username.trim(), 1000);

  const clearFieldError = (field: keyof SignUpPersonalFormErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError(null);
  };

  useEffect(() => {
    if (!debouncedUsername || errors.username) {
      setUsernameAvailabilityStatus("idle");
      return;
    }

    const controller = new AbortController();

    async function validateUsernameAvailability() {
      try {
        setUsernameAvailabilityStatus("checking");

        const response = await checkUsernameAvailability(
          debouncedUsername,
          controller.signal,
        );

        setUsernameAvailabilityStatus(
          response.available ? "available" : "taken",
        );
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          error.name === "AbortError"
        ) {
          return;
        }

        setUsernameAvailabilityStatus("error");
      }
    }

    validateUsernameAvailability();

    return () => controller.abort();
  }, [debouncedUsername, errors.username]);

  const handleUsernameChange = (value: string) => {
    const normalizedUsername = value.toLowerCase().replace(/\s/g, "");

    setUsername(normalizedUsername);
    setApiError(null);
    setUsernameAvailabilityStatus("idle");

    setErrors((current) => ({
      ...current,
      username: validateSignUpPersonalUsername(normalizedUsername),
    }));
  };

  const clearFirstName = () => {
    setFirstName("");
    clearFieldError("firstName");
  };

  const clearLastName = () => {
    setLastName("");
    clearFieldError("lastName");
  };

  const clearUsername = () => {
    setUsername("");
    setUsernameAvailabilityStatus("idle");
    clearFieldError("username");
  };

  const clearEmail = () => {
    setEmail("");
    clearFieldError("email");
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    const values = {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      agree,
    };

    const validationErrors = validateSignUpPersonalForm(values);

    setErrors(validationErrors);
    setApiError(null);

    if (Object.keys(validationErrors).length > 0) return;

    if (usernameAvailabilityStatus === "checking") {
      setErrors((current) => ({
        ...current,
        username: t("auth.signUp.usernameWaiting"),
      }));
      return;
    }

    if (usernameAvailabilityStatus === "taken") {
      setErrors((current) => ({
        ...current,
        username: t("auth.signUp.usernameTaken"),
      }));
      return;
    }

    const response = await submitRegisterPersonal({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    if (response) {
      setNotificationsAccountType("personal");
      setProfile({
        id: `personal-${Date.now()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        username: username.trim(),
        email: response.email,
        avatarUrl: "",
        phoneNumber: "",
        dateOfBirth: "",
      });
      router.push({
        pathname: "/auth/confirm-code",
        params: { email: response.email },
      });
    }
  };

  return (
    <AppScreen scroll style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>{t("auth.signUp.title")}</Text>
          <Text style={styles.subtitle}>{t("auth.signUp.subtitle")}</Text>
        </View>

        <View style={styles.switchWrap}>
          <AccountTypeSwitch
            options={[
              { label: t("auth.signUp.personal"), value: "personal" },
              { label: t("auth.signUp.business"), value: "business" },
            ]}
            value="personal"
            onChange={(value) => {
              if (value === "business") {
                router.replace("/auth/sign-up-business");
              }
            }}
          />
        </View>

        <View style={styles.form}>
          <View>
            <ClearableInput
              placeholder={t("auth.signUp.firstNamePlaceholder")}
              value={firstName}
              onClear={clearFirstName}
              onChangeText={(value) => {
                setFirstName(value);
                clearFieldError("firstName");
              }}
              disabled={isLoading}
              error={Boolean(errors.firstName)}
            />
            {errors.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}
          </View>

          <View>
            <ClearableInput
              placeholder={t("auth.signUp.lastNamePlaceholder")}
              value={lastName}
              onClear={clearLastName}
              onChangeText={(value) => {
                setLastName(value);
                clearFieldError("lastName");
              }}
              disabled={isLoading}
              error={Boolean(errors.lastName)}
            />
            {errors.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}
          </View>

          <View>
            <ClearableInput
              placeholder={t("auth.signUp.usernamePlaceholder")}
              value={username}
              onClear={clearUsername}
              onChangeText={handleUsernameChange}
              autoCapitalize="none"
              disabled={isLoading}
              error={Boolean(errors.username)}
            />
            {errors.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}

            {!errors.username && usernameAvailabilityStatus === "checking" ? (
              <Text style={styles.helperText}>{t("auth.signUp.checkingUsername")}</Text>
            ) : null}

            {!errors.username && usernameAvailabilityStatus === "available" ? (
              <Text style={styles.successText}>{t("auth.signUp.usernameAvailable")}</Text>
            ) : null}

            {!errors.username && usernameAvailabilityStatus === "taken" ? (
              <Text style={styles.errorText}>{t("auth.signUp.usernameTaken")}</Text>
            ) : null}

            {!errors.username && usernameAvailabilityStatus === "error" ? (
              <Text style={styles.errorText}>{t("auth.signUp.usernameCheckError")}</Text>
            ) : null}
          </View>

          <View>
            <ClearableInput
              placeholder={t("auth.signUp.emailPlaceholder")}
              value={email}
              onClear={clearEmail}
              onChangeText={(value) => {
                setEmail(value.toLowerCase().trim());
                clearFieldError("email");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={isLoading}
              error={Boolean(errors.email)}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View>
            <AppPasswordInput
              placeholder={t("auth.signUp.passwordPlaceholder")}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearFieldError("password");
              }}
              disabled={isLoading}
              error={Boolean(errors.password)}
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <View>
            <AppPasswordInput
              placeholder={t("auth.signUp.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                clearFieldError("confirmPassword");
              }}
              disabled={isLoading}
              error={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          <Pressable
            style={styles.checkboxRow}
            onPress={() => {
              setAgree((prev) => !prev);
              clearFieldError("agree");
            }}
            disabled={isLoading}
          >
            <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
              {agree ? (
                <Feather name="check" size={12} color={colors.white} />
              ) : null}
            </View>

            <Text style={styles.checkboxText}>
              {t("auth.signUp.agreePrefix")}
              <Text style={styles.linkText}>{t("auth.signUp.termsLink")}</Text>
              {t("auth.signUp.agreeMid")}
              <Text style={styles.linkText}>{t("auth.signUp.privacyLink")}</Text>.
            </Text>
          </Pressable>

          {errors.agree ? (
            <Text style={styles.errorText}>{errors.agree}</Text>
          ) : null}

          {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

          {isLoading ? (
            <AppLoader />
          ) : (
            <AppButton title={t("auth.signUp.continueButton")} onPress={handleSubmit} />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t("auth.signUp.alreadyHaveAccount")}{" "}
            <Text
              style={styles.footerLink}
              onPress={() => router.replace("/auth/sign-in")}
            >
              {t("auth.signUp.signInLink")}
            </Text>
          </Text>
        </View>
      </View>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      justifyContent: "center",
    },

    content: {
      paddingHorizontal: 14,
    },

    headerBlock: {
      alignItems: "center",
      marginBottom: 18,
    },

    title: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.primaryGreen,
      textAlign: "center",
    },

    subtitle: {
      marginTop: 6,
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center",
    },

    switchWrap: {
      marginBottom: 16,
    },

    form: {
      gap: 12,
    },

    checkboxRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },

    checkbox: {
      width: 16,
      height: 16,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      marginTop: 2,
      alignItems: "center",
      justifyContent: "center",
    },

    checkboxChecked: {
      backgroundColor: colors.primaryGreen,
      borderColor: colors.primaryGreen,
    },

    checkboxText: {
      flex: 1,
      fontSize: 11,
      lineHeight: 15,
      color: colors.textSecondary,
    },

    linkText: {
      color: colors.textPrimary,
      fontWeight: "700",
    },

    errorText: {
      marginTop: 4,
      fontSize: 12,
      color: colors.error,
    },

    helperText: {
      marginTop: 4,
      fontSize: 12,
      color: colors.textSecondary,
    },

    successText: {
      marginTop: 4,
      fontSize: 12,
      color: colors.primaryGreen,
    },

    apiError: {
      fontSize: 13,
      color: colors.error,
      textAlign: "center",
    },

    footer: {
      marginTop: 18,
      alignItems: "center",
    },

    footerText: {
      fontSize: 12,
      color: colors.textSecondary,
    },

    footerLink: {
      color: colors.textPrimary,
      fontWeight: "700",
    },
  });
}
