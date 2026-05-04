import { colors } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Image as RNImage,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { styles } from "./ImageGalleryModal.styles";

type Props = {
  images: { id: string; url: string }[];
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
  overlayIndex?: number;
  overlayText?: string;
  onPressOverlay?: () => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const IMAGE_MAX_WIDTH = SCREEN_WIDTH * 0.92;
const IMAGE_MAX_HEIGHT = SCREEN_HEIGHT * 0.75;

type DisplaySize = {
  width: number;
  height: number;
};

function GalleryImagePage({
  item,
  index,
  overlayIndex,
  overlayText,
  onPressOverlay,
  onClose,
}: {
  item: { id: string; url: string };
  index: number;
  overlayIndex?: number;
  overlayText: string;
  onPressOverlay?: () => void;
  onClose: () => void;
}) {
  const [displaySize, setDisplaySize] = useState<DisplaySize>({
    width: IMAGE_MAX_WIDTH,
    height: IMAGE_MAX_HEIGHT,
  });

  const shouldShowOverlay = overlayIndex === index && !!onPressOverlay;

  useEffect(() => {
    RNImage.getSize(
      item.url,
      (imageWidth, imageHeight) => {
        const widthRatio = IMAGE_MAX_WIDTH / imageWidth;
        const heightRatio = IMAGE_MAX_HEIGHT / imageHeight;
        const scale = Math.min(widthRatio, heightRatio);

        setDisplaySize({
          width: imageWidth * scale,
          height: imageHeight * scale,
        });
      },
      () => {
        setDisplaySize({
          width: IMAGE_MAX_WIDTH,
          height: IMAGE_MAX_HEIGHT,
        });
      },
    );
  }, [item.url]);

  const imageWrapStyle = useMemo(
    () => [
      styles.imageWrap,
      {
        width: displaySize.width,
        height: displaySize.height,
      },
    ],
    [displaySize],
  );

  return (
    <Pressable style={styles.page} onPress={onClose}>
      <Pressable style={imageWrapStyle} onPress={() => {}}>
        <Image
          source={{ uri: item.url }}
          style={styles.image}
          resizeMode="contain"
        />

        {shouldShowOverlay ? (
          <Pressable style={styles.viewAllOverlay} onPress={onPressOverlay}>
            <Text style={styles.viewAllText}>{overlayText}</Text>
          </Pressable>
        ) : null}
      </Pressable>
    </Pressable>
  );
}

export default function ImageGalleryModal({
  images,
  visible,
  initialIndex = 0,
  onClose,
  overlayIndex,
  overlayText = "View all",
  onPressOverlay,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable style={styles.close} onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.white} />
        </Pressable>

        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <GalleryImagePage
              item={item}
              index={index}
              overlayIndex={overlayIndex}
              overlayText={overlayText}
              onPressOverlay={onPressOverlay}
              onClose={onClose}
            />
          )}
        />
      </View>
    </Modal>
  );
}