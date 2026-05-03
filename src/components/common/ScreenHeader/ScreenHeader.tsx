import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { colors } from "../../../constants/colors";
import { LocationOption } from "../../../constants/locations";
import AppInput from "../../ui/AppInput/AppInput";
import GradientHeader from "../../ui/GradientHeader/GradientHeader";
import { LocationSelector } from "../index";
import { styles } from "./ScreenHeader.styles";

type ActionType = "map" | "filter" | "add";

type Props = {
  variant?: "default" | "business";

  title: string;
  titleSubtitle?: string;

  subtitleLabel?: string;
  subtitleValue?: string;
  onSubtitlePress?: () => void;
  showSubtitleChevron?: boolean;

  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChangeText?: (text: string) => void;

  actions?: ActionType[];
  onPressMap?: () => void;
  onPressFilter?: () => void;
  onPressAdd?: () => void;

  gradientColors?: readonly [string, string, ...string[]];

  locationOptions?: LocationOption[];
  onSelectLocationOption?: (option: LocationOption) => void;
  onRequestNearby?: () => void;

  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  location?: string;
  isOpen?: boolean;
  closesAt?: string;
  rightSlot?: React.ReactNode;
  onPressShare?: () => void;
};

export default function ScreenHeader({
  variant = "default",
  title,
  titleSubtitle,
  subtitleLabel,
  subtitleValue,
  onSubtitlePress,
  showSubtitleChevron = false,
  showSearch = false,
  searchPlaceholder = "Search",
  searchValue,
  onSearchChangeText,
  actions = [],
  onPressMap,
  onPressFilter,
  onPressAdd,
  gradientColors,
  locationOptions,
  onSelectLocationOption,
  onRequestNearby,
  imageUrl,
  rating,
  reviewCount,
  category,
  location,
  isOpen,
  closesAt,
  rightSlot,
  onPressShare,
}: Props) {
  const hasSubtitle = !!subtitleLabel || !!subtitleValue;
  const showLocationSelector =
    !!locationOptions && !!onSelectLocationOption && !!onRequestNearby;

  const renderActionIcon = (action: ActionType) => {
    if (action === "map") {
      return <Feather name="map" size={16} color={colors.white} />;
    }

    if (action === "filter") {
      return <Ionicons name="options-outline" size={16} color={colors.white} />;
    }

    return <AntDesign name="plus" size={16} color={colors.white} />;
  };

  const handleActionPress = (action: ActionType) => {
    if (action === "map") {
      onPressMap?.();
      return;
    }

    if (action === "filter") {
      onPressFilter?.();
      return;
    }

    onPressAdd?.();
  };

  if (variant === "business") {
    return (
      <GradientHeader colors={gradientColors}>
        <View style={styles.businessHeaderRow}>
          {!!imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.businessLogo} />
          )}

          <View style={styles.businessInfo}>
            <View style={styles.businessTitleRow}>
              <Text style={styles.businessTitle} numberOfLines={2}>
                {title}
              </Text>

              <View style={styles.businessInlineActions}>
                {rightSlot}

                <Pressable
                  style={styles.businessIconButton}
                  onPress={onPressShare}
                >
                  <Ionicons
                    name="share-outline"
                    size={18}
                    color={colors.primaryGreen}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.businessRatingRow}>
              {typeof rating === "number" &&
                Array.from({ length: 5 }).map((_, index) => (
                  <MaterialIcons
                    key={index}
                    name={index < Math.round(rating) ? "star" : "star-border"}
                    size={14}
                    color={colors.accentOrange}
                  />
                ))}

              {typeof rating === "number" && (
                <Text style={styles.businessRatingValue}>
                  {rating.toFixed(1)}
                </Text>
              )}

              {typeof reviewCount === "number" && (
                <Text style={styles.businessReviewText}>
                  ({reviewCount} reviews)
                </Text>
              )}
            </View>

            {!!category && <Text style={styles.businessMeta}>{category}</Text>}
            {!!location && <Text style={styles.businessMeta}>{location}</Text>}

            {typeof isOpen === "boolean" && (
              <Text style={styles.businessStatus}>
                {isOpen ? "Open" : "Closed"}
                {!!closesAt ? ` · Closes at ${closesAt}` : ""}
              </Text>
            )}
          </View>
        </View>
      </GradientHeader>
    );
  }

  return (
    <GradientHeader colors={gradientColors}>
      <View style={styles.topRow}>
        {showLocationSelector ? (
          <View style={styles.leftBlock}>
            <LocationSelector
              subtitleLabel={subtitleLabel}
              label={subtitleValue}
              value={
                locationOptions.find((item) => item.label === subtitleValue)
                  ?.value
              }
              options={locationOptions}
              onSelectManual={onSelectLocationOption}
              onRequestNearby={onRequestNearby}
              showChevron={showSubtitleChevron}
            />
          </View>
        ) : hasSubtitle ? (
          onSubtitlePress ? (
            <Pressable style={styles.leftBlock} onPress={onSubtitlePress}>
              {!!subtitleLabel && (
                <Text style={styles.subtitleLabel}>{subtitleLabel}</Text>
              )}

              {!!subtitleValue && (
                <View style={styles.subtitleRow}>
                  <Text style={styles.subtitleValue}>{subtitleValue}</Text>

                  {showSubtitleChevron && (
                    <Ionicons
                      name="chevron-down"
                      size={14}
                      color={colors.textSecondary}
                    />
                  )}
                </View>
              )}
            </Pressable>
          ) : (
            <View style={styles.leftBlock}>
              {!!subtitleLabel && (
                <Text style={styles.subtitleLabel}>{subtitleLabel}</Text>
              )}

              {!!subtitleValue && (
                <View style={styles.subtitleRow}>
                  <Text style={styles.subtitleValue}>{subtitleValue}</Text>
                </View>
              )}
            </View>
          )
        ) : (
          <View style={styles.leftBlock} />
        )}

        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>

          {!!titleSubtitle && (
            <Text style={styles.titleSubtitle}>{titleSubtitle}</Text>
          )}
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <AppInput
              value={searchValue}
              onChangeText={onSearchChangeText}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {actions.map((action) => (
            <Pressable
              key={action}
              style={styles.actionButton}
              onPress={() => handleActionPress(action)}
            >
              {renderActionIcon(action)}
            </Pressable>
          ))}
        </View>
      )}
    </GradientHeader>
  );
}
