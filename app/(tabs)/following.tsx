import { AccountTypeSwitch } from "@/src/components/auth";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import FollowingFeedCard from "@/src/components/following/FollowingFeedCard";
import OwnerNewsEditor from "@/src/components/news/OwnerNewsEditor/OwnerNewsEditor";
import OwnerPromotionEditor from "@/src/components/promotions/OwnerPromotionEditor/OwnerPromotionEditor";
import AppAddCard from "@/src/components/ui/AppAddCard/AppAddCard";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { AppColors } from "@/src/constants/colors";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import {
  DEFAULT_LOCATION_OPTIONS,
  LocationOption,
} from "@/src/constants/locations";
import { useFollowingFeed } from "@/src/features/following";
import type { FollowingFeedCardItem } from "@/src/features/following/types/following.types";
import type { NewsDraft, NewsItem } from "@/src/features/news/types/news.types";
import type {
  Promotion,
  PromotionDraft,
} from "@/src/features/promotions/types/promotion.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFollowingStore } from "@/src/store";
import { useAuthStore } from "@/src/store/auth.store";
import { useFilterStore } from "@/src/store/filter.store";
import { useFollowingLocationStore } from "@/src/store/following-location.store";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

type FeedListItem =
  | {
      type: "add-promo";
      id: "add-promo";
    }
  | {
      type: "add-news";
      id: "add-news";
    }
  | {
      type: "feed-item";
      id: string;
      item: FollowingFeedCardItem;
      isOwnerPromotion?: boolean;
      isOwnerNews?: boolean;
    };

const BUSINESS_ID = "1";

const createPromotionFromDraft = (
  draft: PromotionDraft,
  status: "draft" | "published" | "unpublished",
): Promotion => {
  return {
    ...draft,
    id: draft.id || `${Date.now()}`,
    businessId: draft.businessId || BUSINESS_ID,
    status,
    isActive: status === "published",
  } as Promotion;
};

const createNewsFromDraft = (
  draft: NewsDraft,
  status: "draft" | "published" | "unpublished",
): NewsItem => {
  return {
    ...draft,
    id: draft.id || `${Date.now()}`,
    businessId: draft.businessId || BUSINESS_ID,
    publishedAt: draft.publishedAt || new Date().toISOString(),
    status,
    isActive: status === "published",
  };
};

