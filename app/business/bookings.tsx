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

const BUSINESS_BOOKING_TABS: AppTabPillItem<BusinessBookingFilter>[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
  { label: "Cancelled", value: "cancelled" },
];

const UPCOMING_STATUSES: BookingStatus[] = ["pending", "confirmed", "active"];
const PAST_STATUSES: BookingStatus[] = ["completed", "past"];
const CANCELLED_STATUSES: BookingStatus[] = ["cancelled"];

function getClientName(booking: BusinessBooking): string {
  const p = booking.user?.profile;
  if (p?.firstName || p?.lastName) {
    return [p.firstName, p.lastName].filter(Boolean).join(" ");
  }
  return booking.user?.email ?? "Client";
}

export default function BusinessBookingsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

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

  const emptyState = getEmptyState(activeFilter);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Bookings"
        titleSubtitle="Manage upcoming and past bookings for your business."
        onBack={() => router.back()}
      />

      {fetchError && <NetworkErrorBanner message={fetchError.isNetworkError ? "No internet connection" : "Failed to load bookings"} />}

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <AppLoader />
        </View>
      ) : fetchError ? (
        <View style={styles.loaderWrap}>
          <AppEmptyState
            title={fetchError.isNetworkError ? "No internet connection" : "Something went wrong"}
            description={
              fetchError.isNetworkError
                ? "Check your connection and try again."
                : "Couldn't load bookings. Please try again."
            }
            actionLabel="Try again"
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
                  businessName={getClientName(booking)}
                  serviceName={booking.service?.name ?? "Service"}
                  specialistName={booking.professional?.name ?? "Any specialist"}
                  date={booking.date}
                  time={booking.startTime?.slice(0, 5) ?? ""}
                  price={
                    booking.service?.price
                      ? `$${booking.service.price}`
                      : "Price on request"
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

function getEmptyState(filter: BusinessBookingFilter) {
  if (filter === "past") {
    return {
      title: "No past bookings yet",
      description: "Completed bookings will appear here.",
    };
  }
  if (filter === "cancelled") {
    return {
      title: "No cancelled bookings",
      description: "Cancelled customer bookings will appear here.",
    };
  }
  return {
    title: "No upcoming bookings",
    description: "New customer bookings will appear here once clients book your services.",
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
