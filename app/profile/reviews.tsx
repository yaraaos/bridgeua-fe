import ReviewCard from "@/src/components/business/ReviewCard";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import {
  deleteReview,
  getMyReviews,
  updateReview,
} from "@/src/features/reviews/services/review.service";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { PersonalProfileReview } from "@/src/types/profile";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ProfileReviewsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<PersonalProfileReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [editingReview, setEditingReview] =
    useState<PersonalProfileReview | null>(null);
  const [editedRating, setEditedRating] = useState(5);
  const [editedText, setEditedText] = useState("");

  const [editedPhotos, setEditedPhotos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const canSaveReview = editedText.trim().length > 0 || editedPhotos.length > 0;
  const hasUnsavedChanges =
    !!editingReview &&
    (editedText.trim() !== editingReview.text.trim() ||
      editedRating !== editingReview.rating ||
      JSON.stringify(editedPhotos) !==
        JSON.stringify(editingReview.photos?.map((photo) => photo.url) ?? []));
  const flatListRef = useRef<FlatList<PersonalProfileReview> | null>(null);

  const reviewOffsets = useRef<Record<string, number>>({});

  const handleExpandReview = (reviewId: string) => {
    const y = reviewOffsets.current[reviewId];

    if (y === undefined) {
      return;
    }

    flatListRef.current?.scrollToOffset({
      offset: Math.max(0, y - 140),
      animated: true,
    });
  };

  const loadReviews = useCallback(async () => {
    const data = await getMyReviews();
    setReviews(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setIsLoading(true);
        await loadReviews();
        setIsLoading(false);
      };

      load();
    }, [loadReviews]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const handleToggleActionMenu = (reviewId: string) => {
    setOpenActionMenuReviewId((currentReviewId) =>
      currentReviewId === reviewId ? null : reviewId,
    );
  };

  const handleCloseActionMenu = () => {
    setOpenActionMenuReviewId(null);
  };

  const openEditModal = (review: PersonalProfileReview) => {
    handleCloseActionMenu();
    setEditingReview(review);
    setEditedText(review.text);
    setEditedRating(review.rating);
    setEditedPhotos(review.photos?.map((photo) => photo.url) ?? []);
  };

  const resetEditState = () => {
    setEditingReview(null);
    setEditedRating(5);
    setEditedText("");
    setEditedPhotos([]);
    setIsSaving(false);
  };

  const closeEditModal = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        t("profile.reviews.discardTitle"),
        t("profile.reviews.discardMessage"),
        [
          {
            text: t("profile.reviews.discardKeepEditing"),
            style: "cancel",
          },
          {
            text: t("profile.reviews.discardConfirm"),
            style: "destructive",
            onPress: resetEditState,
          },
        ],
      );

      return;
    }

    resetEditState();
  };

  const [openActionMenuReviewId, setOpenActionMenuReviewId] = useState<
    string | null
  >(null);

  const handleRemoveEditedPhoto = (photoUrl: string) => {
    setEditedPhotos((currentPhotos) =>
      currentPhotos.filter((url) => url !== photoUrl),
    );
  };

  const handleSaveReview = async () => {
    if (!editingReview || isSaving || !canSaveReview) return;
    const trimmedText = editedText.trim();

    setIsSaving(true);

    const updatedReview = await updateReview({
      reviewId: editingReview.id,
      businessId: editingReview.businessId,
      rating: editedRating,
      text: trimmedText,
      photos: editedPhotos,
    });

    if (!updatedReview) {
      setIsSaving(false);
      Alert.alert(t("profile.reviews.notFoundTitle"), t("profile.reviews.notFoundMessage"));
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === editingReview.id
          ? {
              ...review,
              rating: updatedReview.rating,
              text: updatedReview.text,
              photos: updatedReview.photos,
              isEdited: updatedReview.isEdited,
            }
          : review,
      ),
    );

    resetEditState();
  };

  const handleDeleteReview = (review: PersonalProfileReview) => {
    Alert.alert(
      t("profile.reviews.deleteTitle"),
      t("profile.reviews.deleteMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await deleteReview(review.id, review.businessId);

            setReviews((currentReviews) =>
              currentReviews.filter((item) => item.id !== review.id),
            );
          },
        },
      ],
    );
  };

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title={t("profile.reviews.title")}
        titleSubtitle={t("profile.reviews.subtitle")}
        onBack={() => router.back()}
        gradientColors={DISCOVERY_GRADIENT}
      />

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <AppLoader />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={reviews}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={handleCloseActionMenu}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.listContent,
            reviews.length === 0 && styles.emptyContent,
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                marginHorizontal: 16,
                backgroundColor: colors.border,
              }}
            />
          )}
          renderItem={({ item }) => (
            <View
              onLayout={(event) => {
                reviewOffsets.current[item.id] = event.nativeEvent.layout.y;
              }}
            >
              <ReviewCard
                review={item}
                variant="profile"
                onExpandReview={handleExpandReview}
                onEditReview={openEditModal}
                onDeleteReview={handleDeleteReview}
                isActionMenuOpen={openActionMenuReviewId === item.id}
                onToggleActionMenu={handleToggleActionMenu}
                onCloseActionMenu={handleCloseActionMenu}
                onPressReview={(reviewId) => {
                  const review = reviews.find((r) => r.id === reviewId);
                  if (!review) return;
                  router.push({
                    pathname: "/business/[id]",
                    params: {
                      id: review.businessId,
                      tab: "reviews",
                      focusedReviewId: reviewId,
                    },
                  });
                }}
              />
            </View>
          )}
          ListEmptyComponent={
            <AppEmptyState
              title={t("profile.reviews.emptyTitle")}
              description={t("profile.reviews.emptyDesc")}
            />
          }
        />
      )}

      {openActionMenuReviewId ? (
        <Pressable
          style={styles.menuBackdrop}
          onPress={handleCloseActionMenu}
        />
      ) : null}

      <Modal
        visible={!!editingReview}
        transparent
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {t("profile.reviews.editTitle")}
            </Text>

            <Text
              style={[
                styles.modalBusinessName,
                { color: colors.textSecondary },
              ]}
            >
              {editingReview?.businessName}
            </Text>

            <View style={styles.modalStarsRow}>
              {Array.from({ length: 5 }).map((_, index) => {
                const ratingValue = index + 1;
                const isFilled = ratingValue <= editedRating;

                return (
                  <Pressable
                    key={ratingValue}
                    onPress={() => setEditedRating(ratingValue)}
                    hitSlop={8}
                  >
                    <MaterialIcons
                      name={isFilled ? "star" : "star-border"}
                      size={28}
                      color={colors.accentOrange}
                    />
                  </Pressable>
                );
              })}
            </View>

            {editedPhotos.length > 0 ? (
              <View style={styles.editPhotosGrid}>
                {editedPhotos.map((photoUrl) => (
                  <View key={photoUrl} style={styles.editPhotoWrap}>
                    <Image
                      source={{ uri: photoUrl }}
                      style={styles.editPhoto}
                    />

                    <Pressable
                      style={styles.removePhotoButton}
                      onPress={() => handleRemoveEditedPhoto(photoUrl)}
                      hitSlop={8}
                    >
                      <MaterialIcons name="close" size={14} color="#FFFFFF" />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}

            <TextInput
              value={editedText}
              onChangeText={setEditedText}
              multiline
              placeholder={t("profile.reviews.updatePlaceholder")}
              placeholderTextColor={colors.textMuted}
              style={[
                styles.modalInput,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                },
              ]}
            />

            <View style={styles.modalActionsRow}>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.modalSecondaryButton,
                  { borderColor: colors.border },
                ]}
                onPress={closeEditModal}
                disabled={isSaving}
              >
                <Text
                  style={[
                    styles.modalSecondaryText,
                    { color: colors.textPrimary },
                  ]}
                >
                  {t("common.cancel")}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: canSaveReview
                      ? colors.primaryGreen
                      : colors.border,
                  },
                  (!canSaveReview || isSaving) && styles.disabledButton,
                ]}
                onPress={handleSaveReview}
                disabled={!canSaveReview || isSaving}
              >
                <Text style={styles.modalPrimaryText}>
                  {isSaving ? t("profile.reviews.saving") : t("profile.reviews.save")}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalCard: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  modalBusinessName: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  modalStarsRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 18,
  },
  editPhotosGrid: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  editPhotoWrap: {
    position: "relative",
  },
  editPhoto: {
    width: 74,
    height: 74,
    borderRadius: 14,
  },
  removePhotoButton: {
    position: "absolute",
    top: -7,
    right: -7,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  modalInput: {
    minHeight: 120,
    marginTop: 18,
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: "top",
  },
  modalActionsRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSecondaryButton: {
    borderWidth: 1,
  },
  modalSecondaryText: {
    fontSize: 14,
    fontWeight: "800",
  },
  modalPrimaryText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.6,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: -1,
  },
});
