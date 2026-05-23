import { LocationOption } from "@/src/constants/locations";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import AppInput from "../../ui/AppInput/AppInput";
import RatingStars from "../../ui/AppRatingStars";
import GradientHeader from "../../ui/GradientHeader/GradientHeader";
import { LocationSelector } from "../index";
import { createStyles } from "./ScreenHeader.styles";

type ActionType = "map" | "filter";

type Props = {
  variant?: "default" | "business" | "profile";

  title: string;
  titleSubtitle?: string;

  onBack?: () => void;

  subtitleLabel?: string;
  subtitleValue?: string;
  onSubtitlePress?: () => void;
  showSubtitleChevron?: boolean;

  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChangeText?: (text: string) => void;
  searchAutoFocus?: boolean;
  onPressSearch?: () => void;

  activeFilterCount?: number;

  actions?: ActionType[];
  onPressMap?: () => void;
  onPressFilter?: () => void;

  gradientColors?: readonly [string, string, ...string[]];

  locationOptions?: LocationOption[];
  onSelectLocationOption?: (option: LocationOption) => void;
  onRequestNearby?: () => void;

  headerInnerStyle?: StyleProp<ViewStyle>;

  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  location?: string;
  isOpen?: boolean;
  closesAt?: string;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  onPressShare?: () => void;
  onPressBack?: () => void;

  profileContent?: React.ReactNode;
  bottomSlot?: React.ReactNode;
};

