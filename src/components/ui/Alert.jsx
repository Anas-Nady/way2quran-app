import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { flexDirection } from "../../helpers/flexDirection";
import { ScreenDimensionsContext } from "../../contexts/ScreenDimensionsProvider";

const Alert = ({ message, type = "success", duration = 2500, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const { screenWidth: width, screenHeight: height } = useContext(
    ScreenDimensionsContext
  );

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, []);

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      default:
        return "information-circle";
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: "absolute",
        top: 0,
        left: width * 0.1,
        right: width * 0.1,
        zIndex: 100,
        transform: [{ translateX: 0 }],
        width: width * 0.8,
        margin: "auto",
      }}
    >
      <View
        className={`${flexDirection()} w-full mx-auto items-center p-4 border rounded-lg shadow-md bg-gray-800 border-gray-500`}
      >
        <Ionicons
          name={getIconName()}
          size={24}
          color="#22c55e"
          className="mx-1"
        />
        <Text className="flex-1 px-2 text-base font-semibold text-center text-white">
          {message}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="p-1 border border-gray-500 rounded-full"
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Alert;
