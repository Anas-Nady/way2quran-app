import React from "react";
import { View } from "react-native";
import { useContext } from "react";
import { ScreenDimensionsContext } from "../../contexts/ScreenDimensionsProvider";
import CustomText from "../ui/CustomText";

export default function Error({ message }) {
  const { screenWidth: width } = useContext(ScreenDimensionsContext);

  return (
    <View style={{ width }} className="flex-1 p-3 bg-slate-800">
      <View
        className="p-4 mx-auto bg-gray-900 border border-gray-500"
        style={{ width: width * 0.9 }}
      >
        <CustomText className="text-lg font-semibold text-center text-red-500">
          {message}
        </CustomText>
      </View>
    </View>
  );
}
