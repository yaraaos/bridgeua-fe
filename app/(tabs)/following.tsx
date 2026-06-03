import { AccountTypeSwitch } from "@/src/components/auth";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import FollowingFeedCard from "@/src/components/following/FollowingFeedCard";
import OwnerNewsEditor from "@/src/components/news/OwnerNewsEditor/OwnerNewsEditor";
import OwnerPromotionEditor from "@/src/components/promotions/OwnerPromotionEditor/OwnerPromotionEditor";
import AppAddCard from "@/src/components/ui/AppAddCard/AppAddCard";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { PROMO_CATEGORY_LABEL } from "@/src/constants/categories";
import { AppColors } from "@/src/constants/colors";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import { LocationOption } from "@/src/constants/locations";
import { getBusinessStates } from "@/src/features/businesses/services/business.service";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import { useFollowingFeed } from "@/src/features/following";
import type { FollowingFeedCardItem } from "@/src/features/following/types/following.types";
import type { NewsDraft, NewsItem } from "@/src/features/news/types/news.types";
import type {
  Promotion,
  PromotionDraft,
} from "@/src/features/promotions/types/promotion.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
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

const createPromotionFromDraft = (
  draft: PromotionDraft,
  status: "draft" | "published" | "unpublished",
): Promotion => {
  return {
    ...draft,
    id: draft.id || `${Date.now()}`,
    businessId: draft.businessId,
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
    businessId: draft.businessId,
    publishedAt: draft.publishedAt || new Date().toISOString(),
    status,
    isActive: status === "published",
  };
};

