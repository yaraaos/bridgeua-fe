//src/components/profile/BusinessProfileHeader/BusinessProfileHeader.tsx

import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import styles from "./BusinessProfileHeader.styles";

export type BusinessProfileHeaderProps = {
  username: string;
  businessName: string;
  category: string;
  location: string;
  avatarUrl?: string;
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  businessesCount?: number;
  onBackPress?: () => void;
  onSettingsPress?: () => void;
  onViewPublicPagePress?: () => void;
  onPromotionsPress?: () => void;
};

export default function BusinessProfileHeader({
  username,
  businessName,
  category,
  location,
  avatarUrl,
  followersCount,
  followingCount,
  reviewsCount,
  businessesCount = 1,
  onBackPress,
  onSettingsPress,
  onViewPublicPagePress,
  onPromotionsPress,
}: BusinessProfileHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <Pressable onPress={onBackPress} hitSlop={10}>
          <Feather name="chevron-left" size={22} color="#222222" />
        </Pressable>

        <Text style={styles.username}>{username}</Text>

        <Pressable onPress={onSettingsPress} hitSlop={10}>
          <Feather name="settings" size={20} color="#1F5E46" />
        </Pressable>
      </View>

      <View style={styles.profileRow}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="storefront" size={26} color="#1F5E46" />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.businessName}>{businessName}</Text>
          <Text style={styles.subInfo}>
            {category} / {location}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.secondaryButton} onPress={onViewPublicPagePress}>
          <Feather name="eye" size={14} color="#222222" />
          <Text style={styles.secondaryButtonText}>View public page</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onPromotionsPress}>
          <MaterialIcons name="campaign" size={14} color="#222222" />
          <Text style={styles.secondaryButtonText}>Promotions</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followersCount}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{reviewsCount}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{businessesCount}</Text>
          <Text style={styles.statLabel}>Businesses</Text>
        </View>
      </View>
    </View>
  );
}