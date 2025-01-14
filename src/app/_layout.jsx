import { Stack } from "expo-router";
import {
  AudioPlayerProvider,
  useAudioPlayer,
} from "../contexts/AudioPlayerContext";
import { ScreenDimensionsProvider } from "../contexts/ScreenDimensionsProvider";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useCallback } from "react";
import TrackPlayer from "react-native-track-player";
import trackPlayer from "../services/trackPlayer";
import { useCustomFonts } from "../services/font";
import { I18nManager, TouchableWithoutFeedback, View } from "react-native";
import SplashScreen from "../components/SplashScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/Navigation/TopBar";
import TabBar from "../components/Navigation/TabBar";
import AudioPlayerModal from "../components/Reciter/AudioPlayerModal";

const MainLayout = () => {
  const { getPlayerModalHeight } = useAudioPlayer();
  const playerModalHeight = getPlayerModalHeight();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tabsHeight = 55;

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={{ flex: 1 }}>
        <TopBar
          isMenuOpen={isMenuOpen}
          closeMenu={closeMenu}
          toggleMenu={toggleMenu}
        />
        <View
          style={{
            flex: 1,
            marginBottom: playerModalHeight + tabsHeight,
            paddingBottom: 5,
          }}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </View>

        {/* Audio Player Modal */}
        <View
          style={{
            position: "absolute",
            bottom: tabsHeight + 5,
            left: 0,
            right: 0,
            zIndex: 200,
          }}
          className="w-full"
        >
          <AudioPlayerModal />
        </View>

        {/* Tab Bar */}
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <TabBar closeMenu={closeMenu} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const RootLayout = () => {
  const { fontsLoaded, error } = useCustomFonts();
  const [splashScreenLoaded, setSplashScreenLoaded] = useState(true);

  useEffect(() => {
    I18nManager.forceRTL(I18nManager.isRTL);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreenLoaded(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded && !error) return null;
  if (splashScreenLoaded) return <SplashScreen />;

  return (
    <AudioPlayerProvider>
      <ScreenDimensionsProvider>
        <StatusBar style="light" />
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} className={`bg-gray-800`}>
            <MainLayout />
          </SafeAreaView>
        </SafeAreaProvider>
      </ScreenDimensionsProvider>
    </AudioPlayerProvider>
  );
};

TrackPlayer.registerPlaybackService(() => trackPlayer);

export default RootLayout;
