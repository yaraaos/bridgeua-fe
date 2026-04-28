import type { BusinessDetailsImage } from "@/src/features/businesses/types/business.types";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./BusinessHeroGallery.styles";

type Props = {
  images: BusinessDetailsImage[];
  onPressImage?: (imageId: string) => void;
  onPressViewAll?: () => void;
};

export default function BusinessHeroGallery({
  images,
  onPressImage,
  onPressViewAll,
}: Props) {
  const mainImage = images[0];
  const sideImages = images.slice(1, 3);

  if (!mainImage) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.mainImageWrap}
        onPress={() => onPressImage?.(mainImage.id)}
      >
        <Image source={{ uri: mainImage.url }} style={styles.mainImage} />
      </Pressable>

      <View style={styles.sideColumn}>
        {sideImages.map((image, index) => {
          const isLastVisibleImage = index === sideImages.length - 1;

          return (
            <Pressable
              key={image.id}
              style={styles.sideImageWrap}
              onPress={() => onPressImage?.(image.id)}
            >
              <Image source={{ uri: image.url }} style={styles.sideImage} />

              {isLastVisibleImage ? (
                <Pressable style={styles.viewAllOverlay} onPress={onPressViewAll}>
                  <Text style={styles.viewAllText}>View all</Text>
                </Pressable>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}