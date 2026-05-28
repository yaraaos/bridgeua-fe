import { apiClient } from "@/src/services/api/client";
import { useRecommendationsStore } from "@/src/store/recommendations.store";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

type Props = {
  businessId: string | number;
  style?: StyleProp<ViewStyle>;
  onRecommendChange?: () => void;
};

export default function RecommendButton({
  businessId,
  style,
  onRecommendChange,
}: Props) {
  const hasFetched = useRef(false);

  const isRecommended = useRecommendationsStore((s) => s.isRecommended);
  const addRecommendation = useRecommendationsStore((s) => s.addRecommendation);
  const removeRecommendation = useRecommendationsStore(
    (s) => s.removeRecommendation,
  );
  const setRecommendations = useRecommendationsStore(
    (s) => s.setRecommendations,
  );

  const normalizedId = String(businessId);
  const isActive = isRecommended(normalizedId);

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
      addRecommendation(normalizedId);
      void apiClient
        .post("/api/recommendations", { businessId: normalizedId })
        .then(() => onRecommendChange?.())
        .catch(() => removeRecommendation(normalizedId));
    } else {
      void apiClient
        .delete(`/api/recommendations/${normalizedId}`)
        .then(() => {
          removeRecommendation(normalizedId);
          onRecommendChange?.();
        })
        .catch(() => {});
    }
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
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F79A2E",
    alignItems: "center",
    justifyContent: "center",
  },
});
