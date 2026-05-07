import { Text, View } from "react-native";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./AppEmptyState.styles";

type Props = {
  title: string;
  description?: string;
};

export default function AppEmptyState({ title, description }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}