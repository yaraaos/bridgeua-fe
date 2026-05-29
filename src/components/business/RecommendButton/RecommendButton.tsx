import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { useRecommendationsStore } from "@/src/store/recommendations.store";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  businessId: string | number;
  style?: StyleProp<ViewStyle>;
  onRecommendChange?: () => void;
  businessName?: string;
};

export default function RecommendButton({
  businessId,
  style,
  onRecommendChange,
  businessName,
}: Props) {
  const hasFetched = useRef(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const recommendedBusinessIds = useRecommendationsStore(
    (s) => s.recommendedBusinessIds,
  );
  const addRecommendation = useRecommendationsStore((s) => s.addRecommendation);
  const removeRecommendation = useRecommendationsStore(
    (s) => s.removeRecommendation,
  );
  const setRecommendations = useRecommendationsStore(
    (s) => s.setRecommendations,
  );

  const normalizedId = String(businessId);
  const isActive = recommendedBusinessIds.includes(normalizedId);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    void apiClient
      .get("/api/recommendations/mine")
      .then((res) => {
        const data = res.data as string[] | { data: string[] };
        setRecommendations(
          Array.isArray(data) ? data.map(String) : data.data.map(String),
        );
      })
      .catch(() => {});
  }, []);

  const handlePress = () => {
    if (!isActive) {
      setShowConfirmModal(true);
    } else {
      removeRecommendation(normalizedId);
      void apiClient
        .delete(`/api/recommendations/${normalizedId}`)
        .then(() => onRecommendChange?.())
        .catch(() => addRecommendation(normalizedId));
    }
  };

  const handleConfirmRecommend = () => {
    setShowConfirmModal(false);
    addRecommendation(normalizedId);
    void apiClient
      .post("/api/recommendations", { businessId: normalizedId })
      .then(() => onRecommendChange?.())
      .catch(() => removeRecommendation(normalizedId));
  };

  return (
    <>
      <Pressable onPress={handlePress} style={[styles.iconButton, style]}>
        <Ionicons
          name={isActive ? "thumbs-up" : "thumbs-up-outline"}
          size={16}
          color="#FFFFFF"
        />
      </Pressable>
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>
              Recommend {businessName ?? 'this business'}?
            </AppText>
            <AppText style={styles.modalBody}>
              Your recommendation will be publicly visible and shown on this
              business&apos;s profile. Other users will see that you endorse
              this place.
            </AppText>
            <View style={styles.modalActions}>
              <View style={styles.modalActionButton}>
                <AppButton
                  title="Cancel"
                  variant="ghost"
                  onPress={() => setShowConfirmModal(false)}
                />
              </View>
              <View style={styles.modalActionButton}>
                <AppButton
                  title="Recommend"
                  variant="primary"
                  onPress={handleConfirmRecommend}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: "#F79A2E",
      alignItems: "center",
      justifyContent: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    modalCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      gap: 12,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    modalBody: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
    },
    modalActions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
    modalActionButton: {
      flex: 1,
    },
  });
}
