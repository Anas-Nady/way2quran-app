import React, { useState, useContext, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { rowDirection } from "../helpers/flexDirection";

export default function Surah() {
  const { screenWidth, screenHeight } = useContext(ScreenDimensionsContext);
  const route = useRoute();
  const [contentFit, setContentFit] = useState("fill");
  const [currentPage, setCurrentPage] = useState(
    parseInt(route.params.pageNumber)
  );
  const [showArrows, setShowArrows] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const leftArrowAnim = useRef(new Animated.Value(0)).current;
  const rightArrowAnim = useRef(new Animated.Value(0)).current;
  const fitScreenAnim = useRef(new Animated.Value(0.8)).current;
  const [currentZoom, setCurrentZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1.5);

  useEffect(() => {
    const checkFirstTime = async () => {
      const hasSeenArrows = await AsyncStorage.getItem("hasSeenArrows");
      if (!hasSeenArrows) {
        setShowArrows(true);
        await AsyncStorage.setItem("hasSeenArrows", "true");
        animateArrows();
        setTimeout(() => fadeOutArrows(), 3000);
      }
    };
    checkFirstTime();
  }, []);

  useEffect(() => {
    // Listen to orientation changes
    const updateContentFit = () => {
      const { width, height } = Dimensions.get("window");
      setContentFit(width > height ? "contain" : "fill");
      setMaxZoom(width > height ? 3 : 1.5);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      updateContentFit
    );

    updateContentFit();

    return () => {
      subscription.remove();
    };
  }, []);

  // Fade-out animation for arrows
  const fadeOutArrows = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500, // 500ms fade-out
      useNativeDriver: true,
    }).start(() => setShowArrows(false)); // Hide completely after animation
  };

  // Navigate to the next page
  const goToNextPage = () => {
    if (currentPage < 604) {
      setCurrentPage((prevPage) => prevPage + 1);
      hideArrows(); // Hide arrows after scrolling
    }
  };

  // Hide arrows with fade-out animation
  const hideArrows = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500, // 500ms fade-out duration
      useNativeDriver: true,
    }).start(() => setShowArrows(false)); // Hide arrows completely
  };

  // Navigate to the previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      hideArrows(); // Hide arrows after scrolling
    }
  };

  // Detect swipe gestures using PanResponder
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;

        if (dx > 50) {
          // Swipe right (go to the next page)
          goToNextPage();
        } else if (dx < -50) {
          // Swipe left (go to the previous page)
          goToPreviousPage();
        }
      },
    })
  ).current;

  const animateArrows = () => {
    // Left arrow: Moves from center to the left
    Animated.loop(
      Animated.sequence([
        Animated.timing(leftArrowAnim, {
          toValue: -30, // Move left by 30 pixels
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(leftArrowAnim, {
          toValue: 0, // Return to original position
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Right arrow: Moves from center to the right
    Animated.loop(
      Animated.sequence([
        Animated.timing(rightArrowAnim, {
          toValue: 30, // Move right by 30 pixels
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rightArrowAnim, {
          toValue: 0, // Return to original position
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fitScreenAnim, {
          toValue: 1, // Scale to 1
          duration: 500, // 500ms for scaling up
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(fitScreenAnim, {
          toValue: 0.8, // Scale back to 0.8
          duration: 500, // 500ms for scaling down
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const surahPage = `https://storage.googleapis.com/way2quran_storage/quran-pages/${currentPage}.jpg`;

  const handleZoomChange = () => {
    const zoomValue = zoomableViewRef.current.zoomAnim;
    if (zoomValue <= 1) {
      setCurrentZoom(1);
    } else {
      setCurrentZoom(zoomValue);
    }
    startAnimation();
  };

  const zoomableViewRef = useRef(null);

  const handleResetZoom = () => {
    zoomableViewRef?.current.zoomTo(1);
    setCurrentZoom(1);
  };

  return (
    <ReactNativeZoomableView
      ref={zoomableViewRef}
      maxZoom={maxZoom}
      minZoom={1}
      zoomStep={0.5}
      initialZoom={1}
      bindToBorders={true}
      shouldRasterizeIOS={true}
      style={{
        flex: 1,
      }}
      onZoomAfter={handleZoomChange}
      onZoomEnd={handleZoomChange}
    >
      <View
        style={[styles.container, { width: screenWidth, height: screenHeight }]}
        {...(currentZoom <= 1 ? panResponder.panHandlers : undefined)}
      >
        {showArrows && (
          <View style={styles.arrowContainer}>
            {/* Left Arrow */}
            <Animated.View
              style={[
                styles.arrow,
                styles.leftArrow,
                { transform: [{ translateX: leftArrowAnim }] },
              ]}
            >
              <View style={styles.arrowShape}>
                <AntDesign name="arrowleft" size={24} color="white" />
              </View>
            </Animated.View>

            {/* Right Arrow */}
            <Animated.View
              style={[
                styles.arrow,
                styles.rightArrow,
                { transform: [{ translateX: rightArrowAnim }] },
              ]}
            >
              <View style={styles.arrowShape}>
                <AntDesign name="arrowright" size={30} color="white" />
              </View>
            </Animated.View>
          </View>
        )}

        {/* Add Reset Zoom Button */}
        {currentZoom !== 1 && (
          <Animated.View
            style={[
              styles.resetZoomButton,
              { transform: [{ scale: fitScreenAnim }] },
            ]}
            onTouchEnd={handleResetZoom}
          >
            <MaterialCommunityIcons
              name="fit-to-screen"
              size={26}
              color="white"
            />
          </Animated.View>
        )}

        <Image
          source={surahPage}
          style={styles.quranImage}
          contentFit={contentFit}
          transition={300}
        />
      </View>
    </ReactNativeZoomableView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#FEF9DE",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomContainer: {
    flex: 1,
  },
  quranImage: {
    width: "100%",
    height: "100%",
  },
  arrowContainer: {
    position: "absolute",
    top: "50%",
    width: "100%",
    flexDirection: rowDirection(),
    justifyContent: "space-between",
    paddingHorizontal: 30,
    zIndex: 10,
  },
  arrow: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  arrowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  resetZoomButton: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 30,
    padding: 10,
    zIndex: 10,
  },
});
