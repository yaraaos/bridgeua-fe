import FollowButton from "@/src/components/business/FollowButton/FollowButton";
import AppText from "@/src/components/ui/AppText/AppText";
import type { FollowingFeedCardItem } from "@/src/features/following/types/following.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAuthStore } from "@/src/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { createStyles } from "./FollowingFeedCard.styles";

type FollowingFeedCardProps = {
  item: FollowingFeedCardItem;
  onPress?: () => void;
  isOwnerPromotion?: boolean;
  isOwnerNews?: boolean;
  onFeaturePromotion?: () => void;
};

export default function FollowingFeedCard({
  item,
  onPress,
  isOwnerPromotion,
  isOwnerNews,
  onFeaturePromotion,
}: FollowingFeedCardProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const accountType = useAuthStore((state) => state.user?.accountType);
  const isBusinessOwner = accountType === "business";
  const [showMenu, setShowMenu] = useState(false);

  const extraStyles = useMemo(
    () =>
      StyleSheet.create({
        menuWrapper: {
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 20,
          alignItems: "flex-end",
        },
        menuButton: {
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: 999,
          padding: 4,
        },
        menuButtonActive: {
          backgroundColor: colors.white,
        },
        inlineMenu: {
          marginTop: 4,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.white,
          overflow: "hidden",
          minWidth: 200,
        },
        inlineMenuRow: {
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        },
        inlineMenuText: {
          fontSize: 14,
          fontWeight: "700",
          color: colors.primaryGreen,
        },
        titleRowSpaced: {
          justifyContent: "space-between",
          alignItems: "center",
        },
      }),
    [colors],
  );

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    router.push({
      pathname: item.type === "promotion" ? "/promotions/[id]" : "/news/[id]",
      params: {
        id:
          item.type === "promotion"
            ? (item.promotionId ?? item.id)
            : (item.newsId ?? item.id),
      },
    });
  };

  const statusLabel =
    item.status === "draft"
      ? "Draft"
      : item.status === "unpublished"
        ? "Unpublished"
        : item.status === "published"
          ? "Published"
          : null;

  return (
    <Pressable style={styles.feedCard} onPress={handlePress}>
      {isOwnerPromotion && (
        <View style={extraStyles.menuWrapper}>
          <Pressable
            style={[
              extraStyles.menuButton,
              showMenu && extraStyles.menuButtonActive,
            ]}
            onPress={() => setShowMenu((v) => !v)}
            hitSlop={8}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={16}
              color={showMenu ? colors.primaryGreen : colors.white}
            />
          </Pressable>

          {showMenu && (
            <View style={extraStyles.inlineMenu}>
              <Pressable
                style={extraStyles.inlineMenuRow}
                onPress={() => {
                  setShowMenu(false);
                  onFeaturePromotion?.();
                }}
              >
                <Ionicons
                  name="star-outline"
                  size={16}
                  color={colors.primaryGreen}
                />
                <AppText style={extraStyles.inlineMenuText}>
                  Add to home promo banner
                </AppText>
              </Pressable>
            </View>
          )}
        </View>
      )}

      <View style={styles.feedHeader}>
        <View style={styles.feedContentRow}>
          <View style={styles.feedIcon}>
            <Ionicons
              name={
                item.type === "promotion"
                  ? "pricetag-outline"
                  : "newspaper-outline"
              }
              size={18}
              color={colors.primaryGreen}
            />
          </View>

          <View
            style={[
              styles.feedTextWrap,
              isOwnerPromotion && { paddingRight: 28 },
            ]}
          >
            <View
              style={[
                styles.titleRow,
                isOwnerPromotion && extraStyles.titleRowSpaced,
              ]}
            >
              <Text style={styles.feedTitle} numberOfLines={2}>
                {item.title}
              </Text>

              {(isOwnerPromotion || isOwnerNews) && statusLabel ? (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{statusLabel}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.feedDescription} numberOfLines={3}>
              {item.description}
            </Text>
          </View>
        </View>

        {!isBusinessOwner && (
          <FollowButton
            businessId={String(item.businessId)}
            size="icon"
            variant="soft"
          />
        )}
      </View>

      <View style={styles.feedBody}>
        <Image
          source={{ uri: item.businessImage }}
          style={styles.businessImage}
        />

        <View style={styles.businessInfo}>
          <Text style={styles.businessName} numberOfLines={1}>
            {item.businessName}
          </Text>

          <View style={styles.businessMetaRow}>
            <Ionicons name="star" size={12} color={colors.accentOrange} />

            <Text style={styles.ratingText}>
              {item.businessRating.toFixed(1)}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText} numberOfLines={1}>
              {item.businessCategory}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText} numberOfLines={1}>
              {item.businessLocation}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
