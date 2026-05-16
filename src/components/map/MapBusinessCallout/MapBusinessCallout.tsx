import { FollowButton } from "@/src/components/business";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Business } from "@/src/types/business";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Image, Linking, Platform, Pressable, Text, View } from "react-native";
import { createStyles } from "./MapBusinessCallout.styles";

type Props = {
  business: Business;
  onPressDetails: () => void;
  onClose: () => void;
};

export default function MapBusinessCallout({
  business,
  onPressDetails,
  onClose,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { latitude, longitude } = business.coordinates;

  const handleGetDirections = async () => {
    const httpsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    const nativeUrl = Platform.select({
      ios: `maps://?daddr=${latitude},${longitude}&dirflg=d`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: httpsUrl,
    }) as string;

    try {
      const supported = await Linking.canOpenURL(nativeUrl);
      await Linking.openURL(supported ? nativeUrl : httpsUrl);
    } catch {
      Alert.alert(
        "Unable to open maps",
        "Could not launch your default maps app.",
      );
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
        <Image source={{ uri: business.image }} style={styles.image} />

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

          <View style={styles.distanceRow}>
            <Feather name="map-pin" size={12} color={colors.textMuted} />

            <Text style={styles.distanceText}>
              {business.distanceKm} km away
            </Text>
          </View>
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

        <FollowButton
          businessId={String(business.id)}
          size="icon"
          variant="soft"
        />
      </View>
    </View>
  );
}