import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { AppColors } from "@/src/constants/colors";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SearchEmptyScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { query } = useLocalSearchParams<{ query?: string }>();

  const { categories } = useCategories();
  const popularCategories = categories.slice(0, 5).map((c) => c.name);

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader title="Search" onBack={() => router.back()} />

      <View style={styles.content}>
        <AppEmptyState
          title={`No results for "${query ?? ""}"`}
          description="Try checking the spelling or searching for a broader category."
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular categories</Text>

          <View style={styles.chips}>
            {popularCategories.map((category) => (
              <Pressable
                key={category}
                style={styles.chip}
                onPress={() =>
                  router.replace({
                    pathname: "/search/results" as never,
                    params: { query: category },
                  })
                }
              >
                <Text style={styles.chipText}>{category}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      padding: 0,
    },

    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 64,
      alignItems: "center",
      gap: 32,
    },

    section: {
      width: "100%",
      gap: 12,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
    },

    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 10,
    },

    chip: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    chipText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "500",
    },
  });
}