export default function FollowingScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  const isBusinessAccount = user?.accountType === "business";

  const params = useLocalSearchParams<{
    tab?: string;
    action?: string;
  }>();

  const {
    label: selectedLocationLabel,
    setManualLocation,
    setNearbyLocation,
    setPermissionStatus,
  } = useFollowingLocationStore();

  const { category, sort, cuisines, rating, distance, customDistance } =
    useFilterStore((state) => state.followingFilters);

  const [visibleBusinessIds, setVisibleBusinessIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [ownerPromotions, setOwnerPromotions] = useState<Promotion[]>([]);
  const [draftPromotion, setDraftPromotion] = useState<PromotionDraft | null>(
    null,
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [ownerNews, setOwnerNews] = useState<NewsItem[]>([]);
  const [draftNews, setDraftNews] = useState<NewsDraft | null>(null);
  const [isNewsEditorOpen, setIsNewsEditorOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (category) count += 1;
    if (sort && sort !== "relevance") count += 1;
    if (cuisines.length > 0) count += cuisines.length;
    if (rating) count += 1;
    if (distance) count += 1;
    if (distance === "custom" && customDistance) count += 1;

    return count;
  }, [category, sort, cuisines, rating, distance, customDistance]);

  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    items,
    isLoading,
    isEmpty,
    hasFollowedBusinesses,
  } = useFollowingFeed({ visibleBusinessIds });

  const shouldShowOwnerPromoTools =
    isBusinessAccount && activeTab === "promotion";

  const shouldShowOwnerNewsTools = isBusinessAccount && activeTab === "news";

  const shouldShowOwnerTools =
    shouldShowOwnerPromoTools || shouldShowOwnerNewsTools;

  const createEmptyDraft = (): PromotionDraft => ({
    id: "",
    businessId: BUSINESS_ID,
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    categoryLabel: "Promotion",
    startsAt: "",
    expiresAt: "",
    endsAt: "",
    promoCode: "",
    discountLabel: "",
    redemptionInstructions: "",
    offerDetails: [],
    terms: [],
    ctaType: "view_business",
    ctaLabel: "View",
    status: "draft",
  });

  const createEmptyNewsDraft = (): NewsDraft => ({
    id: "",
    businessId: BUSINESS_ID,
    title: "",
    description: "",
    content: "",
    imageUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e",
    categoryLabel: "News",
    publishedAt: "",
    ctaType: "view_business",
    ctaLabel: "View Business",
    status: "draft",
  });

  const closeEditor = () => {
    setIsEditorOpen(false);
    setDraftPromotion(null);
  };

  const closeNewsEditor = () => {
    setIsNewsEditorOpen(false);
    setDraftNews(null);
  };

  const upsertOwnerPromotion = (promotion: Promotion) => {
    setOwnerPromotions((prev) => {
      const exists = prev.some((item) => item.id === promotion.id);

      if (exists) {
        return prev.map((item) =>
          item.id === promotion.id ? promotion : item,
        );
      }

      return [promotion, ...prev];
    });
  };

  const upsertOwnerNews = (newsItem: NewsItem) => {
    setOwnerNews((prev) => {
      const exists = prev.some((item) => item.id === newsItem.id);

      if (exists) {
        return prev.map((item) => (item.id === newsItem.id ? newsItem : item));
      }

      return [newsItem, ...prev];
    });
  };

  const handleOpenCreate = () => {
    setDraftPromotion(createEmptyDraft());
    setIsEditorOpen(true);
  };

  useEffect(() => {
    if (params.tab === "promotion") {
      setActiveTab("promotion");
    }

    if (params.tab === "news") {
      setActiveTab("news");
    }

    if (params.action === "create" && params.tab === "promotion") {
      handleOpenCreate();
    }

    if (params.action === "create" && params.tab === "news") {
      handleOpenCreateNews();
    }
  }, [params.tab, params.action]);

  const handleOpenCreateNews = () => {
    setDraftNews(createEmptyNewsDraft());
    setIsNewsEditorOpen(true);
  };

  const openOwnerPromotionEdit = (promotionId?: string) => {
    if (!promotionId) return;

    const promotion = ownerPromotions.find((item) => item.id === promotionId);

    if (!promotion) return;

    setDraftPromotion({
      id: promotion.id,
      businessId: promotion.businessId,
      title: promotion.title,
      subtitle: promotion.subtitle,
      description: promotion.description,
      imageUrl: promotion.imageUrl,
      categoryLabel: promotion.categoryLabel,
      startsAt: promotion.startsAt,
      expiresAt: promotion.expiresAt,
      endsAt: promotion.endsAt,
      promoCode: promotion.promoCode,
      discountLabel: promotion.discountLabel,
      redemptionType: promotion.redemptionType,
      redemptionInstructions: promotion.redemptionInstructions,
      offerDetails: promotion.offerDetails,
      terms: promotion.terms,
      ctaType: promotion.ctaType,
      ctaLabel: promotion.ctaLabel,
      status: promotion.status ?? "draft",
    });

    setIsEditorOpen(true);
  };

  const openOwnerNewsEdit = (newsId?: string) => {
    if (!newsId) return;

    const newsItem = ownerNews.find((item) => item.id === newsId);

    if (!newsItem) return;

    setDraftNews({
      id: newsItem.id,
      businessId: newsItem.businessId,
      title: newsItem.title,
      description: newsItem.description,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl,
      categoryLabel: newsItem.categoryLabel,
      publishedAt: newsItem.publishedAt,
      ctaType: newsItem.ctaType,
      ctaLabel: newsItem.ctaLabel,
      status: newsItem.status ?? "draft",
    });

    setIsNewsEditorOpen(true);
  };

  const handleSaveDraft = () => {
    if (!draftPromotion) return;

    const promotion = createPromotionFromDraft(draftPromotion, "draft");

    upsertOwnerPromotion(promotion);
    closeEditor();
  };

  const handlePublish = () => {
    if (!draftPromotion) return;

    const promotion = createPromotionFromDraft(draftPromotion, "published");

    upsertOwnerPromotion(promotion);
    closeEditor();
  };

  const handleUnpublish = () => {
    if (!draftPromotion) return;

    const promotion = createPromotionFromDraft(draftPromotion, "unpublished");

    upsertOwnerPromotion(promotion);
    closeEditor();
  };

  const handleDeletePromotion = () => {
    if (!draftPromotion?.id) return;

    setOwnerPromotions((prev) =>
      prev.filter((item) => item.id !== draftPromotion.id),
    );

    closeEditor();
  };

  const handleSaveNewsDraft = () => {
    if (!draftNews) return;

    const newsItem = createNewsFromDraft(draftNews, "draft");

    upsertOwnerNews(newsItem);
    closeNewsEditor();
  };

  const handlePublishNews = () => {
    if (!draftNews) return;

    const newsItem = createNewsFromDraft(draftNews, "published");

    upsertOwnerNews(newsItem);
    closeNewsEditor();
  };

  const handleUnpublishNews = () => {
    if (!draftNews) return;

    const newsItem = createNewsFromDraft(draftNews, "unpublished");

    upsertOwnerNews(newsItem);
    closeNewsEditor();
  };

  const handleDeleteNews = () => {
    if (!draftNews?.id) return;

    setOwnerNews((prev) => prev.filter((item) => item.id !== draftNews.id));

    closeNewsEditor();
  };

  const ownerFeedItems = useMemo<FollowingFeedCardItem[]>(() => {
    return ownerPromotions.map((promotion) => ({
      id: `owner-promotion-${promotion.id}`,
      businessId: promotion.businessId,
      type: "promotion",
      promotionId: promotion.id,
      status: promotion.status,
      title: promotion.title || "Untitled promotion",
      description: promotion.description || "No description added yet.",
      createdAt: new Date().toISOString(),
      businessName: "Your Business",
      businessCategory: "Business",
      businessLocation: "California, USA",
      businessImage: promotion.imageUrl || "https://placehold.co/600x400",
      businessRating: 0,
      businessDistanceKm: 0,
      businessPriceLevel: undefined,
      distanceKm: 0,
      priceLevel: undefined,
      recommendedByPreview: [],
      recommendedByCount: 0,
    }));
  }, [ownerPromotions]);

  const ownerNewsFeedItems = useMemo<FollowingFeedCardItem[]>(() => {
    return ownerNews.map((newsItem) => ({
      id: `owner-news-${newsItem.id}`,
      businessId: newsItem.businessId,
      type: "news",
      newsId: newsItem.id,
      status: newsItem.status,
      title: newsItem.title || "Untitled news",
      description: newsItem.description || "No description added yet.",
      createdAt: newsItem.publishedAt || new Date().toISOString(),
      businessName: "Your Business",
      businessCategory: "Business",
      businessLocation: "California, USA",
      businessImage: newsItem.imageUrl || "https://placehold.co/600x400",
      businessRating: 0,
      businessDistanceKm: 0,
      businessPriceLevel: undefined,
      distanceKm: 0,
      priceLevel: undefined,
      recommendedByPreview: [],
      recommendedByCount: 0,
    }));
  }, [ownerNews]);

  const listData = useMemo<FeedListItem[]>(() => {
    const feedItems: FeedListItem[] = items.map((item) => ({
      type: "feed-item",
      id: item.id,
      item,
      isOwnerPromotion: false,
      isOwnerNews: false,
    }));

    if (shouldShowOwnerPromoTools) {
      const ownerItems: FeedListItem[] = ownerFeedItems.map((item) => ({
        type: "feed-item",
        id: item.id,
        item,
        isOwnerPromotion: true,
        isOwnerNews: false,
      }));

      return [
        { type: "add-promo", id: "add-promo" },
        ...ownerItems,
        ...feedItems,
      ];
    }

    if (shouldShowOwnerNewsTools) {
      const ownerItems: FeedListItem[] = ownerNewsFeedItems.map((item) => ({
        type: "feed-item",
        id: item.id,
        item,
        isOwnerPromotion: false,
        isOwnerNews: true,
      }));

      return [
        { type: "add-news", id: "add-news" },
        ...ownerItems,
        ...feedItems,
      ];
    }

    return feedItems;
  }, [
    items,
    ownerFeedItems,
    ownerNewsFeedItems,
    shouldShowOwnerPromoTools,
    shouldShowOwnerNewsTools,
  ]);

  const handleSelectLocationOption = (option: LocationOption) => {
    setManualLocation({
      label: option.label,
      value: option.value,
    });
  };

  const handleRequestNearby = () => {
    Alert.alert(
      "Use your location?",
      "Allow location access to see followed businesses near you.",
      [
        {
          text: "Not now",
          style: "cancel",
          onPress: () => setPermissionStatus("denied"),
        },
        {
          text: "Allow",
          onPress: () => {
            setPermissionStatus("granted");
            setNearbyLocation({
              label: "Near you",
              value: "nearby",
              latitude: 34.0549,
              longitude: -118.2426,
            });
          },
        },
      ],
    );
  };

  const syncVisibleBusinessIds = useCallback(() => {
    const ids = useFollowingStore.getState().followedBusinessIds.map(String);

    setVisibleBusinessIds(ids);
  }, []);

  useFocusEffect(
    useCallback(() => {
      syncVisibleBusinessIds();
    }, [syncVisibleBusinessIds]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    syncVisibleBusinessIds();
    setRefreshing(false);
  };

  const handleMapPress = () => {
    router.push("/(tabs)/map");
  };

  const handleFilterPress = () => {
    router.push({
      pathname: "/modal/filter",
      params: { scope: "following" },
    });
  };

  const handleRegisterPress = () => {
    router.push({
      pathname: "/auth/sign-in",
      params: {
        source: "guest_promotions_tab",
        action: "promotion",
      },
    });
  };

  if (isGuest) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        <ScreenHeader
          title="News & Promos"
          titleSubtitle="Updates from followed businesses"
          gradientColors={DISCOVERY_GRADIENT}
        />

        <View style={styles.switchWrap}>
          <AccountTypeSwitch
            options={[
              { label: "Promotions", value: "promotion" },
              { label: "News", value: "news" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </View>

        <AppEmptyState
          title="Register to see promotions and news"
          description="Register and follow businesses to see promotions and news from places you trust."
          actionLabel="Register to BridgeUA"
          onPressAction={handleRegisterPress}
        />
      </AppScreen>
    );
  }

  if (isLoading) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        <ScreenHeader
          title="News & Promos"
          titleSubtitle="Updates from followed businesses"
          subtitleLabel="Location"
          subtitleValue={selectedLocationLabel}
          showSubtitleChevron
          locationOptions={DEFAULT_LOCATION_OPTIONS}
          onSelectLocationOption={handleSelectLocationOption}
          onRequestNearby={handleRequestNearby}
          searchPlaceholder="Search here..."
          searchValue={searchQuery}
          onSearchChangeText={setSearchQuery}
          actions={["map", "filter"]}
          onPressMap={handleMapPress}
          onPressFilter={handleFilterPress}
          gradientColors={DISCOVERY_GRADIENT}
          activeFilterCount={activeFilterCount}
        />

        <View style={styles.switchWrap}>
          <AccountTypeSwitch
            options={[
              { label: "Promotions", value: "promotion" },
              { label: "News", value: "news" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </View>

        <View style={styles.loaderWrap}>
          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="News & Promos"
        titleSubtitle="Updates from followed businesses"
        subtitleLabel="Location"
        subtitleValue={selectedLocationLabel}
        showSubtitleChevron
        locationOptions={DEFAULT_LOCATION_OPTIONS}
        onSelectLocationOption={handleSelectLocationOption}
        onRequestNearby={handleRequestNearby}
        showSearch
        searchPlaceholder="Search here..."
        searchValue={searchQuery}
        onSearchChangeText={setSearchQuery}
        actions={["map", "filter"]}
        onPressMap={handleMapPress}
        onPressFilter={handleFilterPress}
        gradientColors={DISCOVERY_GRADIENT}
        activeFilterCount={activeFilterCount}
      />

      <View style={styles.switchWrap}>
        <AccountTypeSwitch
          options={[
            { label: "Promotions", value: "promotion" },
            { label: "News", value: "news" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {!hasFollowedBusinesses && !shouldShowOwnerTools ? (
        <AppEmptyState
          title="You are not following anyone yet"
          description="Follow businesses to see their promotions and news here."
        />
      ) : isEmpty && !shouldShowOwnerTools ? (
        <AppEmptyState
          title={`No ${
            activeTab === "promotion" ? "promotions" : "news"
          } found`}
          description={
            activeTab === "promotion"
              ? "There are no promotions at this time. Check the News!"
              : "There is no news at this time. Check the Promotions!"
          }
        />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          renderItem={({ item }) => {
            if (item.type === "add-promo") {
              return (
                <AppAddCard
                  label="Create promotion"
                  onPress={handleOpenCreate}
                />
              );
            }

            if (item.type === "add-news") {
              return (
                <AppAddCard
                  label="Create news"
                  onPress={handleOpenCreateNews}
                />
              );
            }

            return (
              <FollowingFeedCard
                item={item.item}
                onPress={
                  item.isOwnerPromotion
                    ? () => openOwnerPromotionEdit(item.item.promotionId)
                    : item.isOwnerNews
                      ? () => openOwnerNewsEdit(item.item.newsId)
                      : undefined
                }
              />
            );
          }}
        />
      )}

      <OwnerPromotionEditor
        visible={isEditorOpen}
        draft={draftPromotion ?? createEmptyDraft()}
        onChangeDraft={setDraftPromotion}
        onCancel={closeEditor}
        onSave={handleSaveDraft}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onDelete={handleDeletePromotion}
      />

      <OwnerNewsEditor
        visible={isNewsEditorOpen}
        draft={draftNews ?? createEmptyNewsDraft()}
        onChangeDraft={setDraftNews}
        onCancel={closeNewsEditor}
        onSave={handleSaveNewsDraft}
        onPublish={handlePublishNews}
        onUnpublish={handleUnpublishNews}
        onDelete={handleDeleteNews}
      />
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
    },

    switchWrap: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
    },

    loaderWrap: {
      flex: 1,
      justifyContent: "center",
    },

    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 12,
    },
  });
}
