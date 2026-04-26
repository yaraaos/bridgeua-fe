import { router } from "expo-router";
import { ImageBackground, Text, View } from "react-native";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import { styles } from "./splash.styles";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://plus.unsplash.com/premium_vector-1742630421778-6c07d609cde3?q=80&w=696&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",    //CHANGE
        }}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.center}>
            <Text style={styles.logo}>
              Bridge<Text style={styles.ua}>UA</Text>
            </Text>
            <Text style={styles.subtitle}>Recommendations built on trust</Text>
          </View>

          <View style={styles.footer}>
            <AppButton
              title="Start"
              onPress={() => router.replace("/onboarding")}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
