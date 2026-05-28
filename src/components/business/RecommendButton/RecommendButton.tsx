import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import { apiClient } from "@/src/services/api/client";
import { useRecommendationsStore } from "@/src/store/recommendations.store";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

type Props = {
  businessId: string | number;
  style?: StyleProp<ViewStyle>;
};

export default function RecommendButton({ businessId, style }: Props) {
  const { colors } = useAppTheme();

  const isRecommended = useRecommendationsStore((state) => state.isRecommended);
  const addRecommendation = useRecommendationsStore((state) => state.addRecommendation);
  const removeRecommendation = useRecommendationsStore((state) => state.removeRecommendation);
  const setRecommendations = useRecommendationsStore((state) => state.setRecommendations);

  const { business: myBusiness } = useMyBusinessProfile();

  const normalizedId = String(businessId);
  const isActive = isRecommended(normalizedId);

  useEffect(() => {
    apiClient
      .get("/api/recommendations/mine")
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setRecommendations(res.data.map(String));
        }
      })
      .catch(() => {});
  }, []);

  const handlePress = () => {
    if (!isActive) {
      addRecommendation(normalizedId);
      apiClient.post("/api/recommendations", { businessId: normalizedId }).catch(() => {});
    } else {
      removeRecommendation(normalizedId);
      apiClient.delete(`/api/recommendations/${normalizedId}`).catch(() => {});
    }
  };

  const styles = StyleSheet.create({
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.accentOrange,
      alignItems: "center",
      justifyContent: "center",
    },
  });

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
