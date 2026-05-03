import { useFollowingStore } from "@/src/store/following.store";
import React from "react";
import { Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { styles } from "./FollowButton.styles";

type FollowButtonProps = {
  businessId: string | number;
  size?: "sm" | "md";
  variant?: "filled" | "outline";
  style?: StyleProp<ViewStyle>;
};

export default function FollowButton({
  businessId,
  size = "sm",
  variant = "outline",
  style,
}: FollowButtonProps) {
  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );
  const toggleFollowBusiness = useFollowingStore(
    (state) => state.toggleFollowBusiness,
  );

  const normalizedId = String(businessId);
  const isFollowing = followedBusinessIds.includes(normalizedId);

  const useFilledStyle = variant === "filled" || isFollowing;

  return (
    <Pressable
      onPress={() => toggleFollowBusiness(normalizedId)}
      style={[
        styles.button,
        size === "sm" ? styles.buttonSm : styles.buttonMd,
        useFilledStyle ? styles.buttonFilled : styles.buttonOutline,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          size === "sm" ? styles.buttonTextSm : styles.buttonTextMd,
          useFilledStyle ? styles.buttonTextFilled : styles.buttonTextOutline,
        ]}
      >
        {isFollowing ? "Following" : "Follow"}
      </Text>
    </Pressable>
  );
}
