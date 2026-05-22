import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { useNewsItem } from "@/src/features/news/hooks/useNews";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function NewsDetailScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { id } = useLocalSearchParams<{ id: string }>();
  const { newsItem, isLoading } = useNewsItem(id);

  if (isLoading || !newsItem) {
    return <AppLoader />;
  }

  const handlePrimaryCta = () => {
    if (newsItem.ctaType === "view_address") {
      router.push({
        pathname: "/business/[id]",
        params: {
          id: newsItem.businessId,
          section: "address",
        },
      });
      return;
    }

    if (newsItem.ctaType === "view_menu") {
      router.push({
        pathname: "/business/[id]",
        params: {
          id: newsItem.businessId,
          section: "menu",
        },
      });
      return;
    }

    router.push({
      pathname: "/business/[id]",
      params: {
        id: newsItem.businessId,
      },
    });
  };

  return (
    <AppScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: newsItem.imageUrl }} style={styles.image} />

          <Pressable style={styles.shareButton}>
            <Ionicons
              name="share-outline"
              size={22}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          {!!newsItem.categoryLabel && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>
                {newsItem.categoryLabel}
              </AppText>
            </View>
          )}

          <AppText style={styles.title}>{newsItem.title}</AppText>

          <AppText style={styles.time}>
            {new Date(newsItem.publishedAt).toLocaleDateString()}
          </AppText>

          <View style={styles.businessCard}>
            <AppText style={styles.businessName}>
              {newsItem.business?.name}
            </AppText>

            <AppText style={styles.businessMeta}>
              {newsItem.business?.category} · {newsItem.business?.location}
            </AppText>
          </View>

          <AppText style={styles.contentText}>{newsItem.content}</AppText>

          <View style={styles.actions}>
            <AppButton title={newsItem.ctaLabel} onPress={handlePrimaryCta} />
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    image: {
      width: "100%",
      height: 260,
    },

    shareButton: {
      position: "absolute",
      top: 60,
      right: 20,
      width: 42,
      height: 42,
      borderRadius: 999,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },

    content: {
      padding: 20,
      gap: 18,
    },

    badge: {
      alignSelf: "flex-start",
      backgroundColor: colors.primaryGreenSoft,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
    },

    badgeText: {
      color: colors.primaryGreenDark,
      fontWeight: "700",
      fontSize: 12,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    time: {
      fontSize: 13,
      color: colors.textMuted,
    },

    businessCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 4,
    },

    businessName: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    businessMeta: {
      fontSize: 13,
      color: colors.textSecondary,
    },

    contentText: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
    },

    actions: {
      paddingBottom: 40,
    },
  });
}
