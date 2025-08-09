import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  DimensionValue,
} from "react-native";
import ReciterImg from "./ReciterImg";
import getName from "./../../helpers/getName";
import { isRTL } from "../../helpers/flexDirection";

const ReciterCard = ({ reciter, handleNavigateClick, numColumns }) => {
  if (!reciter) return null;

  // Calculate percentage width per card
  const columnWidth = `${100 / numColumns}%`;

  return (
    <Pressable style={{ width: columnWidth as DimensionValue }}>
      <TouchableOpacity onPress={handleNavigateClick} className="p-2 my-2">
        <View className="w-full">
          <View className="items-center pb-3">
            <ReciterImg uri={reciter.photo} alt={getName(reciter)} />
          </View>
        </View>

        <Text
          numberOfLines={3}
          ellipsizeMode="tail" // show "..." if still too long
          style={{
            flexWrap: "wrap",
            textAlign: "center",
          }}
          className={`${
            isRTL ? "text-[18px]" : "text-[15px]"
          } font-semibold text-gray-100`}
        >
          {getName(reciter)}
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default ReciterCard;
