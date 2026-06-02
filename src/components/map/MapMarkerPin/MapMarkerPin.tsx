import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";
import { createStyles } from "./MapMarkerPin.styles";

type Props = {
  imageUrl?: string | null;
  isFollowed?: boolean;
  isOwned?: boolean;
  onImageLoad?: () => void;
};

export default function MapMarkerPin({
  imageUrl,
  isFollowed = false,
  isOwned = false,
  onImageLoad,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const borderColor = isOwned
    ? colors.statTilePurple
    : isFollowed
      ? colors.accentOrange
      : colors.primaryGreenSoft;

  const safeImageUrl = typeof imageUrl === "string" ? imageUrl.trim() : "";

  return (
    <View
      style={[styles.wrapper, isOwned && styles.wrapperOwned]}
      collapsable={false}
    >
      {isOwned ? (
        <View style={styles.ownedBadge} collapsable={false}>
          <Text style={styles.ownedBadgeText}>Your business</Text>
        </View>
      ) : null}

      <View
        style={[styles.pin, isOwned && styles.pinOwned, { borderColor }]}
        collapsable={false}
      >
        {safeImageUrl ? (
          <Image
            source={{ uri: safeImageUrl }}
            style={styles.image}
            onLoad={onImageLoad}
            onError={onImageLoad}
          />
        ) : (
          <View style={[styles.image, styles.fallback]} onLayout={onImageLoad}>
            <Feather name="map-pin" size={16} color={colors.primaryGreen} />
          </View>
        )}
      </View>

      <View style={[styles.tail, { borderTopColor: borderColor }]} />
    </View>
  );
}