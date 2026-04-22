import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import BusinessCard from "../../src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "../../src/components/common/ScreenHeader/ScreenHeader";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { businessesMock } from "../../src/mocks/businesses.mock";

export default function HomeScreen() {
  const handleLocationPress = () => {
    console.log("Open location picker");
    // later: open bottom sheet / modal
    // first option: Use my location
    // then: list of cities / states
  };

  const handleMapPress = () => {
    console.log("Open map");
  };

  const handleFilterPress = () => {
    router.push("/modal/filter");
  };

  const handleAddPress = () => {
    router.push("/add-business/search");
  };

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="Discover"
        titleSubtitle="Community trusted places"
        subtitleLabel="Location"
        subtitleValue="California, USA"
        onSubtitlePress={handleLocationPress}
        showSubtitleChevron
        showSearch
        searchPlaceholder="Find services, food or places"
        actions={["map", "filter", "add"]}
        onPressMap={handleMapPress}
        onPressFilter={handleFilterPress}
        onPressAdd={handleAddPress}
      />

      <View style={styles.listWrap}>
        <FlatList
          data={businessesMock}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <BusinessCard
              business={item}
              onPress={() =>
                router.push({
                  pathname: "/business/[id]",
                  params: { id: String(item.id) },
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  listWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
});
