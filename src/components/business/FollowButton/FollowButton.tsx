import { Pressable, Text, ViewStyle } from "react-native";
import { useFollowingStore } from "@/src/store/following.store";
import { styles } from "./FollowButton.styles";

type FollowButtonProps = {
  businessId: string | number;
  style?: ViewStyle;
};

export default function FollowButton({
  businessId,
  style,
}: FollowButtonProps) {
  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds
  );
  const toggleFollowBusiness = useFollowingStore(
    (state) => state.toggleFollowBusiness
  );

  const normalizedId = String(businessId);
  const isFollowing = followedBusinessIds.includes(normalizedId);

  return (
    <Pressable
      onPress={() => toggleFollowBusiness(normalizedId)}
      style={[
        styles.button,
        isFollowing ? styles.buttonActive : styles.buttonInactive,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          isFollowing ? styles.buttonTextActive : styles.buttonTextInactive,
        ]}
      >
        {isFollowing ? "Following" : "Follow"}
      </Text>
    </Pressable>
  );
}