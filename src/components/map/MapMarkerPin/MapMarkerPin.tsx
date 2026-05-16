import { useAppTheme } from "@/src/hooks/useAppTheme";
import React from "react";
import { Image, View } from "react-native";
import { createStyles } from "./MapMarkerPin.styles";

type Props = {
  imageUrl: string;
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

  return (
    <View style={styles.wrapper} collapsable={false}>
      <View style={[styles.pin, { borderColor }]} collapsable={false}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          onLoad={onImageLoad}
          onError={onImageLoad}
        />
      </View>

      <View style={[styles.tail, { borderTopColor: borderColor }]} />
    </View>
  );
}