import {
  SafeAreaView,
  StatusBar,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabBar from "../components/Navigation/TabBar";
import AudioPlayerModal from "../components/Reciter/AudioPlayerModal";
import { AppNavigator } from "../navigationConfig";
import { useState, useCallback, useEffect } from "react";
import { currentLanguage } from "../helpers/flexDirection";
import SplashScreen from "../screens/SplashScreen";
import TopBar from "./Navigation/TopBar";

function getPlayerModalHeight(playerState) {
  if (playerState.isModalVisible) {
    return playerState.isModalExpanded ? 165 : 80;
  }
  return 0;
}

function Layout({ playerState }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [splashScreenLoaded, setSplashScreenLoaded] = useState(true);
  const tabsHeight = 55;
  const playerModalHeight = getPlayerModalHeight(playerState);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreenLoaded(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  if (splashScreenLoaded) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer independent={true}>
      <SafeAreaView
        className={`${
          currentLanguage === "ar" ? "font-arabic" : "font-english"
        } flex-1 bg-gray-800`}
      >
        <StatusBar backgroundColor="#22c55e" barStyle="light-content" />

        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={{ flex: 1 }}>
            <TopBar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <View
              style={{
                flex: 1,
                marginBottom: playerModalHeight + tabsHeight,
                paddingBottom: 5,
              }}
            >
              <AppNavigator />
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
            <View
              style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            >
              <TabBar />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default Layout;
