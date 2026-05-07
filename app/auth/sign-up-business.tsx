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
import { useRegisterBusiness } from "../../src/features/auth/hooks/useRegisterBusiness";
import {
  SignUpBusinessFormErrors,
  validateSignUpBusinessForm,
} from "../../src/features/auth/validation/signUpBusiness.validation";

const CATEGORIES = [
  "Beauty",
  "Restaurant",
  "Automotive",
  "Health & Medical",
  "Home & Repair",
  "Education",
  "Other",
];

export default function SignUpBusinessScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { submitRegisterBusiness, isLoading, apiError, setApiError } =
    useRegisterBusiness();

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Beauty");
  const [errors, setErrors] = useState<SignUpBusinessFormErrors>({});

  const clearFieldError = (field: keyof SignUpBusinessFormErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async () => {
    const values = {
      businessName,
      ownerName,
      email,
      password,
      confirmPassword,
      category: selectedCategory,
      agree,
    };

    const validationErrors = validateSignUpBusinessForm(values);

    setErrors(validationErrors);
    setApiError(null);

    if (Object.keys(validationErrors).length > 0) return;

    const response = await submitRegisterBusiness({
      businessName,
      ownerName,
      email,
      password,
      category: selectedCategory,
    });

    if (response) {
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
            value="business"
            onChange={(value) => {
              if (value === "personal") {
                router.replace("/auth/sign-up-personal");
              }
            }}
          />
        </View>

        <View style={styles.form}>
          <View>
            <AppInput
              placeholder="Business name"
              value={businessName}
              onChangeText={(value) => {
                setBusinessName(value);
                clearFieldError("businessName");
              }}
              disabled={isLoading}
              error={Boolean(errors.businessName)}
            />
            {errors.businessName ? (
              <Text style={styles.errorText}>{errors.businessName}</Text>
            ) : null}
          </View>

          <View>
            <AppInput
              placeholder="Owner name"
              value={ownerName}
              onChangeText={(value) => {
                setOwnerName(value);
                clearFieldError("ownerName");
              }}
              disabled={isLoading}
              error={Boolean(errors.ownerName)}
            />
            {errors.ownerName ? (
              <Text style={styles.errorText}>{errors.ownerName}</Text>
            ) : null}
          </View>

          <View>
            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoriesWrap}>
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    onPress={() => {
                      setSelectedCategory(category);
                      clearFieldError("category");
                    }}
                    disabled={isLoading}
                    style={[
                      styles.categoryChip,
                      active && styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        active && styles.categoryChipTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
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
      paddingBottom: 24,
    },

    content: {
      paddingHorizontal: 14,
      paddingTop: 8,
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

    sectionLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 6,
    },

    categoriesWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    categoryChip: {
      minHeight: 32,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    categoryChipActive: {
      backgroundColor: colors.primaryGreenSoft,
      borderColor: colors.primaryGreen,
    },

    categoryChipText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textPrimary,
    },

    categoryChipTextActive: {
      color: colors.primaryGreenDark,
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
