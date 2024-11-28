import React from "react";
import { View, StyleSheet, Image } from "react-native";
import splashScreen from "./../assets/images/Splash_Screen.png";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={splashScreen}
        resizeMode="contain"
        style={{ width: "100%", height: "100%", flex: 1 }}
      />
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
