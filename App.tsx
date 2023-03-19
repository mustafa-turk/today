import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import HomeScreen from "@/screens/home";

export default function App() {
  return (
    <View style={styles.container}>
      <HomeScreen />
      <StatusBar style='light' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
});
