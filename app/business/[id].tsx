import {
    BusinessBookingCard,
    BusinessDetailsTabs,
    BusinessHeader,
    BusinessHeroGallery,
    BusinessOverviewCard,
    BusinessReviewsList,
    BusinessServicesList,
    BusinessTopReviews,
    type BusinessDetailsTab,
} from "@/src/components/business";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { colors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function BusinessDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { business, isLoading } = useBusinessDetails(id);

  const [activeTab, setActiveTab] = useState<BusinessDetailsTab>("overview");

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
        <Text>Business not found</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll withTopInset style={styles.container}>
      <BusinessHeader business={business} />
      <BusinessHeroGallery
        images={business.images}
        onPressImage={(imageId) => console.log("Open image", imageId)}
        onPressViewAll={() => console.log("Open all photos")}
      />
      <BusinessDetailsTabs activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === "overview" ? (
        <>
          <BusinessOverviewCard business={business} />
          <BusinessBookingCard businessId={business.id} />
          <BusinessTopReviews
            reviews={business.topReviews}
            reviewCount={business.reviewCount}
            onPressViewAll={() => setActiveTab("reviews")}
          />
        </>
      ) : null}

      {activeTab === "services" ? (
        <BusinessServicesList
          services={business.services}
          onPressService={(serviceId) =>
            router.push({
              pathname: "/bookings/choose-service",
              params: {
                businessId: business.id,
                serviceId,
              },
            })
          }
        />
      ) : null}

      {activeTab === "reviews" ? (
        <BusinessReviewsList
          reviews={business.topReviews}
          reviewCount={business.reviewCount}
        />
      ) : null}

      <View style={styles.placeholderSection}>
        <Text style={styles.sectionTitle}>Business details content next</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  placeholderSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
