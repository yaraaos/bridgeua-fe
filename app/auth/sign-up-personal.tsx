import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AccountTypeSwitch } from "../../src/components/auth";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppPasswordInput from "../../src/components/ui/AppPasswordInput/AppPasswordInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { useRegisterPersonal } from "../../src/features/auth/hooks/useRegisterPersonal";
import {
  SignUpPersonalFormErrors,
  validateSignUpPersonalForm,
} from "../../src/features/auth/validation/signUpPersonal.validation";

export default function SignUpPersonalScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { submitRegisterPersonal, isLoading, apiError, setApiError } =
    useRegisterPersonal();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<SignUpPersonalFormErrors>({});

  const clearFieldError = (field: keyof SignUpPersonalFormErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async () => {
    const values = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      agree,
    };

    const validationErrors = validateSignUpPersonalForm(values);

    setErrors(validationErrors);
    setApiError(null);

    if (Object.keys(validationErrors).length > 0) return;

    const response = await submitRegisterPersonal({
      firstName,
      lastName,
      email,
      password,
    });

    if (response) {
      router.push({
        pathname: "/auth/confirm-code",
        params: { email: response.email },
      });
    }
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Choose the type of account you want to create
          </Text>
        </View>

        <View style={styles.switchWrap}>
          <AccountTypeSwitch
            options={[
              { label: "Personal", value: "personal" },
              { label: "Business", value: "business" },
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
            <AppInput
              placeholder="First name"
              value={firstName}
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
            <AppInput
              placeholder="Last name"
              value={lastName}
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
            <AppInput
              placeholder="Email address"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
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
              placeholder="Password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearFieldError("password");
              }}
              disabled={isLoading}
              error={Boolean(errors.password)}
            />
            <Feather
              name="eye-off"
              size={16}
              color={colors.textMuted}
              style={styles.eyeIcon}
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <View>
            <AppPasswordInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                clearFieldError("confirmPassword");
              }}
              disabled={isLoading}
              error={Boolean(errors.confirmPassword)}
            />
            <Feather
              name="eye-off"
              size={16}
              color={colors.textMuted}
              style={styles.eyeIcon}
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
              I&apos;ve read and agree with the{" "}
              <Text style={styles.linkText}>Terms and Conditions</Text> and the{" "}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </Pressable>

          {errors.agree ? (
            <Text style={styles.errorText}>{errors.agree}</Text>
          ) : null}

          {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

          {isLoading ? (
            <AppLoader />
          ) : (
            <AppButton title="Continue" onPress={handleSubmit} />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.footerLink}
              onPress={() => router.replace("/auth/sign-in")}
            >
              Sign in
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

    eyeIcon: {
      position: "absolute",
      right: 14,
      top: 17,
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
