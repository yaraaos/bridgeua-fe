import ReviewCard from "@/src/components/business/ReviewCard";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { getReviewById } from "@/src/features/reviews/services/review.service";
import type { Review } from "@/src/features/reviews/types/review.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ReviewThreadScreen() {
  const { colors } = useAppTheme();
  const { reviewId } = useLocalSearchParams<{ reviewId: string }>();

  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReview = async () => {
      if (!reviewId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const data = await getReviewById(reviewId);

      setReview(data);
      setIsLoading(false);
    };

    loadReview();
  }, [reviewId]);

  return (
    <AppScreen style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>

        <View style={styles.headerTextWrap}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Review
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Thread
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <AppLoader />
        </View>
      ) : review ? (
        <View style={styles.content}>
          <ReviewCard review={review} />
        </View>
      ) : (
        <AppEmptyState
          title="Review not found"
          description="This review may have been removed."
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
  },
});
