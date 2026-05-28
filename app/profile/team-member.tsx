import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppTabsPills from "@/src/components/ui/AppTabsPills";
import type { AppTabPillItem } from "@/src/components/ui/AppTabsPills/AppTabsPills";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import { useTeamStore } from "@/src/store/team.store";
import type { TeamMember } from "@/src/types/team";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const MEMBER_TABS = [
  { label: "Services", value: "services" },
  { label: "Bookings", value: "bookings" },
  { label: "Reviews", value: "reviews" },
] satisfies AppTabPillItem<"services" | "bookings" | "reviews">[];

export default function TeamMemberScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { memberId } = useLocalSearchParams<{ memberId?: string }>();
  const { members, setMembers } = useTeamStore();
  const { business } = useMyBusinessProfile();
  const businessId = business?.id;
  const [activeTab, setActiveTab] = useState<
    "services" | "bookings" | "reviews"
  >("services");
  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (members.find((m) => String(m.id) === String(memberId))) return;
      if (!businessId) return;
      setIsFetching(true);
      void apiClient
        .get<TeamMember[]>(`/api/businesses/${businessId}/team`)
        .then((res) => {
          const currentMembers = useTeamStore.getState().members;
          setMembers(
            res.data.map((m) => {
              const existing = currentMembers.find(
                (c) => String(c.id) === String(m.id),
              );
              return {
                ...m,
                photoUrl: m.photoUrl
                  ? m.photoUrl.startsWith("http")
                    ? m.photoUrl
                    : `${API_BASE_URL}${m.photoUrl}`
                  : undefined,
                serviceIds: existing?.serviceIds ?? [],
              };
            }),
          );
        })
        .catch(() => {})
        .finally(() => {
          setIsFetching(false);
        });
    }, [memberId, businessId, members, setMembers]),
  );

  const member = members.find((m) => String(m.id) === String(memberId));

  if (isFetching || (!member && !business)) {
    return (
      <AppScreen withTopInset={false} style={{ padding: 0 }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  if (!member) {
    return (
      <AppScreen withTopInset={false} style={{ padding: 0 }}>
        <AppText
          style={{
            color: colors.textMuted,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Team member not found.
        </AppText>
      </AppScreen>
    );
  }

  const assignedServices = (business?.services ?? []).filter(
    (s) => member.serviceIds?.includes(s.id) ?? false,
  );

  return (
    <AppScreen withTopInset={false} style={{ padding: 0 }}>
      <ScreenHeader
        title={`${member.firstName} ${member.lastName}`}
        titleSubtitle="Team member"
        onBack={() => router.back()}
      />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <AppTabsPills
          tabs={MEMBER_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {activeTab === "services" ? (
        assignedServices.length === 0 ? (
          <AppEmptyState
            title="No services assigned"
            description="This team member has no services assigned yet."
          />
        ) : (
          <FlatList
            data={assignedServices}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.serviceRow}>
                <AppText style={styles.serviceName}>{item.name}</AppText>
                <AppText style={styles.serviceMeta}>
                  {item.durationMinutes
                    ? `${item.durationMinutes} min`
                    : (item.duration ?? "")}
                  {item.price != null
                    ? ` · $${item.price}`
                    : item.priceFrom
                      ? ` · from ${item.priceFrom}`
                      : ""}
                </AppText>
              </View>
            )}
          />
        )
      ) : activeTab === "bookings" ? (
        <AppEmptyState
          title="No bookings yet"
          description="Bookings for this team member will appear here."
        />
      ) : (
        <AppEmptyState
          title="No reviews yet"
          description="Reviews for this team member will appear here."
        />
      )}
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    serviceRow: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    serviceName: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    serviceMeta: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
}
