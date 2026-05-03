import AppAvatar from "@/src/components/ui/AppAvatar";
import { colors } from "@/src/constants/colors";
import type { BusinessDetailsReview } from "@/src/features/businesses/types/business.types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { styles } from "./ReviewCard.styles";

type Props = {
  review: BusinessDetailsReview;
  variant?: "default" | "preview";
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ReviewCard({ review, variant = "default" }: Props) {
  const isPreview = variant === "preview";
  const showPhotos = !isPreview && !!review.photos?.length;

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  const closePhotoModal = () => {
    setSelectedPhotoIndex(null);
  };

  return (
    <View style={[styles.container, isPreview && styles.containerPreview]}>
      <View style={styles.header}>
        <AppAvatar
          name={review.authorName}
          imageUrl={review.authorAvatar}
          size={isPreview ? "sm" : "md"}
        />

        <View style={styles.authorInfo}>
          <Text
            style={[styles.authorName, isPreview && styles.authorNamePreview]}
            numberOfLines={1}
          >
            {review.authorName}
          </Text>

          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index < Math.round(review.rating);

              return (
                <MaterialIcons
                  key={index}
                  name={isFilled ? "star" : "star-border"}
                  size={isPreview ? 11 : 14}
                  color={colors.primaryGreen}
                />
              );
            })}
          </View>
        </View>
      </View>

      <Text
        style={[styles.text, isPreview && styles.textPreview]}
        numberOfLines={isPreview ? 4 : 3}
      >
        {review.text}
      </Text>

      {showPhotos ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosScroll}
        >
          {review.photos?.map((photo, index) => (
            <Pressable
              key={photo.id}
              onPress={() => setSelectedPhotoIndex(index)}
              style={styles.photoItem}
            >
              <Image source={{ uri: photo.url }} style={styles.reviewPhoto} />
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {isPreview ? <Text style={styles.moreText}>More</Text> : null}

      <Modal
        visible={selectedPhotoIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={closePhotoModal}
      >
        <View style={styles.photoModal}>
          <Pressable style={styles.photoModalClose} onPress={closePhotoModal}>
            <Ionicons name="close" size={24} color={colors.white} />
          </Pressable>

          <FlatList
            data={review.photos ?? []}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(photo) => photo.id}
            initialScrollIndex={selectedPhotoIndex ?? 0}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            renderItem={({ item }) => (
              <Pressable
                style={styles.photoModalPage}
                onPress={closePhotoModal}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.photoModalImage}
                  resizeMode="contain"
                />
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
