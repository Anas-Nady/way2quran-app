import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import ReciterImg from "./ReciterImg";
import getName from "./../../helpers/getName";
import { isRTL } from "../../helpers/flexDirection";

const ReciterCard = ({ reciter, handleNavigateClick }) => {
  if (!reciter) {
    return null;
  }

  return (
    <TouchableOpacity
      style={{ flex: 1, paddingVertical: 10 }}
      onPress={handleNavigateClick}
    >
      <View className="w-full">
        <View className="items-center pb-3">
          <ReciterImg uri={reciter.photo} alt={getName(reciter)} />
        </View>
      </View>
      <Text
        className={`${
          isRTL ? "text-[18px]" : "text-[15px]"
        } font-semibold h-[50px] w-full text-center text-gray-100`}
      >
        {getName(reciter)}
      </Text>
    </TouchableOpacity>
  );
};

export default ReciterCard;
