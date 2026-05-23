import { AuthRequiredModal, useRequireAuth } from "@/src/features/auth";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFollowingStore } from "@/src/store/following.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { createStyles } from "./FollowButton.styles";

type FollowButtonProps = {
  businessId: string | number;
  size?: "sm" | "md" | "icon";
  variant?: "filled" | "outline" | "soft";
  style?: StyleProp<ViewStyle>;
};

export default function FollowButton({
  businessId,
  size = "sm",
  variant = "outline",
  style,
}: FollowButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { isAuthModalVisible, closeAuthModal, confirmAuthModal, requireAuth } =
    useRequireAuth();

  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );
  const toggleFollowBusiness = useFollowingStore(
    (state) => state.toggleFollowBusiness,
  );

  const normalizedId = String(businessId);
  const isFollowing = followedBusinessIds.includes(normalizedId);

  const handlePress = () => {
    requireAuth(() => toggleFollowBusiness(normalizedId), {
      action: "follow",
    });
  };

  const useFilledStyle = variant === "filled" || isFollowing;

  if (size === "icon") {
    return (
      <>
        <Pressable onPress={handlePress} style={[styles.iconButton, style]}>
          <Ionicons
            name={isFollowing ? "heart" : "heart-outline"}
            size={16}
            color={colors.white}
          />
        </Pressable>

        <AuthRequiredModal
          visible={isAuthModalVisible}
          onClose={closeAuthModal}
          onConfirm={confirmAuthModal}
        />
      </>
    );
  }

  return (
    <>
      <Pressable
        onPress={handlePress}
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

      <AuthRequiredModal
        visible={isAuthModalVisible}
        onClose={closeAuthModal}
        onConfirm={confirmAuthModal}
      />
    </>
  );
}
