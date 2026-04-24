import { Text, View } from "react-native";

import { styles } from "./AppEmptyState.styles";

type Props = {
  title: string;
  description?: string;
};

export default function AppEmptyState({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}