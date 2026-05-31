import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { useNewsItem } from "@/src/features/news/hooks/useNews";
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

export default function NewsDetailScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { id } = useLocalSearchParams<{ id: string }>();
  const { newsItem, isLoading } = useNewsItem(id);

  if (isLoading || !newsItem) {
    return (
      <AppScreen style={styles.appScreen}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  const handleShare = async () => {
    await Share.share({
      title: newsItem.title,
      message: `${newsItem.title}\n\n${newsItem.description}`,
    });
  };

  const handlePrimaryCta = () => {
    router.push({
      pathname: "/business/[id]",
      params: {
        id: newsItem.businessId,
        section:
          newsItem.ctaType === "view_menu"
            ? "menu"
            : newsItem.ctaType === "view_address"
              ? "address"
              : undefined,
      },
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
          {newsItem.categoryLabel ?? "News"}
        </AppText>

        <AppText style={styles.title}>{newsItem.title}</AppText>
        {!!newsItem.subtitle && (
          <AppText style={styles.subtitle}>{newsItem.subtitle}</AppText>
        )}

        <AppText style={styles.time}>
          {new Date(newsItem.publishedAt).toLocaleDateString()}
        </AppText>

        <Image source={{ uri: newsItem.imageUrl }} style={styles.heroImage} />

        {!!newsItem.business && (
          <View style={styles.businessCard}>
            <Image
              source={{
                uri:
                  "image" in newsItem.business
                    ? newsItem.business.image
                    : newsItem.imageUrl,
              }}
              style={styles.businessImage}
            />

            <View style={styles.businessInfo}>
              <AppText style={styles.businessName} numberOfLines={1}>
                {newsItem.business.name}
              </AppText>

              <View style={styles.metaRow}>
                <Ionicons name="star" size={14} color={colors.accentOrange} />
                <AppText style={styles.metaText}>
                  {((newsItem.business as any)?.averageRating ?? (newsItem.business as any)?.rating ?? 0).toFixed(1)}
                </AppText>
                <AppText style={styles.dot}>•</AppText>
                <AppText style={styles.metaText} numberOfLines={1}>
                  {newsItem.business.category}
                </AppText>
              </View>

              <View style={styles.metaRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.textMuted}
                />
                <AppText style={styles.metaText} numberOfLines={1}>
                  {newsItem.business.location}
                </AppText>
              </View>
            </View>
          </View>
        )}

        <View style={styles.sectionCard}>
          <AppText style={styles.articleText}>{newsItem.content}</AppText>
        </View>

        <AppButton
          title={newsItem.ctaLabel}
          variant="primary"
          onPress={handlePrimaryCta}
        />
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
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      marginTop: 4,
    },
    time: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textMuted,
    },
    heroImage: {
      width: "100%",
      height: 210,
      borderRadius: 18,
    },
    businessCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    businessImage: {
      width: 58,
      height: 58,
      borderRadius: 14,
    },
    businessInfo: {
      flex: 1,
      gap: 4,
    },
    businessName: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      flexShrink: 1,
    },
    dot: {
      fontSize: 12,
      color: colors.textMuted,
    },
    sectionCard: {
      padding: 14,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    articleText: {
      fontSize: 15,
      lineHeight: 23,
      color: colors.textSecondary,
    },
  });
}
