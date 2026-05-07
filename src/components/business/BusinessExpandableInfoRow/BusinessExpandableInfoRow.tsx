import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
    LayoutAnimation,
    Platform,
    Pressable,
    Text,
    UIManager,
    View,
} from "react-native";
import { styles } from "./BusinessExpandableInfoRow.styles";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  numberOfLines?: number;
  children?: ReactNode;
  isLast?: boolean;
  statusText?: string;
  statusColor?: string;
};

export default function BusinessExpandableInfoRow({
  icon,
  title,
  value,
  isExpanded = false,
  onToggle,
  numberOfLines,
  children,
  isLast = false,
  statusText,
  statusColor,
}: Props) {
  const isExpandable = Boolean(onToggle);

  const handlePress = () => {
    if (!onToggle) return;

    LayoutAnimation.configureNext({
      duration: 180,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    onToggle();
  };

  return (
    <View style={[styles.container, isLast ? styles.containerLast : null]}>
      <Pressable
        style={[styles.row, isExpanded && children ? styles.rowExpanded : null]}
        onPress={handlePress}
        disabled={!isExpandable}
      >
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} style={styles.icon} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          <Text
            style={styles.value}
            numberOfLines={numberOfLines}
            ellipsizeMode="tail"
          >
            {statusText ? (
              <>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {statusText}
                </Text>

                <Text>{value ? ` · ${value}` : ""}</Text>
              </>
            ) : (
              value
            )}
          </Text>
        </View>

        {isExpandable ? (
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            style={styles.chevron}
          />
        ) : null}
      </Pressable>

      {isExpanded && children ? (
        <View style={styles.expandedContent}>{children}</View>
      ) : null}
    </View>
  );
}
