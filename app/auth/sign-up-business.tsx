import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useNotificationsStore } from "@/src/store/notifications.store";
import { AccountTypeSwitch } from "../../src/components/auth";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppPasswordInput from "../../src/components/ui/AppPasswordInput/AppPasswordInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import AppSelect from "../../src/components/ui/AppSelect/AppSelect";
import { useRegisterBusiness } from "../../src/features/auth/hooks/useRegisterBusiness";
import {
  SignUpBusinessFormErrors,
  validateSignUpBusinessForm,
} from "../../src/features/auth/validation/signUpBusiness.validation";

const CATEGORY_OPTIONS: { label: string; value: string }[] = [
  { label: "Beauty", value: "Beauty" },
  { label: "Food", value: "Food" },
  { label: "Auto", value: "Auto" },
  { label: "Home & Repair", value: "Home & Repair" },
  { label: "Education", value: "Education" },
  { label: "Restaurant", value: "Restaurant" },
  { label: "Medical", value: "Medical" },
  { label: "Other", value: "Other" },
];

export default function SignUpBusinessScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { submitRegisterBusiness, isLoading, apiError, setApiError } =
    useRegisterBusiness();
  const setOverviewDraft = useEditBusinessStore((s) => s.setOverviewDraft);

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<SignUpBusinessFormErrors>({});

  const clearFieldError = (field: keyof SignUpBusinessFormErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError(null);
  };

  const setNotificationsAccountType = useNotificationsStore(
    (s) => s.setActiveAccountType,
  );

  const handleSubmit = async () => {
    if (isLoading) return;

    const values = {
      businessName,
      ownerName,
      email,
      password,
      confirmPassword,
      category: selectedCategory,
      address,
      zipCode,
      city,
      state,
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
      address,
      zipCode,
      city,
      state,
    });

    if (response) {
      setOverviewDraft({
        name: businessName,
        category: selectedCategory,
        address,
        city,
        state,
        postalCode: zipCode,
      });
      setNotificationsAccountType("business");
      router.push({
        pathname: "/auth/confirm-code",
        params: { email: response.email },
      });
    }
  };

  const selectedCategoryLabel =
    CATEGORY_OPTIONS.find((o) => o.value === selectedCategory)?.label ?? "";

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
            ) : (
              <Text style={styles.helperText}>Cannot be changed later</Text>
            )}
          </View>

          <View>
            <AppInput
              placeholder="Your full name"
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
            <AppSelect
              placeholder="Select category"
              value={selectedCategoryLabel}
              disabled={isLoading}
              error={Boolean(errors.category)}
              onPress={() => setCategoryModalVisible(true)}
            />
            {errors.category ? (
              <Text style={styles.errorText}>{errors.category}</Text>
            ) : (
              <Text style={styles.helperText}>Cannot be changed later</Text>
            )}
          </View>

          <View>
            <AppInput
              placeholder="Address"
              value={address}
              onChangeText={(value) => {
                setAddress(value);
                clearFieldError("address");
              }}
              disabled={isLoading}
              error={Boolean(errors.address)}
            />
            {errors.address ? (
              <Text style={styles.errorText}>{errors.address}</Text>
            ) : null}
          </View>

          <View style={styles.addressRow}>
            <View style={styles.addressZip}>
              <AppInput
                placeholder="ZIP Code"
                value={zipCode}
                onChangeText={(value) => {
                  setZipCode(value);
                  clearFieldError("zipCode");
                }}
                keyboardType="numeric"
                disabled={isLoading}
                error={Boolean(errors.zipCode)}
              />
              {errors.zipCode ? (
                <Text style={styles.errorText}>{errors.zipCode}</Text>
              ) : null}
            </View>

            <View style={styles.addressCity}>
              <AppInput
                placeholder="City"
                value={city}
                onChangeText={(value) => {
                  setCity(value);
                  clearFieldError("city");
                }}
                disabled={isLoading}
                error={Boolean(errors.city)}
              />
              {errors.city ? (
                <Text style={styles.errorText}>{errors.city}</Text>
              ) : null}
            </View>
          </View>

          <View>
            <AppInput
              placeholder="State / Region"
              value={state}
              onChangeText={(value) => {
                setState(value);
                clearFieldError("state");
              }}
              disabled={isLoading}
              error={Boolean(errors.state)}
            />
            {errors.state ? (
              <Text style={styles.errorText}>{errors.state}</Text>
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

      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {CATEGORY_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedCategory(option.value);
                  clearFieldError("category");
                  setCategoryModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedCategory === option.value &&
                      styles.modalOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {selectedCategory === option.value && (
                  <Feather name="check" size={16} color={colors.primaryGreen} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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

    helperText: {
      marginTop: 4,
      fontSize: 12,
      color: colors.textMuted,
    },

    addressRow: {
      flexDirection: "row",
      gap: 8,
    },

    addressZip: {
      flex: 1,
    },

    addressCity: {
      flex: 2,
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

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },

    modalSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 32,
    },

    modalTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 12,
    },

    modalOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    modalOptionText: {
      fontSize: 15,
      color: colors.textPrimary,
    },

    modalOptionTextActive: {
      color: colors.primaryGreen,
      fontWeight: "700",
    },
  });
}
