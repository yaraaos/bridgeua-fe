import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppAvatar from "@/src/components/ui/AppAvatar";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { useTeamStore } from "@/src/store/team.store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

export default function ServicesScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { business } = useMyBusinessProfile();
  const { members, updateMember } = useTeamStore();
  const businessId = business?.id;

  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const services = business?.services ?? [];

  return (
    <AppScreen withTopInset={false} style={{ padding: 0 }}>
      <ScreenHeader
        title="Services"
        titleSubtitle="Manage your services and specialists."
        onBack={() => router.back()}
      />

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isExpanded = expandedServiceId === item.id;
          return (
            <View style={styles.serviceCard}>
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

              <Pressable
                style={styles.specialistsToggleRow}
                onPress={() =>
                  setExpandedServiceId((prev) =>
                    prev === item.id ? null : item.id,
                  )
                }
              >
                <AppText style={styles.specialistsLabel}>Specialists</AppText>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={colors.textMuted}
                />
              </Pressable>

              {isExpanded && (
                <View style={styles.membersList}>
                  {members.length === 0 ? (
                    <AppText style={styles.noMembersText}>
                      No team members added yet.
                    </AppText>
                  ) : (
                    members.map((member) => {
                      const isAssigned =
                        member.serviceIds?.includes(item.id) ?? false;
                      const toggledArray = isAssigned
                        ? (member.serviceIds ?? []).filter(
                            (id) => id !== item.id,
                          )
                        : [...(member.serviceIds ?? []), item.id];
                      return (
                        <View key={member.id} style={styles.memberRow}>
                          <View style={styles.memberLeft}>
                            <AppAvatar
                              name={`${member.firstName} ${member.lastName}`}
                              imageUrl={member.photoUrl}
                              size="sm"
                            />
                            <AppText style={styles.memberName}>
                              {member.firstName} {member.lastName}
                            </AppText>
                          </View>
                          <Pressable
                            onPress={() => {
                              updateMember(member.id, {
                                serviceIds: toggledArray,
                              });
                              if (businessId) {
                                void apiClient
                                  .patch(
                                    `/api/businesses/${businessId}/team/${member.id}`,
                                    { serviceIds: toggledArray },
                                  )
                                  .catch(() => {});
                              }
                            }}
                          >
                            <Ionicons
                              name={
                                isAssigned
                                  ? "checkmark-circle"
                                  : "ellipse-outline"
                              }
                              size={22}
                              color={
                                isAssigned ? colors.primaryGreen : colors.border
                              }
                            />
                          </Pressable>
                        </View>
                      );
                    })
                  )}
                </View>
              )}
            </View>
          );
        }}
      />
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
      gap: 12,
    },
    serviceCard: {
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    serviceName: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    serviceMeta: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    specialistsToggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    specialistsLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
    },
    membersList: {
      marginTop: 8,
      gap: 8,
    },
    memberRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    memberLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    memberName: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textPrimary,
      marginLeft: 8,
    },
    noMembersText: {
      fontSize: 12,
      color: colors.textMuted,
      fontStyle: "italic",
    },
  });
}
