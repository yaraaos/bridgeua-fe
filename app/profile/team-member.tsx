import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useTeamStore } from "@/src/store/team.store";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

export default function TeamMemberScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { memberId } = useLocalSearchParams<{ memberId?: string }>();
  const { members } = useTeamStore();
  const { business } = useMyBusinessProfile();
  const [activeTab, setActiveTab] = useState<"services" | "bookings" | "reviews">("services");

  const member = members.find((m) => m.id === memberId);

  if (!member) {
    return (
      <AppScreen withTopInset={false} style={{ padding: 0 }}>
        <AppText
          style={{ color: colors.textMuted, textAlign: "center", marginTop: 40 }}
        >
          Team member not found.
        </AppText>
      </AppScreen>
    );
  }

  const assignedServices = (business?.services ?? []).filter(
    (s) => member.serviceIds?.includes(s.id) ?? false,
  );

  const tabs = ["services", "bookings", "reviews"] as const;

  return (
    <AppScreen withTopInset={false} style={{ padding: 0 }}>
      <ScreenHeader
        title={`${member.firstName} ${member.lastName}`}
        titleSubtitle="Team member"
        onBack={() => router.back()}
      />

      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === tab ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </AppText>
          </Pressable>
        ))}
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
    tabRow: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 4,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    tabItem: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    tabItemActive: {
      backgroundColor: colors.primaryGreen,
    },
    tabText: {
      fontSize: 13,
    },
    tabTextActive: {
      fontWeight: "800",
      color: "#FFFFFF",
    },
    tabTextInactive: {
      fontWeight: "700",
      color: colors.textSecondary,
    },
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
