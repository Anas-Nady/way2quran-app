import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { flexDirection } from "../../helpers/flexDirection";
import {
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ISocialMedia } from "../../types/types";

const SocialMediaIcons = ({ data }) => {
  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return data.map((chunk: ISocialMedia[], index: string) => (
    <View
      key={index}
      className={`${flexDirection()} my-1 justify-between items-center p-4 w-[90%] mx-auto bg-gray-700 border border-gray-600`}
    >
      {chunk.map((item: ISocialMedia) => {
        const IconComponent =
          item.icon.includes("gmail") || item.icon.includes("web")
            ? MaterialCommunityIcons
            : item.icon === "threads" || item.icon === "square-x-twitter"
            ? FontAwesome6
            : FontAwesome5;

        return (
          <TouchableOpacity key={item.id} onPress={() => handlePress(item.url)}>
            <IconComponent name={item.icon} size={24} color={item.color} />
          </TouchableOpacity>
        );
      })}
    </View>
  ));
};

export default SocialMediaIcons;
