import { FollowButton } from "@/src/components/business";
import RecommendButton from "@/src/components/business/RecommendButton";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Business } from "@/src/types/business";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  Share,
  Text,
  View,
} from "react-native";
import { createStyles } from "./MapBusinessCallout.styles";

type Props = {
  business: Business;
  onPressDetails: () => void;
  onClose: () => void;
  isOwned?: boolean;
  isBusinessAccount?: boolean;
};

export default function MapBusinessCallout({
  business,
  onPressDetails,
  onClose,
  isOwned = false,
  isBusinessAccount = false,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { latitude, longitude } = business.coordinates;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const handleGetDirections = async () => {
    const nativeUrl = Platform.select({
      ios: `maps://?daddr=${latitude},${longitude}&dirflg=d`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: directionsUrl,
    }) as string;

    try {
      const supported = await Linking.canOpenURL(nativeUrl);
      await Linking.openURL(supported ? nativeUrl : directionsUrl);
    } catch {
      Alert.alert(
        "Unable to open maps",
        "Could not launch your default maps app.",
      );
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${business.name} on BridgeUA\n${directionsUrl}`,
      });
    } catch (error) {
      console.error("Share failed", error);
    }
  };

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        hitSlop={12}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={18} color={colors.textSecondary} />
      </Pressable>

      <Pressable style={styles.body} onPress={onPressDetails}>
        <Image
          source={{
            uri: business.avatarUrl ?? business.image,
          }}
          style={styles.image}
        />

        <View style={styles.textContent}>
          <Text style={styles.name} numberOfLines={1}>
            {business.name}
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={colors.accentOrange} />

            <Text style={styles.ratingText}>{business.rating.toFixed(1)}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText} numberOfLines={1}>
              {business.category}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText} numberOfLines={1}>
              {business.location}
            </Text>
          </View>

          {business.distanceKm != null ? (
            <View style={styles.distanceRow}>
              <Feather name="map-pin" size={12} color={colors.textMuted} />
              <Text style={styles.distanceText}>
                {business.distanceKm} km away
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      <View style={styles.actionsRow}>
        <Pressable
          style={styles.directionsButton}
          onPress={handleGetDirections}
        >
          <Feather name="navigation" size={16} color={colors.white} />

          <Text style={styles.directionsLabel}>Get directions</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share"
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Feather name="share-2" size={18} color={colors.white} />
        </Pressable>

        {isOwned ? null : isBusinessAccount ? (
          <RecommendButton businessId={String(business.id)} />
        ) : (
          <FollowButton
            businessId={String(business.id)}
            size="icon"
            variant="soft"
          />
        )}
      </View>
    </View>
  );
}
