import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { colors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const REVIEW_TAGS = [
  "Great service",
  "Clean & comfortable",
  "Professional staff",
  "Good value",
  "Easy booking",
  "Relaxing atmosphere",
];

const MAX_REVIEW_LENGTH = 500;
const MAX_PHOTOS = 4;

export default function WriteReviewScreen() {
  const { businessId, rating: initialRating } = useLocalSearchParams<{
    businessId?: string;
    rating?: string;
  }>();

  const { business, isLoading } = useBusinessDetails(businessId);
  const [rating, setRating] = useState(Number(initialRating ?? 0));
  const [review, setReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  const ratingLabel = useMemo(() => {
    if (rating === 5) return "Excellent";
    if (rating === 4) return "Great";
    if (rating === 3) return "Good";
    if (rating === 2) return "Could be better";
    if (rating === 1) return "Poor";
    return "Tap to rate";
  }, [rating]);

  const canSubmit = rating > 0 && review.trim().length >= 10;

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  const handlePickPhotos = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo access to add review photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: MAX_PHOTOS - photos.length,
    });

    if (result.canceled) return;

    const selectedUris = result.assets.map((asset) => asset.uri);

    setPhotos((current) => [...current, ...selectedUris].slice(0, MAX_PHOTOS));
  };

  const handleRemovePhoto = (uri: string) => {
    setPhotos((current) => current.filter((photo) => photo !== uri));
  };

  const handleSubmit = () => {
    if (!canSubmit || !business) return;

    console.log("Submit review", {
      businessId: business.id,
      rating,
      review: review.trim(),
      tags: selectedTags,
      photos,
    });

    Alert.alert("Review submitted", "Thank you for helping the community.", [
      {
        text: "Done",
        onPress: () => router.back(),
      },
    ]);
  };

  if (isLoading) {
    return (
      <AppScreen style={styles.center}>
        <ActivityIndicator />
      </AppScreen>
    );
  }

  if (!business) {
    return (
      <AppScreen style={styles.center}>
        <Text style={styles.errorText}>Business not found</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen withTopInset style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle}>Write a Review</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.businessCard}>
          <Image
            source={{ uri: business.images[0]?.url }}
            style={styles.businessImage}
          />

          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{business.name}</Text>
            <Text style={styles.businessMeta}>
              {business.category} · {business.location}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Your rating</Text>

          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              const isSelected = value <= rating;

              return (
                <Pressable
                  key={value}
                  hitSlop={10}
                  onPress={() => setRating(value)}
                >
                  <MaterialIcons
                    name={isSelected ? "star" : "star-border"}
                    size={42}
                    color={isSelected ? colors.accentOrange : colors.textMuted}
                  />
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.ratingLabel}>{ratingLabel}</Text>

          <Text style={[styles.label, styles.reviewLabel]}>Your review</Text>

          <View style={styles.textAreaWrap}>
            <TextInput
              value={review}
              onChangeText={(text) =>
                setReview(text.slice(0, MAX_REVIEW_LENGTH))
              }
              multiline
              textAlignVertical="top"
              placeholder="Share details about your experience..."
              placeholderTextColor={colors.textMuted}
              style={styles.textArea}
            />

            <Text style={styles.counter}>
              {review.length}/{MAX_REVIEW_LENGTH}
            </Text>
          </View>

          <Text style={[styles.label, styles.sectionGap]}>
            Add photos <Text style={styles.optional}>(optional)</Text>
          </Text>

          <View style={styles.photosRow}>
            {photos.map((photo) => (
              <View key={photo} style={styles.photoWrap}>
                <Image source={{ uri: photo }} style={styles.photo} />

                <Pressable
                  onPress={() => handleRemovePhoto(photo)}
                  style={styles.removePhotoButton}
                >
                  <Ionicons name="close" size={14} color={colors.textPrimary} />
                </Pressable>
              </View>
            ))}

            {photos.length < MAX_PHOTOS ? (
              <Pressable onPress={handlePickPhotos} style={styles.addPhotoBox}>
                <Ionicons
                  name="camera-outline"
                  size={26}
                  color={colors.primaryGreen}
                />
                <Text style={styles.addPhotoText}>Add photo</Text>
              </Pressable>
            ) : null}
          </View>

          <Text style={[styles.label, styles.sectionGap]}>
            What did you like? <Text style={styles.optional}>(optional)</Text>
          </Text>

          <View style={styles.tagsWrap}>
            {REVIEW_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);

              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[styles.tag, isSelected && styles.tagSelected]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected && styles.tagTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>

                  {isSelected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={15}
                      color={colors.primaryGreen}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <View style={{ opacity: canSubmit ? 1 : 0.5 }}>
            <AppButton
              title="Submit Review"
              onPress={canSubmit ? handleSubmit : undefined}
            />
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 0,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    height: 56,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  businessCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  businessImage: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryGreenSoft,
  },
  businessInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  businessMeta: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textSecondary,
  },
  visitRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  visitText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primaryGreen,
  },
  card: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  optional: {
    fontWeight: "500",
    color: colors.textMuted,
  },
  ratingRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  ratingLabel: {
    marginTop: spacing.xs,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryGreen,
  },
  reviewLabel: {
    marginTop: spacing.xl,
  },
  textAreaWrap: {
    marginTop: spacing.sm,
    minHeight: 132,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  textArea: {
    minHeight: 104,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  counter: {
    paddingRight: spacing.md,
    paddingBottom: spacing.sm,
    textAlign: "right",
    fontSize: 12,
    color: colors.textMuted,
  },
  sectionGap: {
    marginTop: spacing.xl,
  },
  photosRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  photoWrap: {
    width: 74,
    height: 74,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: radius.md,
    backgroundColor: colors.primaryGreenSoft,
  },
  removePhotoButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoBox: {
    width: 86,
    height: 74,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primaryGreenSoft,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  addPhotoText: {
    marginTop: spacing.xs,
    fontSize: 12,
    fontWeight: "600",
    color: colors.primaryGreen,
  },
  tagsWrap: {
    marginTop: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  tagSelected: {
    borderColor: colors.primaryGreenSoft,
    backgroundColor: colors.primaryGreenSoft,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tagTextSelected: {
    color: colors.primaryGreen,
  },
  recommendRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  recommendTextWrap: {
    flex: 1,
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  recommendSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
});
