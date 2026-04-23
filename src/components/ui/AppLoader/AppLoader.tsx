import { ActivityIndicator, View } from "react-native";
import { styles } from "./AppLoader.styles";

export default function AppLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2DBE7F" />
    </View>
  );
}