export default function ScreenHeader({
  variant = "default",
  title,
  titleSubtitle,
  onBack,
  subtitleLabel,
  subtitleValue,
  onSubtitlePress,
  showSubtitleChevron = false,
  showSearch = false,
  searchPlaceholder = "Search",
  searchValue,
  onSearchChangeText,
  searchAutoFocus = false,
  onPressSearch,
  actions = [],
  activeFilterCount = 0,
  onPressMap,
  onPressFilter,
  gradientColors,
  locationOptions,
  onSelectLocationOption,
  onRequestNearby,
  headerInnerStyle,
  imageUrl,
  rating,
  reviewCount,
  category,
  location,
  isOpen,
  closesAt,
  rightSlot,
  leftSlot,
  onPressShare,
  onPressBack,
  profileContent,
  bottomSlot,
}: Props) {
  const { colors, isDark } = useAppTheme();
  const styles = createStyles(colors);
  const [titleLines, setTitleLines] = useState(1);
  const headerGradientColors =
    isDark && gradientColors
      ? (["#102019", "#183327", "#0F1A16"] as const)
      : gradientColors;
  const businessHeaderHeight =
    titleLines >= 3 ? 188 : titleLines === 2 ? 158 : 133;

  const hasSubtitle = !!subtitleLabel || !!subtitleValue;
  const showLocationSelector =
    !!locationOptions && !!onSelectLocationOption && !!onRequestNearby;

  const renderActionIcon = (action: ActionType) => {
    if (action === "map") {
      return <Feather name="map" size={16} color={colors.white} />;
    }

    return (
      <View style={styles.filterIconWrap}>
        <Ionicons name="options-outline" size={16} color={colors.white} />

        {activeFilterCount > 0 ? (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const handleActionPress = (action: ActionType) => {
    if (action === "map") {
      onPressMap?.();
      return;
    }

    onPressFilter?.();
  };

  if (variant === "business") {
    return (
      <GradientHeader
        colors={headerGradientColors}
        innerStyle={[
          styles.businessHeaderInner,
          { height: businessHeaderHeight },
        ]}
      >
        <View style={styles.businessContent}>
          <View
            style={[
              styles.businessInfoWrap,
              {
                paddingBottom: titleLines >= 3 ? 10 : 0,
              },
            ]}
          >
            <Text
              style={styles.businessTitle}
              numberOfLines={3}
              onTextLayout={(event) => {
                setTitleLines(event.nativeEvent.lines.length);
              }}
            >
              {title}
            </Text>

            <View style={styles.businessRatingRow}>
              {typeof rating === "number" ? (
                <RatingStars rating={rating} size={18} />
              ) : null}

              {typeof rating === "number" ? (
                <Text style={styles.businessRatingValue}>
                  {rating.toFixed(1)}
                </Text>
              ) : null}

              {typeof reviewCount === "number" ? (
                <Text style={styles.businessReviewText}>
                  ({reviewCount} reviews)
                </Text>
              ) : null}
            </View>

            <View style={styles.businessMetaRow}>
              {!!category ? (
                <Text style={styles.businessMeta}>{category}</Text>
              ) : null}

              {!!category && !!location ? (
                <Text style={styles.businessMetaDivider}>•</Text>
              ) : null}

              {!!location ? (
                <Text style={styles.businessMeta} numberOfLines={1}>
                  {location}
                </Text>
              ) : null}
            </View>

            {typeof isOpen === "boolean" ? (
              <View style={styles.businessStatusRow}>
                <Text style={styles.businessStatus}>
                  {isOpen ? "Open" : "Closed"}
                </Text>

                {!!closesAt ? (
                  <>
                    <Text style={styles.businessStatusSeparator}>•</Text>

                    <Text style={styles.businessStatusMuted}>
                      Closes at {closesAt}
                    </Text>
                  </>
                ) : null}
              </View>
            ) : null}
          </View>

          <View style={styles.businessImageWrap}>
            {!!imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.businessImage} />
            ) : (
              <View style={styles.businessImageFallback}>
                <Ionicons
                  name="storefront-outline"
                  size={30}
                  color={colors.primaryGreen}
                />
              </View>
            )}
          </View>

          <View style={styles.businessActionsColumn}>
            {rightSlot}

            <Pressable style={styles.actionButton} onPress={onPressShare}>
              <Ionicons name="share-outline" size={16} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </GradientHeader>
    );
  }

  if (variant === "profile") {
    return (
      <GradientHeader
        colors={headerGradientColors}
        innerStyle={styles.profileHeaderInner}
      >
        <View style={styles.profileHeaderContent}>{profileContent}</View>
      </GradientHeader>
    );
  }

  return (
    <GradientHeader colors={headerGradientColors} innerStyle={headerInnerStyle}>
      <View style={styles.topRow}>
        {leftSlot ? (
          <View style={styles.leftBlock}>{leftSlot}</View>
        ) : showLocationSelector ? (
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
        ) : onBack ? (
          <Pressable
            style={styles.backButton}
            onPress={onPressBack ?? (() => router.back())}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={colors.textPrimary}
            />
          </Pressable>
        ) : (
          <View style={styles.leftBlock} />
        )}

        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>

          {!!titleSubtitle && (
            <Text style={styles.titleSubtitle}>{titleSubtitle}</Text>
          )}
          {rightSlot ? <View>{rightSlot}</View> : null}
        </View>
      </View>

      {bottomSlot ? (
        <View style={styles.bottomSlotRow}>{bottomSlot}</View>
      ) : null}

      {!bottomSlot && showSearch && (
        <View style={styles.searchRow}>
          {onPressSearch ? (
            <Pressable style={styles.searchInputWrap} onPress={onPressSearch}>
              <View pointerEvents="none">
                <AppInput
                  value={searchValue}
                  onChangeText={onSearchChangeText}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  autoFocus={searchAutoFocus}
                  onSubmitEditing={() => {
                    if (searchValue?.trim()) {
                      router.push({
                        pathname: "/search/results" as never,
                        params: { query: searchValue.trim() },
                      });
                    }
                  }}
                />
              </View>
            </Pressable>
          ) : (
            <View style={styles.searchInputWrap}>
              <AppInput
                value={searchValue}
                onChangeText={onSearchChangeText}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.textSecondary}
                autoFocus={searchAutoFocus}
              />
            </View>
          )}

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
