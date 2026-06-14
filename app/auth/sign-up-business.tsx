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
import { useTranslation } from "react-i18next";
import { AccountTypeSwitch } from "../../src/components/auth";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppPasswordInput from "../../src/components/ui/AppPasswordInput/AppPasswordInput";
import AppSelect from "../../src/components/ui/AppSelect/AppSelect";
import ClearableInput from "../../src/components/ui/ClearableInput";
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

const CUISINE_OPTIONS = [
  "American",
  "Chinese",
  "Italian",
  "Japanese",
  "Mediterranean",
  "Mexican",
  "Ukrainian",
  "Vegan",
].map((c) => ({ label: c, value: c }));

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
  const { t } = useTranslation();

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
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [cuisineModalVisible, setCuisineModalVisible] = useState(false);
  const [stateScrollOffset, setStateScrollOffset] = useState(0);
  const [stateScrollViewHeight, setStateScrollViewHeight] = useState(0);
  const [stateContentHeight, setStateContentHeight] = useState(0);
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

  const clearBusinessName = () => {
    setBusinessName("");
    clearFieldError("businessName");
  };

  const clearOwnerName = () => {
    setOwnerName("");
    clearFieldError("ownerName");
  };

  const clearAddress = () => {
    setAddress("");
    clearFieldError("address");
  };

  const clearZipCode = () => {
    setZipCode("");
    clearFieldError("zipCode");
  };

  const clearCity = () => {
    setCity("");
    clearFieldError("city");
  };

  const clearState = () => {
    setState("");
    setStateQuery("");
    clearFieldError("state");
  };

  const clearEmail = () => {
    setEmail("");
    clearFieldError("email");
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    const values = {
      businessName,
      ownerName,
      email,
      password,
      confirmPassword,
      category: selectedCategory,
      cuisine: selectedCuisine,
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
      cuisine: selectedCuisine,
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
        latitude: latitude || undefined,
        longitude: longitude || undefined,
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
                <ClearableInput
                  placeholder={t("auth.signUpBusiness.businessNamePlaceholder")}
                  value={businessName}
                  onClear={clearBusinessName}
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
                      {t("auth.signUpBusiness.cannotChangeLater")}
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
                    {t("auth.signUpBusiness.recommendedLength", { limit: BUSINESS_NAME_RECOMMENDED_LIMIT })}
                  </Text>
                ) : null}
              </View>

              <View>
                <ClearableInput
                  placeholder={t("auth.signUpBusiness.ownerNamePlaceholder")}
                  value={ownerName}
                  onClear={clearOwnerName}
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
                  placeholder={t("auth.signUpBusiness.categoryPlaceholder")}
                  value={selectedCategoryLabel}
                  disabled={isLoading}
                  error={Boolean(errors.category)}
                  onPress={() => setCategoryModalVisible(true)}
                />

                {errors.category ? (
                  <Text style={styles.errorText}>{errors.category}</Text>
                ) : (
                  <Text style={styles.helperText}>{t("auth.signUpBusiness.cannotChangeLater")}</Text>
                )}

                {selectedCategory === "Food" &&
                !selectedCuisine &&
                errors.cuisine ? (
                  <Text style={styles.errorText}>{errors.cuisine}</Text>
                ) : null}

                {selectedCategory === "Food" && !!selectedCuisine && (
                  <Pressable onPress={() => setCuisineModalVisible(true)}>
                    <Text style={styles.helperText}>
                      <Text style={{ color: colors.white, fontWeight: "700" }}>
                        {selectedCuisine}
                      </Text>
                      <Text
                        style={{
                          color: colors.primaryGreen,
                          fontWeight: "700",
                        }}
                      >
                        {t("auth.signUpBusiness.tapToChange")}
                      </Text>
                    </Text>
                  </Pressable>
                )}
              </View>

              <View>
                <ClearableInput
                  placeholder={t("auth.signUpBusiness.addressPlaceholder")}
                  value={address}
                  onClear={clearAddress}
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
                  <ClearableInput
                    placeholder={t("auth.signUpBusiness.zipCodePlaceholder")}
                    value={zipCode}
                    onClear={clearZipCode}
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
                  <ClearableInput
                    placeholder={t("auth.signUpBusiness.cityPlaceholder")}
                    value={city}
                    onClear={clearCity}
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
                <ClearableInput
                  placeholder={t("auth.signUpBusiness.statePlaceholder")}
                  value={stateQuery}
                  onClear={clearState}
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
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      style={{ maxHeight: 180 }}
                      onScroll={(e) =>
                        setStateScrollOffset(e.nativeEvent.contentOffset.y)
                      }
                      onLayout={(e) =>
                        setStateScrollViewHeight(e.nativeEvent.layout.height)
                      }
                      onContentSizeChange={(_, h) => setStateContentHeight(h)}
                      scrollEventThrottle={16}
                    >
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
                          <Text style={styles.suggestionText}>
                            {suggestion}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>

                    {stateContentHeight > stateScrollViewHeight &&
                      (() => {
                        const trackHeight = stateScrollViewHeight - 12;
                        const thumbHeight = Math.max(
                          20,
                          (stateScrollViewHeight / stateContentHeight) *
                            trackHeight,
                        );
                        const maxThumbTop = trackHeight - thumbHeight;
                        const thumbTop = Math.min(
                          maxThumbTop,
                          Math.max(
                            0,
                            (stateScrollOffset /
                              (stateContentHeight - stateScrollViewHeight)) *
                              maxThumbTop,
                          ),
                        );

                        return (
                          <View style={styles.scrollTrack}>
                            <View
                              style={[
                                styles.scrollThumb,
                                { height: thumbHeight, top: thumbTop },
                              ]}
                            />
                          </View>
                        );
                      })()}
                  </View>
                )}

                {!!errors.state && (
                  <Text style={styles.errorText}>{errors.state}</Text>
                )}
              </View>

              <View>
                <ClearableInput
                  placeholder={t("auth.signUpBusiness.latitudePlaceholder")}
                  value={latitude}
                  onChangeText={setLatitude}
                  onClear={() => setLatitude("")}
                  keyboardType={
                    Platform.OS === "ios" ? "decimal-pad" : "default"
                  }
                  disabled={isLoading}
                />

                <Text style={styles.helperText}>
                  {t("auth.signUpBusiness.optionalMap")}
                </Text>
              </View>

              <View>
                <ClearableInput
                  placeholder={t("auth.signUpBusiness.longitudePlaceholder")}
                  value={longitude}
                  onChangeText={setLongitude}
                  onClear={() => setLongitude("")}
                  keyboardType={
                    Platform.OS === "ios" ? "decimal-pad" : "default"
                  }
                  disabled={isLoading}
                />

                <Text style={styles.helperText}>
                  {t("auth.signUpBusiness.optionalMap")}
                </Text>
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
                <View
                  style={[styles.checkbox, agree && styles.checkboxChecked]}
                >
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

              {apiError ? (
                <Text style={styles.apiError}>{apiError}</Text>
              ) : null}

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
                <Text style={styles.modalTitle}>{t("auth.signUpBusiness.selectCategoryTitle")}</Text>

                {categoryOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    style={styles.modalOption}
                    onPress={() => {
                      setSelectedCategory(option.value);
                      clearFieldError("category");
                      setCategoryModalVisible(false);
                      if (option.value === "Food") {
                        setCuisineModalVisible(true);
                      }
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

          <Modal
            visible={cuisineModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setCuisineModalVisible(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setCuisineModalVisible(false)}
            >
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>{t("auth.signUpBusiness.selectCuisineTitle")}</Text>

                {CUISINE_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    style={styles.modalOption}
                    onPress={() => {
                      setSelectedCuisine(option.value);
                      setCuisineModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedCuisine === option.value &&
                          styles.modalOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
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
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },

    scrollTrack: {
      position: "absolute",
      right: 4,
      top: 6,
      bottom: 6,
      width: 3,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.15)",
    },

    scrollThumb: {
      position: "absolute",
      width: 3,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.5)",
    },

    suggestionItem: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.08)",
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
