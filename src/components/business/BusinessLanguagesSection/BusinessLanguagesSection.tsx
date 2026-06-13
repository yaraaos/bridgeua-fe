import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { createStyles } from "./BusinessLanguagesSection.styles";

type Props = {
  languages?: string[];
};

export default function BusinessLanguagesSection({ languages }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  if (!languages?.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("business.languagesSpoken")}</Text>

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