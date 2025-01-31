import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";

const SplashScreen = () => {
  const appVersion = Constants.expoConfig.version;

  return (
    <View style={styles.container}>
      <Image
        source={require("./../assets/images/Splash_Screen.png")}
        resizeMode="contain"
        style={{ width: "100%", height: "100%", flex: 1 }}
      />
      <Text
        className="text-lg font-bold text-green-600"
        style={{
          position: "absolute",
          bottom: 30,
        }}
      >
        v{appVersion}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;
