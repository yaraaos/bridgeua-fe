import { BookingPreviewCard } from "@/src/components/bookings";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import NetworkErrorBanner from "@/src/components/ui/NetworkErrorBanner";
import AppTabsPills, {
  AppTabPillItem,
} from "@/src/components/ui/AppTabsPills/AppTabsPills";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import type { BookingStatus } from "@/src/features/bookings/types/booking.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import { type ApiError, parseApiError } from "@/src/services/api/types";
import { useAuthStore } from "@/src/store/auth.store";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

type BusinessBookingFilter = "upcoming" | "past" | "cancelled";

type BusinessBooking = {
  id: string;
  date: string;
  startTime: string;
  status: BookingStatus;
  note?: string;
  user?: {
    id: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    };
  };
  service?: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  };
  professional?: {
    id: string;
    name: string;
    role: string;
  };
};


const UPCOMING_STATUSES: BookingStatus[] = ["pending", "confirmed", "active"];
const PAST_STATUSES: BookingStatus[] = ["completed", "past"];
const CANCELLED_STATUSES: BookingStatus[] = ["cancelled"];

function getClientName(booking: BusinessBooking, fallback: string): string {
  const p = booking.user?.profile;
  if (p?.firstName || p?.lastName) {
    return [p.firstName, p.lastName].filter(Boolean).join(" ");
  }
  return booking.user?.email ?? fallback;
}

export default function BusinessBookingsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const BUSINESS_BOOKING_TABS: AppTabPillItem<BusinessBookingFilter>[] = [
    { label: t("businessBookings.tabUpcoming"), value: "upcoming" },
    { label: t("businessBookings.tabPast"), value: "past" },
    { label: t("businessBookings.tabCancelled"), value: "cancelled" },
  ];

  const user = useAuthStore((s) => s.user);
  const businessId = user?.activeBusinessId ?? null;

  const [activeFilter, setActiveFilter] =
    useState<BusinessBookingFilter>("upcoming");
  const [bookings, setBookings] = useState<BusinessBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<ApiError | null>(null);

  const loadBookings = useCallback(async () => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }
    try {
      setFetchError(null);
      const res = await apiClient.get<BusinessBooking[]>(
        ENDPOINTS.BUSINESS_BOOKINGS(businessId),
      );
      setBookings(res.data ?? []);
    } catch (e) {
      setFetchError(parseApiError(e));
      setBookings([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [businessId]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const handleRefresh = () => {
    setRefreshing(true);
    void loadBookings();
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "upcoming") return UPCOMING_STATUSES.includes(booking.status);
    if (activeFilter === "past") return PAST_STATUSES.includes(booking.status);
    return CANCELLED_STATUSES.includes(booking.status);
  });

  const emptyState = getEmptyState(activeFilter, t);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t("businessBookings.title")}
        titleSubtitle={t("businessBookings.subtitle")}
        onBack={() => router.back()}
      />

      {fetchError && <NetworkErrorBanner message={fetchError.isNetworkError ? t("home.errorNoInternet") : t("businessBookings.errorBanner")} />}

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <AppLoader />
        </View>
      ) : fetchError ? (
        <View style={styles.loaderWrap}>
          <AppEmptyState
            title={fetchError.isNetworkError ? t("home.errorNoInternet") : t("home.errorSomethingWrong")}
            description={
              fetchError.isNetworkError
                ? t("home.errorNoInternetDesc")
                : t("businessBookings.errorDesc")
            }
            actionLabel={t("home.errorTryAgain")}
            onPressAction={() => { void loadBookings(); }}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <AppTabsPills
            tabs={BUSINESS_BOOKING_TABS}
            activeTab={activeFilter}
            onChange={setActiveFilter}
          />

          {filteredBookings.length === 0 ? (
            <View style={styles.emptyWrap}>
              <AppEmptyState
                title={emptyState.title}
                description={emptyState.description}
              />
            </View>
          ) : (
            <View style={styles.list}>
              {filteredBookings.map((booking) => (
                <BookingPreviewCard
                  key={String(booking.id)}
                  businessName={getClientName(booking, t("businessBookings.fallbackClient"))}
                  serviceName={booking.service?.name ?? t("businessBookings.fallbackService")}
                  specialistName={booking.professional?.name ?? t("businessBookings.fallbackSpecialist")}
                  date={booking.date}
                  time={booking.startTime?.slice(0, 5) ?? ""}
                  price={
                    booking.service?.price
                      ? `$${booking.service.price}`
                      : t("businessBookings.fallbackPrice")
                  }
                  status={booking.status}
                  isPast={activeFilter === "past"}
                  onPress={() =>
                    router.push({
                      pathname: "/bookings/[bookingId]",
                      params: { bookingId: String(booking.id) },
                    })
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function getEmptyState(filter: BusinessBookingFilter, t: (key: string) => string) {
  if (filter === "past") {
    return {
      title: t("businessBookings.emptyPastTitle"),
      description: t("businessBookings.emptyPastDesc"),
    };
  }
  if (filter === "cancelled") {
    return {
      title: t("businessBookings.emptyCancelledTitle"),
      description: t("businessBookings.emptyCancelledDesc"),
    };
  }
  return {
    title: t("businessBookings.emptyUpcomingTitle"),
    description: t("businessBookings.emptyUpcomingDesc"),
  };
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loaderWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.lg,
    },
    list: {
      gap: spacing.cardGap,
    },
    emptyWrap: {
      paddingTop: spacing.xl,
    },
  });
}
