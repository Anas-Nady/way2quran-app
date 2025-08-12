import React from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import CustomText from "./ui/CustomText";
import { Image } from "expo-image";

const SplashScreen = () => {
  const appVersion = Constants.expoConfig.version;

  return (
    <View style={styles.container}>
      <Image
        source={require("./../assets/images/Splash_Screen.png")}
        contentFit="contain"
        style={{ width: "100%", height: "100%", flex: 1 }}
      />
      <CustomText
        className="text-lg font-bold text-green-600 font-english"
        style={{
          position: "absolute",
          bottom: 30,
        }}
      >
        v{appVersion}
      </CustomText>
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
