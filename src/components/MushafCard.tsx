import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Linking,
  Pressable,
} from "react-native";
import getName from "../helpers/getName";
import { incrementDownloadCount } from "../services/api";
import CustomText from "./CustomText";

export default function MushafCard({ mushaf, width }) {
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
          className="p-2 my-3 w-[85%] mx-auto border border-gray-600"
          onPress={handleDownloadMushaf}
        >
          <View className="items-center justify-center">
            <Image
              source={{ uri: mushaf.imageURL }}
              alt={mushafName}
              resizeMode="contain"
              style={{ width: "100%", height: 250 }}
            />
          </View>
          <CustomText className="py-1 mt-1 text-lg font-semibold text-center bg-gray-600 text-slate-300">
            {mushafName}
          </CustomText>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}
