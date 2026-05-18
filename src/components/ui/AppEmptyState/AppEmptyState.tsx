import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/src/hooks/useAppTheme";

import { createStyles } from "./AppEmptyState.styles";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export default function AppEmptyState({
  title,
  description,
  actionLabel,
  onPressAction,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      {actionLabel && onPressAction ? (
        <Pressable style={styles.actionButton} onPress={onPressAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
