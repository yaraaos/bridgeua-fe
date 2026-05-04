import { colors } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
} from "react-native";
import { styles } from "./ImageGalleryModal.styles";

type Props = {
  images: { id: string; url: string }[];
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ImageGalleryModal({
  images,
  visible,
  initialIndex = 0,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
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
          renderItem={({ item }) => (
            <Pressable style={styles.page} onPress={onClose}>
              <Image
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="contain"
              />
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}