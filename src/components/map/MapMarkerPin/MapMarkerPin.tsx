import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, View } from "react-native";
import { createStyles } from "./MapMarkerPin.styles";

type Props = {
  imageUrl?: string | null;
  isFollowed?: boolean;
  onImageLoad?: () => void;
};

export default function MapMarkerPin({
  imageUrl,
  isFollowed = false,
  onImageLoad,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const borderColor = isFollowed
    ? colors.accentOrange
    : colors.primaryGreenSoft;

  const safeImageUrl = typeof imageUrl === "string" ? imageUrl.trim() : "";

  return (
    <View style={styles.wrapper} collapsable={false}>
      <View style={[styles.pin, { borderColor }]} collapsable={false}>
        {safeImageUrl ? (
          <Image
            source={{ uri: safeImageUrl }}
            style={styles.image}
            onLoad={onImageLoad}
            onError={onImageLoad}
          />
        ) : (
          <View
            style={[styles.image, styles.fallback]}
            onLayout={onImageLoad}
          >
            <Feather name="map-pin" size={16} color={colors.primaryGreen} />
          </View>
        )}
      </View>

      <View style={[styles.tail, { borderTopColor: borderColor }]} />
    </View>
  );
}