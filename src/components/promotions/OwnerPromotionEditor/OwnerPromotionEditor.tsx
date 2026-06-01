import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import type { PromotionDraft } from "@/src/features/promotions/types/promotion.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useScrollToError } from "@/src/hooks/useScrollToError";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  draft: PromotionDraft;
  onChangeDraft: (draft: PromotionDraft) => void;
  onCancel: () => void;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete?: () => void;
  isPublishing?: boolean;
};

export default function OwnerPromotionEditor({
  visible,
  draft,
  onChangeDraft,
  onCancel,
  onSave,
  onPublish,
  onDelete,
  isPublishing,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [promoCodeVisible, setPromoCodeVisible] = useState(!!draft.promoCode);
  const {
    scrollRef: scrollViewRef,
    registerField,
    scrollToFirstError,
  } = useScrollToError();
  const datePickerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setErrors({});
      setPromoCodeVisible(!!draft.promoCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const isPublished = draft.status === "published";

  useEffect(() => {
    if (showDateModal) {
      Animated.spring(datePickerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      datePickerAnim.setValue(0);
    }
  }, [showDateModal, datePickerAnim]);

  const updateDraft = (patch: Partial<PromotionDraft>) => {
    onChangeDraft({ ...draft, ...patch });
  };

  const clearError = (key: string) => {
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const sanitizeWhileTyping = (t: string) =>
    t.replace(/^\n+/, "").replace(/\n{2,}/g, "\n");

  const sanitizeOnBlur = (t: string) =>
    t
      .replace(/^\n+/, "")
      .replace(/\n{2,}/g, "\n")
      .replace(/\n+$/, "");

  const getTodayDateOnly = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const parseDateOnly = (value?: string | null) => {
    if (!value) return getTodayDateOnly();
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return getTodayDateOnly();
    return new Date(year, month - 1, day);
  };

  const formatDateOnly = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      updateDraft({ imageUrl: result.assets[0].uri });
      clearError("image");
    }
  };

  const validUntil = draft.expiresAt ?? draft.endsAt;
  const formattedValidUntil = validUntil
    ? new Date(validUntil).toLocaleDateString()
    : null;

  const hasImage =
    !!draft.imageUrl &&
    (draft.imageUrl.startsWith("file://") || draft.imageUrl.startsWith("http"));

  const hasDraftContent =
    !!draft.title?.trim() ||
    hasImage ||
    !!draft.description?.trim() ||
    !!draft.discountLabel?.trim() ||
    !!draft.promoCode?.trim() ||
    !!draft.subtitle?.trim() ||
    !!draft.offerDetails?.some((o) => o.trim()) ||
    !!draft.expiresAt;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!draft.title?.trim()) newErrors.title = "Title is required";
    if (!draft.subtitle?.trim()) newErrors.subtitle = "Subtitle is required";
    if (!hasImage) newErrors.image = "Cover image is required";
    if (!draft.offerDetails?.length)
      newErrors.offerDetails = "Offer details are required";
    if (!draft.expiresAt) newErrors.expiresAt = "Expiry date is required";
    if (!draft.ctaLabel?.trim())
      newErrors.ctaLabel = "Please choose a Call to Action";
    const hasPromoCode = !!draft.promoCode?.trim();
    const hasDiscount = !!draft.discountLabel?.trim();
    if (hasPromoCode && !hasDiscount)
      newErrors.discountLabel = "Discount is required when a promo code is set";
    if (hasDiscount && !hasPromoCode)
      newErrors.promoCode = "Promo code is required when a discount is set";
    return newErrors;
  };

  const isPublishReady = Object.keys(validate()).length === 0;

  const handlePublish = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      scrollToFirstError(
        [
          "title",
          "subtitle",
          "image",
          "offerDetails",
          "expiresAt",
          "promoCode",
          "discountLabel",
          "ctaLabel",
        ],
        newErrors,
      );
      return;
    }
    setErrors({});
    onPublish();
  };

  const handleDelete = () => {
    Alert.alert("Delete promotion", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  // Published promotions — read-only detail view
  if (isPublished) {
    return (
      <Modal
        visible={visible}
        transparent={false}
        animationType="slide"
        onRequestClose={onCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pvHeader}>
            <Pressable onPress={onCancel} hitSlop={12}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {!!draft.categoryLabel && (
              <AppText style={styles.pvCategory}>{draft.categoryLabel}</AppText>
            )}
            <AppText style={styles.pvTitle}>{draft.title}</AppText>
            {!!draft.subtitle && (
              <AppText style={styles.pvSubtitle}>{draft.subtitle}</AppText>
            )}
            {!!draft.imageUrl && (
              <Image
                source={{ uri: draft.imageUrl }}
                style={styles.heroImage}
              />
            )}
            {(!!draft.offerDetails?.length || !!formattedValidUntil) && (
              <View style={styles.sectionCard}>
                <AppText style={styles.sectionTitle}>Offer details</AppText>
                {draft.offerDetails?.map((item, i) => (
                  <AppText key={i} style={styles.pvOfferItem}>
                    {item}
                  </AppText>
                ))}
                {!!formattedValidUntil && (
                  <View style={styles.pvValidityRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color={colors.textMuted}
                    />
                    <AppText style={styles.pvValidityText}>
                      Valid until {formattedValidUntil}
                    </AppText>
                  </View>
                )}
              </View>
            )}
            {!!draft.promoCode && (
              <View style={styles.sectionCard}>
                <AppText style={styles.sectionTitle}>Promo code</AppText>
                <View style={styles.pvPromoCodeBox}>
                  <AppText style={styles.pvPromoCodeText}>
                    {draft.promoCode}
                  </AppText>
                </View>
              </View>
            )}
            <View style={styles.pvActions}>
              <AppButton
                title={draft.ctaLabel ?? "Book Now"}
                variant="primary"
              />
              <AppButton title="View Business" variant="secondary" />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <AppText style={styles.deleteButtonText}>
                Delete promotion
              </AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>
            {draft.id ? "Edit promotion" : "Create promotion"}
          </AppText>
          <Pressable style={styles.closeButton} onPress={onCancel} hitSlop={12}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ── Title ── */}
            <View {...registerField("title")}>
              <TextInput
                placeholder="Promotion title"
                placeholderTextColor={colors.textMuted}
                value={draft.title}
                onChangeText={(t) => {
                  updateDraft({ title: sanitizeWhileTyping(t) });
                  clearError("title");
                }}
                onBlur={() =>
                  updateDraft({ title: sanitizeOnBlur(draft.title ?? "") })
                }
                style={[
                  styles.titleInput,
                  !!errors.title && styles.titleInputError,
                ]}
                multiline
              />
              {!!errors.title && (
                <AppText style={styles.errorText}>{errors.title}</AppText>
              )}
            </View>

            {/* ── Subtitle ── */}
            <View {...registerField("subtitle")}>
              <TextInput
                placeholder="Short subtitle"
                placeholderTextColor={colors.textMuted}
                value={draft.subtitle}
                onChangeText={(t) => {
                  updateDraft({ subtitle: sanitizeWhileTyping(t) });
                  clearError("subtitle");
                }}
                onBlur={() =>
                  updateDraft({
                    subtitle: sanitizeOnBlur(draft.subtitle ?? ""),
                  })
                }
                style={[
                  styles.subtitleInput,
                  !!errors.subtitle && styles.fieldError,
                ]}
                multiline
              />
              {!!errors.subtitle && (
                <AppText style={styles.errorText}>{errors.subtitle}</AppText>
              )}
            </View>

            {/* ── Image picker ── */}
            <View {...registerField("image")}>
              {hasImage ? (
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: draft.imageUrl }}
                    style={styles.heroImage}
                  />
                  <Pressable
                    style={styles.imageEditOverlay}
                    onPress={pickImage}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={20}
                      color={colors.white}
                    />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={[
                    styles.imagePlaceholder,
                    !!errors.image && { borderColor: colors.error },
                  ]}
                  onPress={pickImage}
                >
                  <Ionicons
                    name="image-outline"
                    size={32}
                    color={colors.textMuted}
                  />
                  <AppText style={styles.imagePlaceholderText}>
                    Add cover image
                  </AppText>
                </Pressable>
              )}
              {!!errors.image && (
                <AppText style={styles.errorText}>{errors.image}</AppText>
              )}
            </View>

            {/* ── Offer details card ── */}
            <View {...registerField("offerDetails")}>
              <View
                style={[
                  styles.sectionCard,
                  !!errors.offerDetails && { borderColor: colors.error },
                ]}
              >
                <AppText style={styles.sectionTitle}>Offer details</AppText>
                <TextInput
                  placeholder="Describe the offer details..."
                  placeholderTextColor={colors.textMuted}
                  value={draft.offerDetails?.join("\n") ?? ""}
                  onChangeText={(t) => {
                    updateDraft({
                      offerDetails: sanitizeWhileTyping(t).split("\n"),
                    });
                    clearError("offerDetails");
                  }}
                  onBlur={() =>
                    updateDraft({
                      offerDetails: [
                        sanitizeOnBlur(draft.offerDetails?.join("\n") ?? ""),
                      ],
                    })
                  }
                  style={styles.textAreaInput}
                  multiline
                  textAlignVertical="top"
                />
                {/* Valid until row */}
                <Pressable
                  style={styles.validityRow}
                  onPress={() => {
                    Keyboard.dismiss();
                    setTempDate(parseDateOnly(draft.expiresAt));
                    setShowDateModal(true);
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={errors.expiresAt ? colors.error : colors.textMuted}
                  />
                  <AppText
                    style={[
                      styles.validityText,
                      {
                        color: errors.expiresAt
                          ? colors.error
                          : colors.textMuted,
                      },
                    ]}
                  >
                    {formattedValidUntil
                      ? `Valid until ${formattedValidUntil}`
                      : "Set expiry date"}
                  </AppText>
                </Pressable>
              </View>
              {!!errors.offerDetails && (
                <AppText style={styles.errorText}>
                  {errors.offerDetails}
                </AppText>
              )}
              {!!errors.expiresAt && (
                <AppText style={styles.errorText}>{errors.expiresAt}</AppText>
              )}
            </View>

            {/* ── Promo code (optional) ── */}
            <View {...registerField("promoCode")} />
            {!promoCodeVisible ? (
              <Pressable
                style={styles.addRow}
                onPress={() => setPromoCodeVisible(true)}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={colors.primaryGreen}
                />
                <AppText style={styles.addRowText}>Add promo code</AppText>
              </Pressable>
            ) : (
              <View style={styles.sectionCard}>
                <View style={styles.sectionCardHeader}>
                  <AppText style={styles.sectionTitle}>Promo code</AppText>
                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      setPromoCodeVisible(false);
                      updateDraft({ promoCode: undefined });
                    }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={colors.error}
                    />
                  </Pressable>
                </View>
                <View style={styles.promoCodePill}>
                  <TextInput
                    value={draft.promoCode ?? ""}
                    onChangeText={(t) => updateDraft({ promoCode: t })}
                    style={styles.promoCodeInput}
                    autoCapitalize="characters"
                    placeholder="ADD PROMO CODE HERE"
                    placeholderTextColor={colors.accentOrange + "66"}
                    maxLength={20}
                  />
                </View>
                <View style={styles.discountRow}>
                  <AppText style={styles.discountLabel}>Discount</AppText>
                  <View style={styles.discountPill}>
                    <TextInput
                      value={draft.discountLabel ?? ""}
                      onChangeText={(t) => {
                        const num = parseInt(t, 10);
                        if (t === "") {
                          updateDraft({ discountLabel: "" });
                        } else if (!isNaN(num) && num >= 1 && num <= 100) {
                          updateDraft({ discountLabel: String(num) });
                        }
                      }}
                      style={styles.discountInput}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                      maxLength={3}
                    />
                    <AppText style={styles.discountPercent}>%</AppText>
                  </View>
                </View>
                {!!errors.discountLabel && (
                  <AppText style={styles.errorText}>
                    {errors.discountLabel}
                  </AppText>
                )}
                {!!errors.promoCode && (
                  <AppText style={styles.errorText}>{errors.promoCode}</AppText>
                )}
              </View>
            )}

            {/* ── CTA selector ── */}
            <View {...registerField("ctaLabel")}>
              <AppText style={styles.ctaSectionLabel}>
                Choose Call to Action
              </AppText>
              <View style={styles.ctaRow}>
                <Pressable
                  style={[
                    styles.ctaPill,
                    draft.ctaLabel === "Book Now" && styles.ctaPillActive,
                  ]}
                  onPress={() => {
                    updateDraft({ ctaType: "book_now", ctaLabel: "Book Now" });
                    clearError("ctaLabel");
                  }}
                >
                  <AppText
                    style={[
                      styles.ctaPillText,
                      draft.ctaLabel === "Book Now" && styles.ctaPillTextActive,
                    ]}
                  >
                    Book Now
                  </AppText>
                </Pressable>
                <Pressable
                  style={[
                    styles.ctaPill,
                    draft.ctaLabel === "Order Now" && styles.ctaPillActive,
                  ]}
                  onPress={() => {
                    updateDraft({ ctaType: "book_now", ctaLabel: "Order Now" });
                    clearError("ctaLabel");
                  }}
                >
                  <AppText
                    style={[
                      styles.ctaPillText,
                      draft.ctaLabel === "Order Now" &&
                        styles.ctaPillTextActive,
                    ]}
                  >
                    Order Now
                  </AppText>
                </Pressable>
              </View>
              <View style={styles.ctaPillViewBusiness}>
                <AppText style={styles.ctaPillViewBusinessText}>
                  View Business
                </AppText>
                <AppText style={styles.ctaPillViewBusinessDefault}>
                  Default
                </AppText>
              </View>
              {!!errors.ctaLabel && (
                <AppText style={styles.errorText}>{errors.ctaLabel}</AppText>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {showDateModal && (
          <Animated.View
            style={[
              styles.datePickerContainer,
              {
                opacity: datePickerAnim,
                transform: [
                  {
                    translateY: datePickerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.datePickerHeader}>
              <Pressable onPress={() => setShowDateModal(false)} hitSlop={12}>
                <AppText style={styles.datePickerCancel}>Cancel</AppText>
              </Pressable>
              <Pressable
                onPress={() => {
                  const iso = formatDateOnly(tempDate);
                  updateDraft({ expiresAt: iso });
                  clearError("expiresAt");
                  setShowDateModal(false);
                }}
                hitSlop={12}
              >
                <AppText style={styles.datePickerDone}>Done</AppText>
              </Pressable>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              minimumDate={getTodayDateOnly()}
              onChange={(_event, selectedDate) => {
                if (selectedDate) setTempDate(selectedDate);
              }}
            />
          </Animated.View>
        )}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.footerButton}>
              <AppButton title="Cancel" onPress={onCancel} variant="ghost" />
            </View>
            <View
              style={[
                styles.footerButton,
                !hasDraftContent && { opacity: 0.4 },
              ]}
            >
              <AppButton
                title="Save draft"
                onPress={onSave}
                variant="ghost"
                disabled={!hasDraftContent}
              />
            </View>
          </View>
          <View
            style={
              !isPublishReady && !isPublishing ? { opacity: 0.5 } : undefined
            }
          >
            <AppButton
              title={isPublishing ? "Publishing..." : "Publish"}
              onPress={handlePublish}
              variant="primary"
              disabled={isPublishing}
            />
          </View>
          {!!draft.id && !!onDelete && (
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <AppText style={styles.deleteButtonText}>Delete</AppText>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 56,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
      gap: 16,
    },

    // Title
    titleInput: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "800",
      color: colors.textPrimary,
      paddingVertical: 4,
    },
    titleInputError: {
      borderBottomWidth: 1.5,
      borderBottomColor: colors.error,
    },

    // Subtitle
    subtitleInput: {
      fontSize: 15,
      color: colors.textSecondary,
      paddingVertical: 4,
    },
    fieldError: {
      borderBottomWidth: 1.5,
      borderBottomColor: colors.error,
    },

    errorText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },

    // Image picker
    imageWrapper: {
      position: "relative",
    },
    heroImage: {
      width: "100%",
      height: 220,
      borderRadius: 18,
    },
    imageEditOverlay: {
      position: "absolute",
      bottom: 10,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: 8,
      borderRadius: 999,
    },
    imagePlaceholder: {
      height: 180,
      borderRadius: 18,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    imagePlaceholderText: {
      fontSize: 14,
      color: colors.textMuted,
    },

    // Section cards
    sectionCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 16,
    },
    sectionCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    textAreaInput: {
      fontSize: 14,
      color: colors.textPrimary,
      minHeight: 80,
    },
    validityRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    validityText: {
      fontSize: 13,
      fontWeight: "600",
    },

    // Promo code
    addRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    addRowText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primaryGreen,
    },
    promoCodePill: {
      alignSelf: "flex-start",
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: colors.accentOrange,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 8,
    },
    promoCodeInput: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.accentOrange,
      paddingVertical: 0,
      minWidth: 80,
    },
    discountRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 12,
    },
    discountLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    discountPill: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: colors.accentOrange,
      paddingHorizontal: 14,
      paddingVertical: 6,
      gap: 4,
    },
    discountInput: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.accentOrange,
      minWidth: 36,
      paddingVertical: 0,
      textAlign: "center",
    },
    discountPercent: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.accentOrange,
    },

    // Date picker
    datePickerContainer: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: "center",
    },
    datePickerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      width: "100%",
    },
    datePickerCancel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    datePickerDone: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.primaryGreen,
    },

    // CTA
    ctaSectionLabel: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    ctaRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 8,
    },
    ctaPill: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
    },
    ctaPillActive: {
      backgroundColor: colors.accentOrange,
      borderColor: colors.accentOrange,
    },
    ctaPillText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    ctaPillTextActive: {
      color: colors.white,
    },
    ctaPillViewBusiness: {
      width: "100%",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.primaryGreen,
      alignItems: "center",
      opacity: 0.5,
    },
    ctaPillViewBusinessText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.white,
      textAlign: "center",
    },
    ctaPillViewBusinessDefault: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.white,
      opacity: 0.7,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // Footer
    footer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      gap: 8,
    },
    footerRow: {
      flexDirection: "row",
      gap: 8,
    },
    footerButton: {
      flex: 1,
    },
    deleteButton: {
      height: 52,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    deleteButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.error,
    },

    // Published notice (unused — kept for compatibility)
    publishedNotice: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingHorizontal: 32,
    },
    publishedNoticeText: {
      fontSize: 15,
      color: colors.textMuted,
      textAlign: "center",
    },

    // Published view
    pvHeader: {
      paddingHorizontal: 16,
      paddingTop: 56,
      paddingBottom: 12,
    },
    pvCategory: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
    },
    pvTitle: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    pvSubtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    pvOfferItem: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
    },
    pvValidityRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
    },
    pvValidityText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textMuted,
    },
    pvPromoCodeBox: {
      alignSelf: "flex-start",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.accentOrangeSoft,
      borderWidth: 1,
      borderColor: colors.accentOrange,
      marginTop: 8,
    },
    pvPromoCodeText: {
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: 1,
      color: colors.accentOrange,
    },
    pvActions: {
      gap: 12,
    },
  });
}
