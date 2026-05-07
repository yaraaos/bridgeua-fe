import { Text, View } from "react-native";
import { styles } from "./BusinessLanguagesSection.styles";

type Props = {
  languages?: string[];
};

export default function BusinessLanguagesSection({ languages }: Props) {
  if (!languages?.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Languages spoken</Text>

      <View style={styles.chipGrid}>
        {languages.map((language) => (
          <View key={language} style={styles.chip}>
            <Text style={styles.chipText}>{language}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
