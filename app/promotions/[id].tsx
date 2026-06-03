import { BusinessAboutSection } from "@/src/components/business";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { usePromotion } from "@/src/features/promotions/hooks/usePromotions";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";

export default function PromotionDetailScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { id } = useLocalSearchParams<{ id: string }>();
  const { promotion, isLoading } = usePromotion(id);

  if (isLoading || !promotion) {
    return (
      <AppScreen style={styles.appScreen}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  const businessAbout =
    promotion.business && "about" in promotion.business
      ? promotion.business.about
      : undefined;

  const offerDetails =
    typeof promotion.offerDetails === "string"
      ? JSON.parse(promotion.offerDetails)
      : (promotion.offerDetails ?? []);

  const validUntil = promotion.expiresAt ?? promotion.endsAt;

  const formattedValidUntil = validUntil
    ? new Date(validUntil).toLocaleDateString()
    : null;

  const handleShare = async () => {
    await Share.share({
      title: promotion.title,
      message: `${promotion.title}\n\n${promotion.description}`,
    });
  };

  return (
    <AppScreen style={styles.appScreen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>

          <Pressable style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={16} color={colors.white} />
          </Pressable>
        </View>

        <AppText style={styles.category}>
          {promotion.categoryLabel ?? "Promotions"}
        </AppText>

        <AppText style={styles.title}>{promotion.title}</AppText>
        {!!promotion.subtitle && (
          <AppText style={styles.subtitle}>{promotion.subtitle}</AppText>
        )}

        {!!promotion.description && (
          <AppText style={styles.description}>{promotion.description}</AppText>
        )}

        <Image source={{ uri: promotion.imageUrl }} style={styles.heroImage} />

        {(!!offerDetails.length || !!formattedValidUntil) && (
          <View style={styles.sectionCard}>
            <AppText style={styles.sectionTitle}>Offer details</AppText>

            {!!offerDetails.length &&
              offerDetails.map((detail: string) => (
                <AppText key={detail} style={styles.sectionText}>
                  {detail}
                </AppText>
              ))}

            {!!formattedValidUntil && (
              <View style={styles.validityRow}>
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={colors.textMuted}
                />
                <AppText style={styles.validityText}>
                  Valid until {formattedValidUntil}
                </AppText>
              </View>
            )}
          </View>
        )}

        {!!promotion.promoCode && (
          <View style={styles.sectionCard}>
            <AppText style={styles.sectionTitle}>Promo code</AppText>

            <View style={styles.promoCodeBox}>
              <AppText style={styles.promoCodeText}>
                {promotion.promoCode}
              </AppText>
            </View>

            {!!promotion.redemptionInstructions && (
              <AppText style={styles.sectionText}>
                {promotion.redemptionInstructions}
              </AppText>
            )}
          </View>
        )}

        {!!businessAbout && (
          <View style={styles.sectionCard}>
            <AppText style={styles.sectionTitle}>About the business</AppText>
            <BusinessAboutSection
              businessId={promotion.businessId}
              about={businessAbout}
            />
          </View>
        )}

        <View style={styles.actions}>
          <AppButton
            title="Book Now"
            variant="accent"
            onPress={() =>
              router.push({
                pathname: "/bookings/choose-service",
                params: {
                  businessId: promotion.businessId,
                  promotionId: promotion.id,
                  promoCode: promotion.promoCode,
                  discountLabel: promotion.discountLabel ?? "",
                },
              })
            }
          />

          <AppButton
            title="View Business"
            onPress={() =>
              router.push({
                pathname: "/business/[id]",
                params: { id: promotion.businessId },
              })
            }
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    appScreen: {
      padding: 0,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 40,
      gap: 16,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    shareButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.accentOrange,
      alignItems: "center",
      justifyContent: "center",
    },
    category: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
    },
    title: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    description: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      marginTop: 4,
    },
    heroImage: {
      width: "100%",
      height: 210,
      borderRadius: 18,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    sectionCard: {
      padding: 14,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    sectionText: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
    },
    validityRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
    },

    validityText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textMuted,
    },
    actions: {
      gap: 12,
      marginTop: 2,
    },
    promoCodeBox: {
      alignSelf: "flex-start",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.accentOrangeSoft,
      borderWidth: 1,
      borderColor: colors.accentOrange,
    },

    promoCodeText: {
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: 1,
      color: colors.accentOrange,
    },
  });
}
