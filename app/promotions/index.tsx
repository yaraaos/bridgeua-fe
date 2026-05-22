import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import PromotionCard from "@/src/components/promotions/PromotionCard";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { usePromotions } from "@/src/features/promotions/hooks/usePromotions";
import { router } from "expo-router";
import { FlatList, StyleSheet } from "react-native";

export default function PromotionsScreen() {
  const styles = createStyles();

  const { promotions, isLoading } = usePromotions();

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <AppScreen>
      <ScreenHeader
        title="Promotions"
        titleSubtitle="Latest offers from businesses you follow"
      />

      <FlatList
        data={promotions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <PromotionCard
            promotion={item}
            onPress={() =>
              router.push({
                pathname: "/promotions/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </AppScreen>
  );
}

function createStyles() {
  return StyleSheet.create({
    content: {
      padding: 16,
      paddingBottom: 120,
    },
  });
}