export default function FollowingScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { business: myBusiness } = useMyBusinessProfile();
  const businessId = String(myBusiness?.id ?? "");

  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  const isBusinessAccount = user?.accountType === "business";

  const params = useLocalSearchParams<{
    tab?: string;
    action?: string;
  }>();

  const {
    label: selectedLocationLabel,
    state: locationState,
    setManualLocation,
    setNearbyLocation,
    setPermissionStatus,
  } = useFollowingLocationStore();

  const { category, sort, cuisines, rating, distance } =
    useFilterStore((state) => state.followingFilters);

  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([
    { label: "All locations", value: "all", type: "manual", state: undefined },
    { label: "See nearby", value: "nearby", type: "nearby" },
  ]);

  useEffect(() => {
    getBusinessStates().then((states) => {
      const stateOptions: LocationOption[] = states.map((s) => ({
        label: `${s}, USA`,
        value: s.toLowerCase().replace(/\s+/g, '-') + '-usa',
        type: 'manual',
        state: s,
      }));
      setLocationOptions([
        { label: "All locations", value: "all", type: "manual", state: undefined },
        { label: "See nearby", value: "nearby", type: "nearby" },
        ...stateOptions,
      ]);
    }).catch(() => {});
  }, []);

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
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishingNews, setIsPublishingNews] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (category) count += 1;
    if (sort && sort !== "relevance") count += 1;
    if (cuisines.length > 0) count += cuisines.length;
    if (rating) count += 1;
    if (distance) count += 1;

    return count;
  }, [category, sort, cuisines, rating, distance]);

  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    items,
    isLoading,
    isEmpty,
    hasFollowedBusinesses,
  } = useFollowingFeed({ visibleBusinessIds, state: locationState });

  const shouldShowOwnerPromoTools =
    isBusinessAccount && activeTab === "promotion";

  const shouldShowOwnerNewsTools = isBusinessAccount && activeTab === "news";

  const shouldShowOwnerTools =
    shouldShowOwnerPromoTools || shouldShowOwnerNewsTools;

  const createEmptyDraft = (): PromotionDraft => ({
    id: "",
    businessId: businessId,
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    categoryLabel: "Promotion",
    startsAt: "",
    expiresAt: "",
    endsAt: "",
    promoCode: "",
    discountLabel: "",
    redemptionInstructions: "",
    offerDetails: [],
    terms: [],
    ctaType: undefined,
    ctaLabel: undefined,
    status: "draft",
  });

  const createEmptyNewsDraft = (): NewsDraft => ({
    id: "",
    businessId: businessId,
    title: "",
    subtitle: "",
    description: "",
    content: "",
    imageUrl: "",
    categoryLabel: "News",
    publishedAt: "",
    ctaType: undefined,
    ctaLabel: undefined,
    status: "draft",
  });

  const hasPromotionDraftContent = (draft: PromotionDraft): boolean =>
    Boolean(
      draft.title?.trim() ||
      draft.subtitle?.trim() ||
      draft.description?.trim() ||
      draft.imageUrl?.trim() ||
      draft.promoCode?.trim() ||
      draft.discountLabel?.trim() ||
      draft.ctaType ||
      draft.ctaLabel?.trim() ||
      draft.redemptionInstructions?.trim() ||
      draft.offerDetails?.some((item) => item.trim()) ||
      draft.terms?.some((item) => item.trim()) ||
      draft.startsAt ||
      draft.expiresAt ||
      draft.endsAt,
    );

  const hasNewsDraftContent = (draft: NewsDraft): boolean =>
    Boolean(
      draft.title?.trim() ||
      draft.subtitle?.trim() ||
      draft.description?.trim() ||
      draft.content?.trim() ||
      draft.imageUrl?.trim() ||
      draft.ctaType ||
      draft.ctaLabel?.trim() ||
      draft.publishedAt,
    );

  const closeEditor = (force = false) => {
    if (!force && draftPromotion && hasPromotionDraftContent(draftPromotion)) {
      Alert.alert(
        "Unsaved changes",
        "You have unsaved changes. What would you like to do?",
        [
          { text: "Keep editing", style: "cancel" },
          {
            text: "Save draft",
            onPress: () => void handleSaveDraft(),
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => closeEditor(true),
          },
        ],
      );
      return;
    }
    setIsEditorOpen(false);
    setDraftPromotion(null);
  };

  const closeNewsEditor = (force = false) => {
    if (!force && draftNews && hasNewsDraftContent(draftNews)) {
      Alert.alert(
        "Unsaved changes",
        "You have unsaved changes. What would you like to do?",
        [
          { text: "Keep editing", style: "cancel" },
          {
            text: "Save draft",
            onPress: () => void handleSaveNewsDraft(),
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => closeNewsEditor(true),
          },
        ],
      );
      return;
    }
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
      router.replace("/(tabs)/following");
    }

    if (params.action === "create" && params.tab === "news") {
      handleOpenCreateNews();
      router.replace("/(tabs)/following");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      offerDetails:
        typeof promotion.offerDetails === "string"
          ? JSON.parse(promotion.offerDetails)
          : (promotion.offerDetails ?? []),
      terms:
        typeof promotion.terms === "string"
          ? JSON.parse(promotion.terms)
          : (promotion.terms ?? []),
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
      subtitle: newsItem.subtitle,
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

  const handleSaveDraft = async () => {
    if (!draftPromotion) return;
    try {
      const formData = new FormData();
      const draftWithStatus = { ...draftPromotion, status: "draft" };
      Object.entries(draftWithStatus).forEach(([key, value]) => {
        if (key === "id" && !value) return;
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "string" && value.startsWith("file://")) {
          formData.append("image", {
            uri: value,
            name: "promo.jpg",
            type: "image/jpeg",
          } as any);
        } else {
          formData.append(key, String(value));
        }
      });
      if (draftPromotion.id) {
        await apiClient.patch(`/api/promotions/${draftPromotion.id}`, formData);
      } else {
        await apiClient.post("/api/promotions", formData);
      }
      const res = await apiClient.get<{ data: any[] }>("/api/promotions/mine");
      const data = (res.data.data ?? res.data) as any[];
      setOwnerPromotions(
        data.map((p) => ({
          ...p,
          imageUrl: p.imageUrl
            ? p.imageUrl.startsWith("http")
              ? p.imageUrl
              : `${API_BASE_URL}${p.imageUrl}`
            : p.imageUrl,
        })) as Promotion[],
      );
      closeEditor(true);
    } catch {
      Alert.alert("Error", "Failed to save promotion. Please try again.");
    }
  };

  const handlePublish = async () => {
    if (!draftPromotion || isPublishing) return;
    setIsPublishing(true);
    try {
      const formData = new FormData();
      Object.entries(draftPromotion).forEach(([key, value]) => {
        if (key === "id" && !value) return;
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "string" && value.startsWith("file://")) {
          formData.append("image", {
            uri: value,
            name: "promo.jpg",
            type: "image/jpeg",
          } as any);
        } else {
          formData.append(key, String(value));
        }
      });
      let savedId = draftPromotion.id;
      if (savedId) {
        await apiClient.patch(`/api/promotions/${savedId}`, formData);
      } else {
        const createRes = await apiClient.post<any>(
          "/api/promotions",
          formData,
        );
        savedId = createRes.data.data?.id ?? createRes.data.id;
      }
      await apiClient.patch(`/api/promotions/${savedId}/publish`);
      const res = await apiClient.get<{ data: any[] }>("/api/promotions/mine");
      const data = (res.data.data ?? res.data) as any[];
      setOwnerPromotions(
        data.map((p) => ({
          ...p,
          imageUrl: p.imageUrl
            ? p.imageUrl.startsWith("http")
              ? p.imageUrl
              : `${API_BASE_URL}${p.imageUrl}`
            : p.imageUrl,
        })) as Promotion[],
      );
      closeEditor(true);
    } catch {
      Alert.alert("Error", "Failed to publish promotion. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = () => {
    if (!draftPromotion) return;

    const promotion = createPromotionFromDraft(draftPromotion, "unpublished");

    upsertOwnerPromotion(promotion);
    closeEditor(true);
  };

  const handleDeletePromotion = async () => {
    if (!draftPromotion?.id) return;
    const idToDelete = draftPromotion.id;
    try {
      await apiClient.delete(`/api/promotions/${idToDelete}`);
      setOwnerPromotions((prev) =>
        prev.filter((item) => item.id !== idToDelete),
      );
      closeEditor(true);
    } catch {
      Alert.alert("Error", "Failed to delete promotion. Please try again.");
    }
  };

  const handleSaveNewsDraft = async () => {
    if (!draftNews) return;
    try {
      const formData = new FormData();
      const draftWithStatus = { ...draftNews, status: "draft" };
      Object.entries(draftWithStatus).forEach(([key, value]) => {
        if (key === "id" && !value) return;
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "string" && value.startsWith("file://")) {
          formData.append("image", {
            uri: value,
            name: "news.jpg",
            type: "image/jpeg",
          } as any);
        } else {
          formData.append(key, String(value));
        }
      });
      if (draftNews.id) {
        await apiClient.patch(`/api/news/${draftNews.id}`, formData);
      } else {
        await apiClient.post("/api/news", formData);
      }
      const res = await apiClient.get<{ data: any[] }>("/api/news/mine");
      const data = (res.data.data ?? res.data) as any[];
      setOwnerNews(
        data.map((n) => ({
          ...n,
          imageUrl: n.imageUrl
            ? n.imageUrl.startsWith("http")
              ? n.imageUrl
              : `${API_BASE_URL}${n.imageUrl}`
            : n.imageUrl,
        })) as NewsItem[],
      );
      closeNewsEditor(true);
    } catch {
      Alert.alert("Error", "Failed to save news. Please try again.");
    }
  };

  const handlePublishNews = async () => {
    if (!draftNews || isPublishingNews) return;
    setIsPublishingNews(true);
    try {
      const formData = new FormData();
      Object.entries(draftNews).forEach(([key, value]) => {
        if (key === "id" && !value) return;
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "string" && value.startsWith("file://")) {
          formData.append("image", {
            uri: value,
            name: "news.jpg",
            type: "image/jpeg",
          } as any);
        } else {
          formData.append(key, String(value));
        }
      });
      let savedId = draftNews.id;
      if (savedId) {
        await apiClient.patch(`/api/news/${savedId}`, formData);
      } else {
        const createRes = await apiClient.post<any>("/api/news", formData);
        savedId = createRes.data.data?.id ?? createRes.data.id;
      }
      await apiClient.patch(`/api/news/${savedId}/publish`);
      const res = await apiClient.get<{ data: any[] }>("/api/news/mine");
      const data = (res.data.data ?? res.data) as any[];
      setOwnerNews(
        data.map((n) => ({
          ...n,
          imageUrl: n.imageUrl
            ? n.imageUrl.startsWith("http")
              ? n.imageUrl
              : `${API_BASE_URL}${n.imageUrl}`
            : n.imageUrl,
        })) as NewsItem[],
      );
      closeNewsEditor(true);
    } catch {
      Alert.alert("Error", "Failed to publish news. Please try again.");
    } finally {
      setIsPublishingNews(false);
    }
  };

  const handleUnpublishNews = () => {
    if (!draftNews) return;

    const newsItem = createNewsFromDraft(draftNews, "unpublished");

    upsertOwnerNews(newsItem);
    closeNewsEditor(true);
  };

  const handleDeleteNews = async () => {
    if (!draftNews?.id) return;
    const idToDelete = draftNews.id;
    try {
      await apiClient.delete(`/api/news/${idToDelete}`);
      setOwnerNews((prev) => prev.filter((item) => item.id !== idToDelete));
      closeNewsEditor(true);
    } catch {
      Alert.alert("Error", "Failed to delete news. Please try again.");
    }
  };

  const ownerFeedItems = useMemo<FollowingFeedCardItem[]>(() => {
    return ownerPromotions.map((promotion) => {
      return {
        id: `owner-promotion-${promotion.id}`,
        businessId: promotion.businessId,
        type: "promotion",
        promotionId: promotion.id,
        status: promotion.status,
        isFeatured: promotion.isFeatured === true,
        title: promotion.title || "Untitled promotion",
        description:
          promotion.subtitle ||
          promotion.description ||
          (promotion.offerDetails as any)?.[0] ||
          "No description added yet.",
        createdAt: new Date().toISOString(),
        businessName: myBusiness?.name ?? "Your Business",
        businessCategory: myBusiness?.category ?? "",
        businessLocation: myBusiness?.location ?? "",
        businessImage:
          myBusiness?.avatarUrl ??
          promotion.imageUrl ??
          "https://placehold.co/600x400",
        businessRating: myBusiness?.rating ?? 0,
        businessDistanceKm: 0,
        businessPriceLevel: undefined,
        distanceKm: 0,
        priceLevel: undefined,
        recommendedByPreview: [],
        recommendedByCount: 0,
      };
    });
  }, [ownerPromotions, myBusiness]);

  const ownerNewsFeedItems = useMemo<FollowingFeedCardItem[]>(() => {
    return ownerNews.map((newsItem) => ({
      id: `owner-news-${newsItem.id}`,
      businessId: newsItem.businessId,
      type: "news",
      newsId: newsItem.id,
      status: newsItem.status,
      title: newsItem.title || "Untitled news",
      description:
        newsItem.subtitle ??
        newsItem.description ??
        "No description added yet.",
      createdAt: newsItem.publishedAt || new Date().toISOString(),
      businessName: myBusiness?.name ?? "Your Business",
      businessCategory: myBusiness?.category ?? "",
      businessLocation: myBusiness?.location ?? "",
      businessImage:
        myBusiness?.avatarUrl ??
        newsItem.imageUrl ??
        "https://placehold.co/600x400",
      businessRating: myBusiness?.rating ?? 0,
      businessDistanceKm: 0,
      businessPriceLevel: undefined,
      distanceKm: 0,
      priceLevel: undefined,
      recommendedByPreview: [],
      recommendedByCount: 0,
    }));
  }, [ownerNews, myBusiness]);

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
      state: option.value === "all" ? undefined : option.state,
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

  useFocusEffect(
    useCallback(() => {
      if (isBusinessAccount || isGuest) return;
      useFilterStore.getState().setCategory("discovery", PROMO_CATEGORY_LABEL);
    }, [isBusinessAccount, isGuest]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!isBusinessAccount) return;

      void apiClient
        .get<{ data: any[] }>("/api/promotions/mine")
        .then((res) => {
          const data = (res.data.data ?? res.data) as any[];
          setOwnerPromotions(
            data.map((p) => ({
              ...p,
              imageUrl: p.imageUrl
                ? p.imageUrl.startsWith("http")
                  ? p.imageUrl
                  : `${API_BASE_URL}${p.imageUrl}`
                : p.imageUrl,
            })) as Promotion[],
          );
        })
        .catch(() => {});

      void apiClient
        .get<{ data: any[] }>("/api/news/mine")
        .then((res) => {
          const data = (res.data.data ?? res.data) as any[];
          setOwnerNews(
            data.map((n) => ({
              ...n,
              imageUrl: n.imageUrl
                ? n.imageUrl.startsWith("http")
                  ? n.imageUrl
                  : `${API_BASE_URL}${n.imageUrl}`
                : n.imageUrl,
            })) as NewsItem[],
          );
        })
        .catch(() => {});
    }, [isBusinessAccount]),
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
    router.replace({
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

  const newsAndPromosHeader = isBusinessAccount ? (
    <ScreenHeader
      title="News & Promos"
      titleSubtitle="Add and view your news and promotions"
      gradientColors={DISCOVERY_GRADIENT}
    />
  ) : (
    <ScreenHeader
      title="News & Promos"
      titleSubtitle="Updates from followed businesses"
      subtitleLabel="Location"
      subtitleValue={selectedLocationLabel}
      showSubtitleChevron
      locationOptions={locationOptions}
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
  );

  if (isLoading) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        {newsAndPromosHeader}

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
      {newsAndPromosHeader}

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
            activeFilterCount > 0
              ? "Try adjusting or clearing your filters."
              : activeTab === "promotion"
                ? "There are no promotions at this time. Check the News!"
                : "There is no news at this time. Check the Promotions!"
          }
          actionLabel={activeFilterCount > 0 ? "Clear filters" : undefined}
          onPressAction={
            activeFilterCount > 0
              ? () => useFilterStore.getState().reset("following")
              : undefined
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
                    ? item.item.status === "published"
                      ? undefined
                      : () => openOwnerPromotionEdit(item.item.promotionId)
                    : item.isOwnerNews
                      ? item.item.status === "published"
                        ? undefined
                        : () => openOwnerNewsEdit(item.item.newsId)
                      : undefined
                }
                isOwnerPromotion={item.isOwnerPromotion}
                isOwnerNews={item.isOwnerNews}
                isFeatured={item.item.isFeatured}
                onFeaturePromotion={
                  item.isOwnerPromotion
                    ? () => {
                        void apiClient
                          .patch(
                            `/api/promotions/${item.item.promotionId}/feature`,
                            { isFeatured: true },
                          )
                          .then(() => {
                            void apiClient
                              .get<{ data: any[] }>("/api/promotions/mine")
                              .then((res) => {
                                const data = (res.data.data ??
                                  res.data) as any[];
                                setOwnerPromotions(
                                  data.map((p) => ({
                                    ...p,
                                    imageUrl: p.imageUrl
                                      ? p.imageUrl.startsWith("http")
                                        ? p.imageUrl
                                        : `${API_BASE_URL}${p.imageUrl}`
                                      : p.imageUrl,
                                  })) as Promotion[],
                                );
                              });
                          })
                          .catch(() => {});
                      }
                    : undefined
                }
                onDelete={
                  item.isOwnerPromotion
                    ? () => {
                        Alert.alert(
                          "Delete promotion",
                          "This cannot be undone.",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => {
                                void (async () => {
                                  if (!item.item.promotionId) return;
                                  try {
                                    await apiClient.delete(
                                      `/api/promotions/${item.item.promotionId}`,
                                    );
                                    setOwnerPromotions((prev) =>
                                      prev.filter(
                                        (p) => p.id !== item.item.promotionId,
                                      ),
                                    );
                                  } catch {
                                    Alert.alert(
                                      "Error",
                                      "Failed to delete promotion. Please try again.",
                                    );
                                  }
                                })();
                              },
                            },
                          ],
                        );
                      }
                    : item.isOwnerNews
                      ? () => {
                          Alert.alert("Delete news", "This cannot be undone.", [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => {
                                void (async () => {
                                  if (!item.item.newsId) return;
                                  try {
                                    await apiClient.delete(
                                      `/api/news/${item.item.newsId}`,
                                    );
                                    setOwnerNews((prev) =>
                                      prev.filter(
                                        (n) => n.id !== item.item.newsId,
                                      ),
                                    );
                                  } catch {
                                    Alert.alert(
                                      "Error",
                                      "Failed to delete news. Please try again.",
                                    );
                                  }
                                })();
                              },
                            },
                          ]);
                        }
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
        onCancel={() => closeEditor()}
        onSave={handleSaveDraft}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onDelete={handleDeletePromotion}
        isPublishing={isPublishing}
      />

      <OwnerNewsEditor
        visible={isNewsEditorOpen}
        draft={draftNews ?? createEmptyNewsDraft()}
        onChangeDraft={setDraftNews}
        onCancel={() => closeNewsEditor()}
        onSave={handleSaveNewsDraft}
        onPublish={handlePublishNews}
        onUnpublish={handleUnpublishNews}
        onDelete={handleDeleteNews}
        isPublishing={isPublishingNews}
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
