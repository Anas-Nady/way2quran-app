import React, { useState } from "react";
import { View, TouchableOpacity, Linking, Pressable } from "react-native";
import getName from "../helpers/getName";
import { incrementDownloadCount } from "../services/api";
import CustomText from "./ui/CustomText";
import { Image } from "expo-image";

export default function MushafCard({ mushaf }) {
  const [loading, setLoading] = useState(false);

  const handleDownloadMushaf = async () => {
    try {
      setLoading(true);
      await incrementDownloadCount({ slug: mushaf.slug });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    Linking.openURL(mushaf.downloadURL);
  };

  const mushafName = getName(mushaf);

  return (
    <Pressable disabled={loading}>
      <View className="w-full">
        <TouchableOpacity
          className="p-2 my-3 w-[80%] mx-auto border border-gray-600"
          onPress={handleDownloadMushaf}
        >
          <View className="items-center justify-center">
            <Image
              source={{ uri: mushaf.imageURL }}
              alt={mushafName}
              contentFit="contain"
              style={{ width: "100%", height: 250 }}
            />
          </View>
          <CustomText className="py-1 mt-1 text-lg font-semibold text-center bg-gray-700 text-slate-200">
            {mushafName}
          </CustomText>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}
