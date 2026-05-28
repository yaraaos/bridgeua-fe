import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { useRecommendationsStore } from "@/src/store/recommendations.store";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

type Props = {
  businessId: string | number;
  style?: StyleProp<ViewStyle>;
};

export default function RecommendButton({ businessId, style }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const {
    isRecommended,
    addRecommendation,
    removeRecommendation,
    setRecommendations,
  } = useRecommendationsStore();

  const normalizedId = String(businessId);
  const isActive = isRecommended(normalizedId);

  useEffect(() => {
    void apiClient
      .get("/api/recommendations/mine")
      .then((res) => {
        const data = res.data as string[] | { data: string[] };
        setRecommendations(Array.isArray(data) ? data : data.data);
      })
      .catch(() => {});
  }, []);

  const handlePress = () => {
    if (!isActive) {
      addRecommendation(normalizedId);
      void apiClient
        .post("/api/recommendations", { businessId: normalizedId })
        .catch(() => removeRecommendation(normalizedId));
    } else {
      removeRecommendation(normalizedId);
      void apiClient
        .delete(`/api/recommendations/${normalizedId}`)
        .catch(() => addRecommendation(normalizedId));
    }
  };

  return (
    <Pressable onPress={handlePress} style={[styles.iconButton, style]}>
      <Ionicons
        name={isActive ? "thumbs-up" : "thumbs-up-outline"}
        size={16}
        color={colors.white}
      />
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.accentOrange,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
