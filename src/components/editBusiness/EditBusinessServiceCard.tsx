import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import AppAvatar from "@/src/components/ui/AppAvatar";
import AppInput from "@/src/components/ui/AppInput/AppInput";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import type { ConfiguredService } from "@/src/features/businesses/types/editBusiness.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { TeamMember } from "@/src/types/team";

type Props = {
  service: ConfiguredService;
  onRemove: () => void;
  onDurationChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  showValidation: boolean;
  members?: TeamMember[];
  onToggleMember?: (memberId: string | number) => void;
  dbServiceId?: string;
};

export default function EditBusinessServiceCard({
  service,
  onRemove,
  onDurationChange,
  onPriceChange,
  showValidation,
  members,
  onToggleMember,
  dbServiceId,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const durationError = showValidation && service.duration.trim() === "";
  const priceError = showValidation && service.price.trim() === "";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText style={styles.name} numberOfLines={1}>
          {service.name}
        </AppText>
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeButton}>
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.fieldsRow}>
        <View style={styles.fieldWrap}>
          <AppText style={styles.fieldLabel}>
            Duration (min)
            {service.duration.trim() === "" && (
              <Text style={styles.requiredMark}> *</Text>
            )}
          </AppText>
          <AppInput
            value={service.duration}
            onChangeText={onDurationChange}
            keyboardType="numeric"
            placeholder="60"
            error={durationError}
          />
          {durationError && (
            <AppText style={styles.errorText}>Required</AppText>
          )}
        </View>

        <View style={styles.fieldWrap}>
          <AppText style={styles.fieldLabel}>
            Price ($)
            {service.price.trim() === "" && (
              <Text style={styles.requiredMark}> *</Text>
            )}
          </AppText>
          <AppInput
            value={service.price}
            onChangeText={onPriceChange}
            keyboardType="decimal-pad"
            placeholder="45.00"
            error={priceError}
          />
          {priceError && <AppText style={styles.errorText}>Required</AppText>}
        </View>
      </View>

      {members && members.length > 0 && (
        <>
          <View style={styles.specialistsDivider} />
          <AppText style={styles.specialistsLabel}>Specialists</AppText>
          <View style={styles.membersList}>
            {members.map((member) => {
              const serviceIdToCheck = dbServiceId ?? String(service.id);
              const isAssigned =
                member.serviceIds?.map(String).includes(serviceIdToCheck) ?? false;
              return (
                <View key={String(member.id)} style={styles.memberRow}>
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
                    hitSlop={8}
                    onPress={() => onToggleMember?.(member.id)}
                  >
                    <Ionicons
                      name={isAssigned ? "checkmark-circle" : "ellipse-outline"}
                      size={22}
                      color={isAssigned ? colors.primaryGreen : colors.border}
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      gap: spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    name: {
      flex: 1,
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
      marginRight: spacing.sm,
    },
    removeButton: {
      padding: 2,
    },
    fieldsRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    fieldWrap: {
      flex: 1,
      gap: spacing.xs,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    requiredMark: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.error,
    },
    errorText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.error,
      marginTop: 2,
    },
    specialistsDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginTop: spacing.sm,
    },
    specialistsLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      marginTop: spacing.sm,
    },
    membersList: {
      marginTop: spacing.sm,
      gap: 10,
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
  });
}
