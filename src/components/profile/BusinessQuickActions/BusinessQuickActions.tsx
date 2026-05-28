import { apiClient } from "@/src/services/api/client";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, View } from "react-native";

import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";

import { createStyles } from "./BusinessQuickActions.styles";
import { QUICK_ACTIONS } from "./constants";
import { QuickActionId } from "./types";

const DEFAULT_SELECTED_ACTIONS: QuickActionId[] = [
  "edit-services",
  "edit-gallery",
  "edit-business",
  "add-promo",
];

type Props = {
  businessId: string;
  onActionPress?: (actionId: QuickActionId) => void;
};

export default function BusinessQuickActions({
  businessId,
  onActionPress,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { business } = useMyBusinessProfile();

  const [selectedActions, setSelectedActions] = useState<QuickActionId[]>(
    DEFAULT_SELECTED_ACTIONS,
  );
  const [draftActions, setDraftActions] = useState<QuickActionId[]>(
    DEFAULT_SELECTED_ACTIONS,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (business?.quickActions && !hasLoaded.current) {
      hasLoaded.current = true;
      setSelectedActions(business.quickActions as QuickActionId[]);
      setDraftActions(business.quickActions as QuickActionId[]);
    }
  }, [business?.quickActions]);

  const visibleActions = QUICK_ACTIONS.filter((action) =>
    selectedActions.includes(action.id),
  );

  const openEdit = () => {
    setDraftActions(selectedActions);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setDraftActions(selectedActions);
    setIsEditOpen(false);
  };

  const toggleAction = (actionId: QuickActionId) => {
    setDraftActions((current) =>
      current.includes(actionId)
        ? current.filter((item) => item !== actionId)
        : [...current, actionId],
    );
  };

  const handleSave = async () => {
    setSelectedActions(draftActions);
    setIsEditOpen(false);
    void apiClient
      .patch('/api/businesses/me/quick-actions', { quickActions: draftActions })
      .catch(() => {});
  };

  const ITEMS_PER_ROW = 5;
  const ACTION_GAP = 8;

  const [gridWidth, setGridWidth] = useState(0);

  const actionTileWidth =
    gridWidth > 0
      ? (gridWidth - ACTION_GAP * (ITEMS_PER_ROW - 1)) / ITEMS_PER_ROW
      : 0;

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AppText style={styles.cardTitle}>Quick actions</AppText>

          <Pressable style={styles.editButton} onPress={openEdit}>
            <AppText style={styles.editText}>Edit</AppText>
          </Pressable>
        </View>

        <View
          style={styles.actionsGrid}
          onLayout={(event) => {
            setGridWidth(event.nativeEvent.layout.width);
          }}
        >
          {visibleActions.map((action) => (
            <Pressable
              key={action.id}
              style={[styles.actionTile, { width: actionTileWidth }]}
              onPress={() => onActionPress?.(action.id)}
            >
              <View style={styles.actionIcon}>
                <Ionicons
                  name={action.icon as keyof typeof Ionicons.glyphMap}
                  size={28}
                  color={colors.primaryGreen}
                />
              </View>

              <AppText style={styles.actionLabel}>{action.label}</AppText>
            </Pressable>
          ))}
        </View>
      </View>

      <Modal
        visible={isEditOpen}
        transparent
        animationType="fade"
        onRequestClose={closeEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>Edit quick actions</AppText>

            <View style={styles.modalList}>
              {QUICK_ACTIONS.map((action) => {
                const isSelected = draftActions.includes(action.id);

                return (
                  <Pressable
                    key={action.id}
                    style={styles.modalItem}
                    onPress={() => toggleAction(action.id)}
                  >
                    <View style={styles.modalItemLeft}>
                      <Ionicons
                        name={action.icon as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={colors.primaryGreen}
                      />

                      <AppText style={styles.modalItemText}>
                        {action.label}
                      </AppText>
                    </View>

                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={22}
                      color={
                        isSelected ? colors.primaryGreen : colors.textMuted
                      }
                    />
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <View style={styles.modalButton}>
                <AppButton
                  title="Cancel"
                  variant="secondary"
                  onPress={closeEdit}
                />
              </View>

              <View style={styles.modalButton}>
                <AppButton title="Save" onPress={handleSave} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
