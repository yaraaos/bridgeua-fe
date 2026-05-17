import { RecommendedByCard } from "@/src/components/business";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { AppColors } from "@/src/constants/colors";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function RecommendedByScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { businessId } = useLocalSearchParams<{ businessId?: string }>();
  const { business, isLoading } = useBusinessDetails(businessId);

  const recommendations = business?.about?.recommendedBy ?? [];

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        variant="business"
        title="Recommended by"
        gradientColors={DISCOVERY_GRADIENT}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : recommendations.length < 1 ? (
        <View style={styles.emptyWrap}>
          <AppEmptyState
            title="No recommendations yet"
            description="Businesses that recommend this place will appear here."
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            {recommendations.map((recommendation, index) => (
              <RecommendedByCard
                key={recommendation.id}
                recommendation={recommendation}
                isBordered={index !== 0}
                onPress={() =>
                  router.push({
                    pathname: "/business/[id]",
                    params: { id: recommendation.businessId },
                  })
                }
              />
            ))}
          </View>
        </ScrollView>
      )}
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: colors.background,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyWrap: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    card: {
      paddingHorizontal: spacing.lg,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
}
