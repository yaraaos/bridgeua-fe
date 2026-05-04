import ImageGalleryModal from "@/src/components/common/ImageGalleryModal/ImageGalleryModal";
import type {
    BusinessDetailsImage,
    BusinessReviewPhoto,
} from "@/src/features/businesses/types/business.types";
import React, { useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./BusinessGalleryGrid.styles";

type PhotoTab = "all" | "business" | "reviews";

type GalleryPhoto = {
  id: string;
  url: string;
  source: "business" | "review";
};

type Props = {
  businessPhotos: BusinessDetailsImage[];
  reviewPhotos: BusinessReviewPhoto[];
};

const PHOTO_TABS: { label: string; value: PhotoTab }[] = [
  { label: "All", value: "all" },
  { label: "Business", value: "business" },
  { label: "Reviews", value: "reviews" },
];

export default function BusinessGalleryGrid({
  businessPhotos,
  reviewPhotos,
}: Props) {
  const [activeTab, setActiveTab] = useState<PhotoTab>("all");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  const allPhotos = useMemo<GalleryPhoto[]>(
    () => [
      ...businessPhotos.map((photo) => ({
        ...photo,
        source: "business" as const,
      })),
      ...reviewPhotos.map((photo) => ({
        ...photo,
        source: "review" as const,
      })),
    ],
    [businessPhotos, reviewPhotos],
  );

  const visiblePhotos = useMemo(() => {
    if (activeTab === "business") {
      return allPhotos.filter((photo) => photo.source === "business");
    }

    if (activeTab === "reviews") {
      return allPhotos.filter((photo) => photo.source === "review");
    }

    return allPhotos;
  }, [activeTab, allPhotos]);

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {PHOTO_TABS.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <Pressable
              key={tab.value}
              onPress={() => setActiveTab(tab.value)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.grid}>
        {visiblePhotos.map((photo, index) => (
          <Pressable
            key={photo.id}
            style={styles.photoWrap}
            onPress={() => setSelectedPhotoIndex(index)}
          >
            <Image source={{ uri: photo.url }} style={styles.photo} />
          </Pressable>
        ))}
      </View>

      <ImageGalleryModal
        images={visiblePhotos}
        visible={selectedPhotoIndex !== null}
        initialIndex={selectedPhotoIndex ?? 0}
        onClose={() => setSelectedPhotoIndex(null)}
      />
    </View>
  );
}
