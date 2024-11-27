import React from "react";
import { View, StyleSheet, Image } from "react-native";
import splashScreen from "./../assets/images/Splash_Screen.png";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={splashScreen}
        style={{ width: 500, height: 500 }}
        resizeMode="contain"
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
