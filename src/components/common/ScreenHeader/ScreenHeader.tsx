import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../../constants/colors";
import AppInput from "../../ui/AppInput/AppInput";
import GradientHeader from "../../ui/GradientHeader/GradientHeader";
import { styles } from "./ScreenHeader.styles";

type ActionType = "map" | "filter" | "add";

type Props = {
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
};

export default function ScreenHeader({
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
}: Props) {
  const hasSubtitle = !!subtitleLabel || !!subtitleValue;

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

  return (
    <GradientHeader colors={gradientColors}>
      <View style={styles.topRow}>
        {hasSubtitle ? (
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
