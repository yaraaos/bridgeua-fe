import ReviewCard from "@/src/components/business/ReviewCard";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import { getMyReviews } from "@/src/features/reviews/services/review.service";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { PersonalProfileReview } from "@/src/types/profile";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

export default function ProfileReviewsScreen() {
  const { colors } = useAppTheme();
  const [reviews, setReviews] = useState<PersonalProfileReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="My Reviews"
        titleSubtitle="Reviews you have written"
        gradientColors={DISCOVERY_GRADIENT}
      />

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <AppLoader />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
            <ReviewCard review={item} variant="profile" />
          )}
          ListEmptyComponent={
            <AppEmptyState
              title="No reviews yet"
              description="Reviews you write will appear here."
            />
          }
        />
      )}
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
});
