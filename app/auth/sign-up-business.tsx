import { AppColors } from "@/src/constants/colors";
import { US_STATE_BOUNDS } from "@/src/constants/stateBounds";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNotificationsStore } from "@/src/store/notifications.store";
import { AccountTypeSwitch } from "../../src/components/auth";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppPasswordInput from "../../src/components/ui/AppPasswordInput/AppPasswordInput";
import AppSelect from "../../src/components/ui/AppSelect/AppSelect";
import { useRegisterBusiness } from "../../src/features/auth/hooks/useRegisterBusiness";
import {
  SignUpBusinessFormErrors,
  validateSignUpBusinessForm,
} from "../../src/features/auth/validation/signUpBusiness.validation";
import {
  BUSINESS_NAME_HARD_LIMIT,
  BUSINESS_NAME_RECOMMENDED_LIMIT,
  isBusinessNameNearLimit,
} from "../../src/features/businesses/validation/businessProfile.validation";

const US_STATES = Object.keys(US_STATE_BOUNDS);

const FALLBACK_CATEGORIES = [
  "Beauty",
  "Food",
  "Auto",
  "Home & Repair",
  "Education",
  "Health & Medical",
  "Shopping",
  "Entertainment",
];

export default function SignUpBusinessScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { submitRegisterBusiness, isLoading, apiError, setApiError } =
    useRegisterBusiness();
  const setOverviewDraft = useEditBusinessStore((s) => s.setOverviewDraft);

  const { categories } = useCategories();
  const categoryList =
    categories.length > 0 ? categories.map((c) => c.name) : FALLBACK_CATEGORIES;
  const categoryOptions = categoryList.map((name) => ({
    label: name,
    value: name,
  }));

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
  const [stateQuery, setStateQuery] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

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
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
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

  const stateSuggestions =
    stateQuery.trim().length >= 1 && !US_STATES.includes(stateQuery.trim())
      ? US_STATES.filter((s) =>
          s.toLowerCase().startsWith(stateQuery.trim().toLowerCase()),
        )
      : [];

  const selectedCategoryLabel =
    categoryOptions.find((o) => o.value === selectedCategory)?.label ?? "";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
                  maxLength={BUSINESS_NAME_HARD_LIMIT}
                  disabled={isLoading}
                  error={Boolean(errors.businessName)}
                />
                <View style={styles.businessNameHintRow}>
                  {errors.businessName ? (
                    <Text style={styles.errorText}>{errors.businessName}</Text>
                  ) : (
                    <Text style={styles.helperText}>
                      Cannot be changed later
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.charCounter,
                      isBusinessNameNearLimit(businessName) &&
                        styles.charCounterWarning,
                      businessName.length >= BUSINESS_NAME_HARD_LIMIT &&
                        styles.charCounterAtLimit,
                    ]}
                  >
                    {businessName.length}/{BUSINESS_NAME_HARD_LIMIT}
                  </Text>
                </View>
                {!errors.businessName &&
                isBusinessNameNearLimit(businessName) &&
                businessName.length < BUSINESS_NAME_HARD_LIMIT ? (
                  <Text style={styles.helperWarningText}>
                    Recommended length is {BUSINESS_NAME_RECOMMENDED_LIMIT}{" "}
                    characters — longer names may not display well in cards and
                    headers.
                  </Text>
                ) : null}
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

              <View style={{ position: "relative", zIndex: 100 }}>
                <AppInput
                  placeholder="State / Region"
                  value={stateQuery}
                  onChangeText={(value) => {
                    const trimmed = value.replace(/\s+$/, "");
                    setStateQuery(trimmed);
                    setState("");
                    clearFieldError("state");
                    setTimeout(
                      () =>
                        scrollRef.current?.scrollTo({ y: 140, animated: true }),
                      100,
                    );
                  }}
                  error={!!errors.state}
                />
                {stateSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {stateSuggestions.map((suggestion) => (
                      <Pressable
                        key={suggestion}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setState(suggestion);
                          setStateQuery(suggestion);
                          clearFieldError("state");
                        }}
                      >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
                {!!errors.state && (
                  <Text style={styles.errorText}>{errors.state}</Text>
                )}
              </View>

              <View>
                <AppInput
                  placeholder="Latitude"
                  value={latitude}
                  onChangeText={setLatitude}
                  keyboardType="decimal-pad"
                  disabled={isLoading}
                />
                <Text style={styles.helperText}>
                  Optional — helps place your business on the map
                </Text>
              </View>

              <View>
                <AppInput
                  placeholder="Longitude"
                  value={longitude}
                  onChangeText={setLongitude}
                  keyboardType="decimal-pad"
                  disabled={isLoading}
                />
                <Text style={styles.helperText}>
                  Optional — helps place your business on the map
                </Text>
              </View>

              <View>
                <AppInput
                  placeholder="Email address"
                  value={email}
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
                <View
                  style={[styles.checkbox, agree && styles.checkboxChecked]}
                >
                  {agree ? (
                    <Feather name="check" size={12} color={colors.white} />
                  ) : null}
                </View>

                <Text style={styles.checkboxText}>
                  I&apos;ve read and agree with the{" "}
                  <Text style={styles.linkText}>Terms and Conditions</Text> and
                  the <Text style={styles.linkText}>Privacy Policy</Text>.
                </Text>
              </Pressable>

              {errors.agree ? (
                <Text style={styles.errorText}>{errors.agree}</Text>
              ) : null}

              {apiError ? (
                <Text style={styles.apiError}>{apiError}</Text>
              ) : null}

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
            animationType="fade"
            onRequestClose={() => setCategoryModalVisible(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setCategoryModalVisible(false)}
            >
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>Select Category</Text>
                {categoryOptions.map((option) => (
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
                      <Feather
                        name="check"
                        size={16}
                        color={colors.primaryGreen}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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

    helperWarningText: {
      marginTop: 4,
      fontSize: 12,
      color: colors.accentOrange,
      fontWeight: "600",
    },

    businessNameHintRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },

    charCounter: {
      marginTop: 4,
      fontSize: 12,
      color: colors.textMuted,
    },

    charCounterWarning: {
      color: colors.accentOrange,
      fontWeight: "700",
    },

    charCounterAtLimit: {
      color: colors.error,
      fontWeight: "700",
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

    suggestionsContainer: {
      position: "absolute",
      top: 52,
      left: 0,
      right: 0,
      backgroundColor: colors.primaryGreenDark,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primaryGreen,
      zIndex: 999,
      elevation: 10,
      maxHeight: 180,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },

    suggestionItem: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.08)',
    },

    suggestionText: {
      fontSize: 14,
      color: colors.white,
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
