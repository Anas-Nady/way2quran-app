import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

const SplashScreen = () => {
  const appVersion = Constants.expoConfig.version;
  const { t } = useTranslation("");

  return (
    <View style={styles.container}>
      <Image
        source={require("./../assets/images/Splash_Screen.png")}
        resizeMode="contain"
        style={{ width: "100%", height: "100%", flex: 1 }}
      />
      <Text
        className="text-xl font-bold text-green-600 "
        style={{
          position: "absolute",
          bottom: 35,
        }}
      >
        {t("version")}: {appVersion}
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
